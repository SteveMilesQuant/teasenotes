import {
    Box,
    Button,
    Heading,
    HStack,
    Link,
    ListItem,
    OrderedList,
    Text,
    VStack,
    Alert,
    AlertIcon,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CodeBlock from "../components/CodeBlock";

const SYSTEM_PROMPT = `You are my family's notes and to-do assistant, and liason to the family database. You have access to our PostgreSQL database via Supabase MCP tools. As liason, you will translate natural language requests into SQL queries to read and write to the database, and return results in natural human-readable language. You will also manage the database schema as needed to keep our data organized.

## Your tools (Supabase MCP)
- list_tables — see what tables and columns currently exist
- execute_sql(query) — run any SQL: SELECT to read, INSERT/UPDATE/DELETE to write, CREATE TABLE for new categories
- apply_migration(name, query) — use this for CREATE TABLE and ALTER TABLE statements

## Your memory
- You have a dedicated table to remember important details called ai_memory
- This table has a column called "applies_to" - ONLY fetch instructions that apply to the relevant topic (e.g. always, todos, groceries, etc.)
- At the beginning of each conversation
    - Query id, applies_to for all rows in ai_memory
    - Query content for any rows where applies_to is "always" or matches the current topic
- Feel free to query more rows as the conversation progresses
- Consider updating this table at every turn with new information you learn, so you can refer back to it later. In particular, these situations warrant an update to memory:
    - User shares a new preference or important detail
    - User corrects you on something
    - You create a new table
    - You learn something new about the existing schema
`;

export default function StepClaude() {
    const navigate = useNavigate();

    return (
        <VStack align="stretch" gap={6}>
            <Box>
                <Text color="green.600" fontWeight="semibold" mb={1}>
                    Step 3 of 4
                </Text>
                <Heading size="xl" mb={2}>
                    Set up your Claude Project
                </Heading>
                <Text color="gray.600" fontSize="lg">
                    If you completed Step 2, Claude already has Supabase connected. Now create a
                    Project with standing instructions so every chat knows how to organize your data.
                </Text>
            </Box>

            <Alert status="success" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                    Claude Projects and MCP connectors are available on the{" "}
                    <strong>free Claude tier</strong> — no Pro subscription needed.
                </Text>
            </Alert>

            <Tabs colorScheme="green" variant="enclosed">
                <TabList>
                    <Tab>iPhone / iPad</Tab>
                    <Tab>Web (claude.ai)</Tab>
                    <Tab>Desktop app</Tab>
                </TabList>

                <TabPanels>
                    {/* iOS */}
                    <TabPanel px={0}>
                        <VStack align="stretch" gap={4}>
                            <Heading size="sm">Create a Project</Heading>
                            <OrderedList spacing={2} pl={4}>
                                <ListItem>
                                    Tap <strong>Projects → New Project</strong>. Name it{" "}
                                    <em>My Notes</em>.
                                </ListItem>
                                <ListItem>
                                    Tap <strong>Project Instructions</strong> and paste the system
                                    prompt below.
                                </ListItem>
                                <ListItem>
                                    Make sure the <strong>Supabase connector</strong> is enabled for
                                    this project (tap the project settings → Connectors).
                                </ListItem>
                                <ListItem>
                                    Start a new chat inside the project and try:{" "}
                                    <em>"What tables do I have?"</em>
                                </ListItem>
                            </OrderedList>
                        </VStack>
                    </TabPanel>

                    {/* Web */}
                    <TabPanel px={0}>
                        <VStack align="stretch" gap={4}>
                            <Heading size="sm">Create a Project</Heading>
                            <OrderedList spacing={2} pl={4}>
                                <ListItem>
                                    Go to{" "}
                                    <Link href="https://claude.ai" color="green.600" isExternal>
                                        claude.ai
                                    </Link>{" "}
                                    → click <strong>Projects → New Project</strong>. Name it{" "}
                                    <em>My Notes</em>.
                                </ListItem>
                                <ListItem>
                                    Click <strong>Edit project instructions</strong> and paste the
                                    system prompt below.
                                </ListItem>
                                <ListItem>
                                    In the project settings, verify the <strong>Supabase</strong>{" "}
                                    connector is toggled on.
                                </ListItem>
                                <ListItem>
                                    Start a chat and try: <em>"What tables do I have?"</em>
                                </ListItem>
                            </OrderedList>
                        </VStack>
                    </TabPanel>

                    {/* Desktop */}
                    <TabPanel px={0}>
                        <VStack align="stretch" gap={4}>
                            <Heading size="sm">Create a Project</Heading>
                            <OrderedList spacing={2} pl={4}>
                                <ListItem>
                                    Open Claude Desktop → <strong>Projects → New Project</strong> →
                                    name it <em>My Notes</em>.
                                </ListItem>
                                <ListItem>
                                    Paste the system prompt below into <strong>Project Instructions</strong>.
                                </ListItem>
                                <ListItem>
                                    Confirm the Supabase connector is enabled for the project.
                                </ListItem>
                            </OrderedList>
                        </VStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>

            <Box>
                <Heading size="md" mb={3}>
                    System prompt — paste into Project Instructions
                </Heading>
                <CodeBlock code={SYSTEM_PROMPT} language="text" />
            </Box>

            <HStack justify="space-between">
                <Button variant="ghost" onClick={() => navigate("/step/2")}>
                    ← Back
                </Button>
                <Button colorScheme="green" size="lg" onClick={() => navigate("/step/4")}>
                    Next: Test it →
                </Button>
            </HStack>
        </VStack>
    );
}
