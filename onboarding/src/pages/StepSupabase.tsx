import {
    Box,
    Button,
    Heading,
    Link,
    ListItem,
    OrderedList,
    Text,
    VStack,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CodeBlock from "../components/CodeBlock";

const BOOTSTRAP_SQL = `-- Run this once in the Supabase SQL Editor (Database → SQL Editor)
-- It creates two helper functions the MCP server calls.

CREATE OR REPLACE FUNCTION public.exec_sql_query(p_sql text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  EXECUTE format(
    'SELECT jsonb_agg(row_to_json(t)) FROM (%s) t',
    p_sql
  ) INTO v_result;
  RETURN COALESCE(v_result, '[]'::jsonb);
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION '%', SQLERRM;
END;
$$;

CREATE OR REPLACE FUNCTION public.exec_sql_write(p_sql text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  EXECUTE p_sql;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN jsonb_build_object('ok', true, 'rows_affected', v_count);
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION '%', SQLERRM;
END;
$$;`;

export default function StepSupabase() {
    const navigate = useNavigate();

    return (
        <VStack align="stretch" gap={6}>
            <Box>
                <Text color="green.600" fontWeight="semibold" mb={1}>
                    Step 1 of 4
                </Text>
                <Heading size="xl" mb={2}>
                    Create your Supabase database
                </Heading>
                <Text color="gray.600" fontSize="lg">
                    Supabase gives you a free PostgreSQL database in the cloud — no credit card needed.
                </Text>
            </Box>

            <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                    The free tier includes 500 MB storage and 50,000 API calls per day — more than
                    enough for a family notes app. The only gotcha: free projects pause after 7 days of
                    inactivity (Step 2 will fix this automatically).
                </Text>
            </Alert>

            <Box>
                <Heading size="md" mb={3}>
                    1a — Create an account and project
                </Heading>
                <OrderedList spacing={2} pl={4}>
                    <ListItem>
                        Go to{" "}
                        <Link href="https://supabase.com" color="green.600" isExternal>
                            supabase.com
                        </Link>{" "}
                        and click <strong>Start your project</strong> (free, sign in with GitHub or email).
                    </ListItem>
                    <ListItem>
                        Click <strong>New project</strong>. Name it <code>teasenotes</code>. Choose the
                        region closest to you. Set a database password and save it somewhere safe.
                    </ListItem>
                    <ListItem>Wait about 60 seconds for the project to spin up.</ListItem>
                </OrderedList>
            </Box>

            <Box>
                <Heading size="md" mb={3}>
                    1b — Copy your credentials
                </Heading>
                <OrderedList spacing={2} pl={4}>
                    <ListItem>
                        In your project, go to <strong>Settings → API</strong>.
                    </ListItem>
                    <ListItem>
                        Copy the <strong>Project URL</strong> — it looks like{" "}
                        <code>https://abcdefghijkl.supabase.co</code>. Save it; you'll need it in Step 2.
                    </ListItem>
                    <ListItem>
                        Copy the <strong>service_role</strong> key (under "Project API keys" — click
                        "Reveal"). This is a secret — never share it publicly. Save it for Step 2.
                    </ListItem>
                </OrderedList>
            </Box>

            <Box>
                <Heading size="md" mb={3}>
                    1c — Bootstrap the SQL helper functions
                </Heading>
                <Text mb={3} color="gray.600">
                    The MCP server needs two helper functions to run SQL on your behalf. Run this
                    once in the Supabase SQL Editor (<strong>Database → SQL Editor → New query</strong>):
                </Text>
                <CodeBlock code={BOOTSTRAP_SQL} language="sql" />
                <Text fontSize="sm" color="gray.500" mt={2}>
                    Click <strong>Run</strong> in the SQL Editor. You should see "Success. No rows
                    returned." for each function.
                </Text>
            </Box>

            <Button
                colorScheme="green"
                size="lg"
                alignSelf="flex-end"
                onClick={() => navigate("/step/2")}
            >
                Next: Deploy the MCP server →
            </Button>
        </VStack>
    );
}
