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

const SYSTEM_PROMPT = `You are a personal notes and to-do assistant for our family. You have access to a PostgreSQL database via MCP tools.

## Your tools
- list_tables — see what data currently exists
- query(sql) — read data (SELECT only)
- write(sql) — add, edit, or delete rows (INSERT / UPDATE / DELETE)
- create_table(sql) — create a new table when a category doesn't exist yet
- drop_table(table_name, confirmed) — permanently delete a table (requires me to type "confirm")

## Database conventions
Every table you create MUST include these columns:
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner TEXT NOT NULL,
  shared BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()

Use snake_case for all table and column names.

## Predefined tables (create on first use if they don't exist)
- restaurant_notes: restaurant_name, cuisine, location, rating (1-5), notes, visited_on
- todos: title, done (boolean), due_date, list_name
- shopping_items: item, quantity, list_name (default 'grocery'), purchased (boolean)
- notes: title, body, tags

## Privacy rules
- When reading: show WHERE owner = '[YOUR_USERNAME]' OR shared = true
- When writing: always set owner = '[YOUR_USERNAME]'
- Ask whether a record should be shared when context is ambiguous
- "Show me everything" means my data + shared records — not other users' private records

## Safety rules
- Never DELETE or UPDATE without a WHERE clause
- Always warn before dropping a table and require me to type "confirm"

## Tone
- Be concise and friendly
- Confirm saves in plain English: "Saved! Added Osteria Marco — 4 stars, shared."
- Format results as readable lists, not raw JSON
- Suggest follow-ups when natural`;

export default function StepClaude() {
    const navigate = useNavigate();

    return (
        <VStack align="stretch" gap={6}>
            <Box>
                <Text color="green.600" fontWeight="semibold" mb={1}>
                    Step 3 of 4
                </Text>
                <Heading size="xl" mb={2}>
                    Configure Claude
                </Heading>
                <Text color="gray.600" fontSize="lg">
                    Connect your MCP server and create a Project with custom instructions. Works on
                    iPhone, iPad, desktop, and web — all on the free Claude tier.
                </Text>
            </Box>

            <Alert status="success" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                    MCP connectors are available on <strong>Claude's free tier</strong> — no Pro
                    subscription needed. Each family member follows these same steps with their own
                    API key.
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
                            <Heading size="sm">Add the MCP connector</Heading>
                            <OrderedList spacing={2} pl={4}>
                                <ListItem>Open the Claude app → tap your profile icon (top left).</ListItem>
                                <ListItem>
                                    Tap <strong>Settings → Connectors → Add connector</strong>.
                                </ListItem>
                                <ListItem>
                                    Enter a name like <em>Teasenotes</em> and the URL:{" "}
                                    <code>https://teasenotes-mcp.YOUR-ACCOUNT.workers.dev/mcp</code>
                                </ListItem>
                                <ListItem>
                                    Under <strong>Authentication</strong>, set type to{" "}
                                    <strong>API Key / Bearer Token</strong> and paste your personal API key
                                    from Step 2.
                                </ListItem>
                                <ListItem>
                                    Save. Claude will test the connection — you should see a green checkmark.
                                </ListItem>
                            </OrderedList>

                            <Heading size="sm" mt={2}>
                                Create a Project with custom instructions
                            </Heading>
                            <OrderedList spacing={2} pl={4}>
                                <ListItem>
                                    Tap <strong>Projects → New Project</strong>. Name it{" "}
                                    <em>Family Notes</em>.
                                </ListItem>
                                <ListItem>
                                    Tap <strong>Project Instructions</strong> and paste the system prompt below.
                                </ListItem>
                                <ListItem>
                                    Replace <code>[YOUR_USERNAME]</code> with your username (e.g.{" "}
                                    <code>steve</code>).
                                </ListItem>
                                <ListItem>
                                    Start a new chat inside this project and try "what tables do I have?"
                                </ListItem>
                            </OrderedList>
                        </VStack>
                    </TabPanel>

                    {/* Web */}
                    <TabPanel px={0}>
                        <VStack align="stretch" gap={4}>
                            <Heading size="sm">Add the MCP connector</Heading>
                            <OrderedList spacing={2} pl={4}>
                                <ListItem>
                                    Go to{" "}
                                    <Link href="https://claude.ai" color="green.600" isExternal>
                                        claude.ai
                                    </Link>{" "}
                                    → click your name → <strong>Settings → Connectors</strong>.
                                </ListItem>
                                <ListItem>
                                    Click <strong>Add custom connector</strong>.
                                </ListItem>
                                <ListItem>
                                    Name: <em>Teasenotes</em>. URL:{" "}
                                    <code>https://teasenotes-mcp.YOUR-ACCOUNT.workers.dev/mcp</code>
                                </ListItem>
                                <ListItem>
                                    Set authentication to <strong>Bearer Token</strong> and paste your API key.
                                </ListItem>
                                <ListItem>Save and confirm the green checkmark.</ListItem>
                            </OrderedList>

                            <Heading size="sm" mt={2}>
                                Create a Project
                            </Heading>
                            <OrderedList spacing={2} pl={4}>
                                <ListItem>
                                    Click <strong>Projects → New Project</strong> → name it{" "}
                                    <em>Family Notes</em>.
                                </ListItem>
                                <ListItem>
                                    Click <strong>Edit project instructions</strong> and paste the system
                                    prompt below. Replace <code>[YOUR_USERNAME]</code>.
                                </ListItem>
                                <ListItem>
                                    Verify the Teasenotes connector is enabled for this project.
                                </ListItem>
                            </OrderedList>
                        </VStack>
                    </TabPanel>

                    {/* Desktop */}
                    <TabPanel px={0}>
                        <VStack align="stretch" gap={4}>
                            <Heading size="sm">Add the MCP connector</Heading>
                            <OrderedList spacing={2} pl={4}>
                                <ListItem>
                                    Open Claude Desktop → <strong>Settings → Connectors → Add</strong>.
                                </ListItem>
                                <ListItem>
                                    Name: <em>Teasenotes</em>. URL:{" "}
                                    <code>https://teasenotes-mcp.YOUR-ACCOUNT.workers.dev/mcp</code>
                                </ListItem>
                                <ListItem>
                                    Authentication: <strong>Bearer Token</strong> → paste your API key.
                                </ListItem>
                                <ListItem>Save. Restart Claude Desktop if prompted.</ListItem>
                            </OrderedList>
                            <Heading size="sm" mt={2}>
                                Create a Project (same as Web tab above)
                            </Heading>
                        </VStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>

            <Box>
                <Heading size="md" mb={3}>
                    System prompt — paste into Project Instructions
                </Heading>
                <Text color="gray.600" fontSize="sm" mb={2}>
                    Remember to replace <code>[YOUR_USERNAME]</code> with your actual username.
                </Text>
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
