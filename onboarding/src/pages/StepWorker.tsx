import {
    Box,
    Button,
    Code,
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
const MCP_URL = "https://mcp.supabase.com/mcp";

interface StepWorkerProps {
    onBack: () => void;
    onNext: () => void;
}

export default function StepConnect({ onBack, onNext }: StepWorkerProps) {

    return (
        <VStack align="stretch" gap={6}>
            <Box>
                <Text color="green.600" fontWeight="semibold" mb={1}>
                    Step 2 of 4
                </Text>
                <Heading size="xl" mb={2}>
                    Connect Claude to your database
                </Heading>
                <Text color="gray.600" fontSize="lg">
                    Supabase provides an official hosted MCP server. You just point Claude at it
                    and log in — no server to deploy, no API keys to manage.
                </Text>
            </Box>

            <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                    The Supabase MCP URL is{" "}
                    <Code fontSize="sm">{MCP_URL}</Code>. You can optionally scope it to just your
                    project by appending{" "}
                    <Code fontSize="sm">?project_ref=YOUR_PROJECT_REF</Code> (recommended — limits
                    what Claude can access).
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
                        <OrderedList spacing={3} pl={4}>
                            <ListItem>
                                Open the Claude app → tap your <strong>profile icon</strong> (top left)
                                → <strong>Settings</strong>.
                            </ListItem>
                            <ListItem>
                                Tap <strong>Connectors → Add connector</strong>.
                            </ListItem>
                            <ListItem>
                                Set the name to <em>TeaseNotesSupabase</em> and the URL to:
                                <Code display="block" mt={1} p={2} borderRadius="md" fontSize="sm">
                                    {MCP_URL}?project_ref=YOUR_PROJECT_REF
                                </Code>
                                Replace <code>YOUR_PROJECT_REF</code> with the code from Step 1.
                            </ListItem>
                            <ListItem>
                                Tap <strong>Save</strong>. Claude will open a browser window — log in
                                to your Supabase account and grant access. You'll be redirected back
                                automatically.
                            </ListItem>
                            <ListItem>
                                You should see a green checkmark next to the connector.
                            </ListItem>
                        </OrderedList>
                    </TabPanel>

                    {/* Web */}
                    <TabPanel px={0}>
                        <OrderedList spacing={3} pl={4}>
                            <ListItem>
                                Go to{" "}
                                <Link href="https://claude.ai" color="green.600" isExternal>
                                    claude.ai
                                </Link>{" "}
                                → <strong>Customize → Connectors</strong>.
                            </ListItem>
                            <ListItem>
                                Click <strong>Add custom connector</strong>.
                            </ListItem>
                            <ListItem>
                                Name: <em>TeaseNotesSupabase</em>. URL:
                                <Code display="block" mt={1} p={2} borderRadius="md" fontSize="sm">
                                    {MCP_URL}?project_ref=YOUR_PROJECT_REF
                                </Code>. Leave OAuth fields blank.
                            </ListItem>
                            <ListItem>
                                Click <strong>Save</strong> — a Supabase login window will open.
                                Authorize Claude to access your project.
                            </ListItem>
                            <ListItem>
                                A list of <strong>Tool Permissions</strong> will appear. Set the read and write tools to <strong>Always allow</strong>.
                            </ListItem>
                        </OrderedList>
                    </TabPanel>

                    {/* Desktop */}
                    <TabPanel px={0}>
                        <OrderedList spacing={3} pl={4}>
                            <ListItem>
                                Open Claude Desktop → <strong>Settings → Connectors → Add</strong>.
                            </ListItem>
                            <ListItem>
                                Name: <em>TeaseNotesSupabase</em>. URL:
                                <Code display="block" mt={1} p={2} borderRadius="md" fontSize="sm">
                                    {MCP_URL}?project_ref=YOUR_PROJECT_REF
                                </Code>
                            </ListItem>
                            <ListItem>
                                Save → authenticate in the browser window that opens.
                            </ListItem>
                        </OrderedList>
                    </TabPanel>
                </TabPanels>
            </Tabs>

            <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                    <strong>Security tip:</strong> Always include <code>?project_ref=…</code> to
                    scope access to one project. Without it, Claude can see all your Supabase
                    projects.
                </Text>
            </Alert>

            <HStack justify="space-between">
                <Button variant="ghost" onClick={onBack}>
                    ← Back
                </Button>
                <Button colorScheme="green" size="lg" onClick={onNext}>
                    Next: Set up Claude Project →
                </Button>
            </HStack>
        </VStack>
    );
}

