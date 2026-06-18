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
import CodeBlock from "../components/CodeBlock";

const SETUP_SQL = `-- Create the AI memory table
CREATE TABLE IF NOT EXISTS ai_memory (
  id          UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  applies_to  TEXT         NOT NULL,
  content     TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Enable RLS to block anonymous/public access.
-- Claude connects via the service role (MCP), which bypasses RLS, so it is unaffected.
ALTER TABLE ai_memory ENABLE ROW LEVEL SECURITY;

-- Seed default memory rows
INSERT INTO ai_memory (applies_to, content) VALUES
  ('always', ''),
  ('creating a new table', 'Every table you create MUST include these standard columns:
  id          UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()

Use snake_case for all table and column names.

After creating the table, always enable row-level security to block anonymous access:
  ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;

Claude connects via the service role, which bypasses RLS, so this does not affect your ability to read or write data.');`;

interface StepSupabaseProps {
    onNext: () => void;
}

export default function StepSupabase({ onNext }: StepSupabaseProps) {

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
                <Text>
                    Only one member of the family needs to do this step - just use the same project reference ID for everyone in the next step. If you want to set up separate databases for each person, that's fine too!.
                </Text>
            </Alert>

            <Box>
                <Heading size="md" mb={3}>
                    Create an account and project
                </Heading>
                <OrderedList spacing={2} pl={4}>
                    <ListItem>
                        Go to{" "}
                        <Link href="https://supabase.com" color="green.600" isExternal>
                            supabase.com
                        </Link>{" "}
                        and click <strong>Start your project</strong>. Sign in with GitHub or email
                        — it's free.
                    </ListItem>
                    <ListItem>
                        Click <strong>New orgamization</strong>. Give it any name (e.g.{" "}
                        <code>The Miles Family</code>).
                    </ListItem>
                    <ListItem>
                        Click <strong>New project</strong>. Give it any name (e.g.{" "}
                        <code>TeaseNotes</code>). Pick the region closest to you. Set a database
                        password and save it somewhere safe — you won't need it often but it's good
                        to have.
                    </ListItem>
                    <ListItem>Wait about 60 seconds for the project to spin up.</ListItem>
                    <ListItem>
                        Note your <strong>Project Reference ID</strong> — it's the short code in
                        your project URL:{" "}
                        <code>https://supabase.com/dashboard/project/<strong>abcdefghijkl</strong></code>.
                        You'll use it in the next step to scope Claude to just this project.
                    </ListItem>
                </OrderedList>
            </Box>

            <Box>
                <Heading size="md" mb={2}>
                    Run the setup SQL
                </Heading>
                <Text color="gray.600" mb={3}>
                    In your Supabase project, open the <strong>SQL Editor</strong> (left sidebar),
                    paste the query below, and click <strong>Run</strong>.
                </Text>
                <Text color="gray.500" fontSize="sm" mb={3}>
                    <strong>Note on Row Level Security:</strong> Supabase may warn that this table
                    has no RLS policies. That's fine — Claude accesses your database through
                    Supabase's MCP using the service role, which bypasses RLS entirely. The SQL
                    below disables RLS on this table to silence that warning.
                </Text>
                <CodeBlock code={SETUP_SQL} language="sql" />
            </Box>

            <Alert status="success" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                    No keys to copy — Supabase's official MCP connector handles authentication for
                    you in the next step.
                </Text>
            </Alert>

            <Button
                colorScheme="green"
                size="lg"
                alignSelf="flex-end"
                onClick={onNext}
            >
                Next: Connect Claude to your database →
            </Button>
        </VStack>
    );
}

