/**
 * Teasenotes MCP Server — Cloudflare Worker
 *
 * Implements the MCP Streamable HTTP transport (2025-03-26) manually,
 * with no Durable Objects and no external MCP framework.
 *
 * Authentication: Bearer token in Authorization header.
 * API_KEYS env var format: "key1:steve,key2:sarah"
 *
 * Supabase integration: calls two SECURITY DEFINER functions that must
 * be created once in your Supabase project (see onboarding site).
 */

// ---------------------------------------------------------------------------
// Environment binding types
// ---------------------------------------------------------------------------

export interface Env {
    /** Full Supabase project URL, e.g. https://abcdef.supabase.co */
    SUPABASE_URL: string;
    /** Supabase service_role key — keep this secret! */
    SUPABASE_SERVICE_KEY: string;
    /**
     * Comma-separated API key:username pairs.
     * Example:  "abc123:steve,def456:sarah"
     * Generate keys: node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
     */
    API_KEYS: string;
}

// ---------------------------------------------------------------------------
// MCP JSON-RPC types
// ---------------------------------------------------------------------------

interface RpcRequest {
    jsonrpc: "2.0";
    method: string;
    params?: Record<string, unknown>;
    id?: string | number | null;
}

interface RpcResponse {
    jsonrpc: "2.0";
    result?: unknown;
    error?: { code: number; message: string };
    id: string | number | null;
}

// ---------------------------------------------------------------------------
// Authentication helpers
// ---------------------------------------------------------------------------

function getBearerToken(request: Request): string | null {
    const auth = request.headers.get("Authorization") ?? "";
    const m = auth.match(/^Bearer\s+(.+)$/i);
    return m?.[1] ?? null;
}

function resolveUsername(token: string, apiKeysEnv: string): string | null {
    for (const pair of apiKeysEnv.split(",")) {
        const sep = pair.indexOf(":");
        if (sep === -1) continue;
        const key = pair.slice(0, sep).trim();
        const user = pair.slice(sep + 1).trim();
        if (key === token && user) return user;
    }
    return null;
}

// ---------------------------------------------------------------------------
// Supabase SQL helpers
//
// Requires two SECURITY DEFINER functions created during onboarding:
//   public.exec_sql_query(p_sql text) → jsonb   (for SELECT)
//   public.exec_sql_write(p_sql text) → jsonb   (for INSERT/UPDATE/DELETE/DDL)
// ---------------------------------------------------------------------------

interface SupabaseErrorBody {
    message?: string;
    hint?: string;
}

async function supabaseRpc(
    env: Env,
    fn: "exec_sql_query" | "exec_sql_write",
    sql: string
): Promise<{ data: unknown; error: string | null }> {
    const url = `${env.SUPABASE_URL}/rest/v1/rpc/${fn}`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: env.SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({ p_sql: sql }),
    });

    const text = await res.text();

    if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
            const parsed = JSON.parse(text) as SupabaseErrorBody;
            msg = parsed.message ?? parsed.hint ?? text;
        } catch {
            msg = text;
        }
        return { data: null, error: msg };
    }

    try {
        return { data: JSON.parse(text), error: null };
    } catch {
        return { data: text, error: null };
    }
}

// ---------------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------------

function buildTools(username: string) {
    return [
        {
            name: "list_tables",
            description:
                "List all user-created tables and their columns in the database.",
            inputSchema: { type: "object", properties: {}, required: [] as string[] },
        },
        {
            name: "query",
            description:
                "Run a read-only SELECT query. Always filter by owner when showing personal data: " +
                `WHERE owner = '${username}' OR shared = true`,
            inputSchema: {
                type: "object",
                properties: {
                    sql: { type: "string", description: "A SELECT (or WITH … SELECT) SQL statement." },
                },
                required: ["sql"],
            },
        },
        {
            name: "write",
            description:
                `Insert, update, or delete rows. Current user is '${username}'. ` +
                `Always set owner = '${username}' on INSERT unless the user explicitly says otherwise. ` +
                "For shared family records set shared = true. " +
                "DELETE and UPDATE must always include a WHERE clause.",
            inputSchema: {
                type: "object",
                properties: {
                    sql: { type: "string", description: "An INSERT, UPDATE, or DELETE statement." },
                },
                required: ["sql"],
            },
        },
        {
            name: "create_table",
            description:
                "Create a new table. Every table MUST include: " +
                "id UUID DEFAULT gen_random_uuid() PRIMARY KEY, " +
                "owner TEXT NOT NULL, " +
                "shared BOOLEAN NOT NULL DEFAULT false, " +
                "created_at TIMESTAMPTZ NOT NULL DEFAULT now(), " +
                "updated_at TIMESTAMPTZ NOT NULL DEFAULT now().",
            inputSchema: {
                type: "object",
                properties: {
                    sql: { type: "string", description: "A CREATE TABLE IF NOT EXISTS … SQL statement." },
                },
                required: ["sql"],
            },
        },
        {
            name: "drop_table",
            description:
                "Permanently drop a table and ALL its data. " +
                "ONLY call this if the user has explicitly typed the word 'confirm' after being warned.",
            inputSchema: {
                type: "object",
                properties: {
                    table_name: { type: "string", description: "Exact name of the table to drop." },
                    confirmed: {
                        type: "boolean",
                        description: "Set true only when the user has typed the word 'confirm'.",
                    },
                },
                required: ["table_name", "confirmed"],
            },
        },
    ];
}

// ---------------------------------------------------------------------------
// Tool execution
// ---------------------------------------------------------------------------

function textContent(text: string) {
    return { content: [{ type: "text", text }] };
}

async function callTool(
    name: string,
    args: Record<string, unknown>,
    username: string,
    env: Env
): Promise<unknown> {
    switch (name) {
        case "list_tables": {
            const sql = `
        SELECT table_name, column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name NOT LIKE 'pg_%'
        ORDER BY table_name, ordinal_position
      `;
            const { data, error } = await supabaseRpc(env, "exec_sql_query", sql);
            if (error) return textContent(`Error: ${error}`);
            return textContent(JSON.stringify(data, null, 2));
        }

        case "query": {
            const sql = String(args["sql"] ?? "").trim();
            const upper = sql.toUpperCase();
            if (!upper.startsWith("SELECT") && !upper.startsWith("WITH")) {
                return textContent("Only SELECT or WITH queries are allowed here. Use 'write' for mutations.");
            }
            const { data, error } = await supabaseRpc(env, "exec_sql_query", sql);
            if (error) return textContent(`Error: ${error}`);
            return textContent(JSON.stringify(data, null, 2));
        }

        case "write": {
            const sql = String(args["sql"] ?? "").trim();
            const upper = sql.toUpperCase();
            const ddl = ["CREATE ", "DROP ", "ALTER ", "TRUNCATE ", "GRANT ", "REVOKE "];
            if (ddl.some((k) => upper.startsWith(k))) {
                return textContent("DDL belongs in create_table or drop_table tools.");
            }
            if (
                (upper.startsWith("DELETE") || upper.startsWith("UPDATE")) &&
                !upper.includes("WHERE")
            ) {
                return textContent("DELETE and UPDATE must include a WHERE clause.");
            }
            const { data, error } = await supabaseRpc(env, "exec_sql_write", sql);
            if (error) return textContent(`Error: ${error}`);
            return textContent("Success. " + JSON.stringify(data));
        }

        case "create_table": {
            const sql = String(args["sql"] ?? "").trim();
            if (!sql.toUpperCase().startsWith("CREATE TABLE")) {
                return textContent("Only CREATE TABLE statements are accepted here.");
            }
            const { data, error } = await supabaseRpc(env, "exec_sql_write", sql);
            if (error) return textContent(`Error: ${error}`);
            return textContent("Table created. " + JSON.stringify(data));
        }

        case "drop_table": {
            const tableName = String(args["table_name"] ?? "").trim();
            const confirmed = Boolean(args["confirmed"]);
            if (!confirmed) {
                return textContent(
                    `⚠️ This will permanently delete "${tableName}" and ALL its data. ` +
                    `Reply with the word "confirm" to proceed.`
                );
            }
            if (!/^[a-zA-Z_][a-zA-Z0-9_]{0,62}$/.test(tableName)) {
                return textContent("Invalid table name.");
            }
            const { error } = await supabaseRpc(
                env,
                "exec_sql_write",
                `DROP TABLE IF EXISTS public."${tableName}"`
            );
            if (error) return textContent(`Error: ${error}`);
            return textContent(`Table "${tableName}" dropped.`);
        }

        default:
            throw { code: -32601, message: `Unknown tool: ${name}` };
    }
}

// ---------------------------------------------------------------------------
// MCP method dispatcher
// ---------------------------------------------------------------------------

async function handleMethod(req: RpcRequest, username: string, env: Env): Promise<unknown> {
    switch (req.method) {
        case "initialize":
            return {
                protocolVersion: "2025-03-26",
                capabilities: { tools: {} },
                serverInfo: { name: "teasenotes", version: "1.0.0" },
            };

        case "notifications/initialized":
        case "ping":
            return {};

        case "tools/list":
            return { tools: buildTools(username) };

        case "tools/call": {
            const p = req.params as { name?: string; arguments?: Record<string, unknown> } | undefined;
            return callTool(p?.name ?? "", p?.arguments ?? {}, username, env);
        }

        default:
            throw { code: -32601, message: `Method not found: ${req.method}` };
    }
}

async function processMessage(
    msg: RpcRequest,
    username: string,
    env: Env
): Promise<RpcResponse | null> {
    if (msg.id === undefined || msg.id === null) {
        await handleMethod(msg, username, env).catch(() => undefined);
        return null;
    }
    try {
        const result = await handleMethod(msg, username, env);
        return { jsonrpc: "2.0", result, id: msg.id };
    } catch (err: unknown) {
        const e = err as { code?: number; message?: string };
        return {
            jsonrpc: "2.0",
            error: { code: e.code ?? -32603, message: e.message ?? "Internal error" },
            id: msg.id,
        };
    }
}

// ---------------------------------------------------------------------------
// CORS headers
// ---------------------------------------------------------------------------

const CORS: HeadersInit = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Mcp-Session-Id, Accept",
};

// ---------------------------------------------------------------------------
// Worker entry point
// ---------------------------------------------------------------------------

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: CORS });
        }

        if (url.pathname === "/" || url.pathname === "/health") {
            return new Response("teasenotes-mcp OK", {
                headers: { ...CORS, "Content-Type": "text/plain" },
            });
        }

        if (url.pathname !== "/mcp") {
            return new Response("Not Found", { status: 404, headers: CORS });
        }

        // Auth
        const token = getBearerToken(request);
        if (!token) {
            return new Response("Missing Authorization: Bearer <api-key>", { status: 401, headers: CORS });
        }
        if (!env.API_KEYS) {
            return new Response("Server misconfiguration: API_KEYS secret not set.", { status: 500, headers: CORS });
        }
        const username = resolveUsername(token, env.API_KEYS);
        if (!username) {
            return new Response("Invalid API key.", { status: 403, headers: CORS });
        }

        if (request.method !== "POST") {
            return new Response("MCP endpoint requires POST.", { status: 405, headers: CORS });
        }

        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return new Response(
                JSON.stringify({ jsonrpc: "2.0", error: { code: -32700, message: "Parse error" }, id: null }),
                { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
            );
        }

        const messages: RpcRequest[] = Array.isArray(body) ? (body as RpcRequest[]) : [body as RpcRequest];

        const responses: RpcResponse[] = [];
        for (const msg of messages) {
            const resp = await processMessage(msg, username, env);
            if (resp !== null) responses.push(resp);
        }

        const accept = request.headers.get("Accept") ?? "";
        const wantsSSE = accept.includes("text/event-stream");

        if (wantsSSE) {
            const sseBody = responses.map((r) => `event: message\ndata: ${JSON.stringify(r)}\n\n`).join("");
            return new Response(sseBody || "\n", {
                headers: { ...CORS, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
            });
        }

        if (responses.length === 0) {
            return new Response(null, { status: 204, headers: CORS });
        }

        const payload = responses.length === 1 ? responses[0] : responses;
        return new Response(JSON.stringify(payload), {
            headers: { ...CORS, "Content-Type": "application/json" },
        });
    },
} satisfies ExportedHandler<Env>;

