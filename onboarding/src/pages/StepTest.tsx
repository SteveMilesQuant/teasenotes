import {
    Box,
    Button,
    Heading,
    HStack,
    Link,
    ListItem,
    Text,
    UnorderedList,
    VStack,
    Alert,
    AlertIcon,
    Divider,
    Badge,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CodeBlock from "../components/CodeBlock";

const TEST_PROMPTS = [
    {
        label: "Verify connection",
        prompt: "What tables do I have?",
        expect: 'Returns an empty list (or existing tables). Confirms the MCP tools are connected.',
    },
    {
        label: "Create a table and save a record",
        prompt: "Save that we went to Trattoria Roma last night — amazing pasta, 5 stars. We both went.",
        expect:
            'Claude should: (1) create restaurant_notes if needed, (2) INSERT a row with shared=true, (3) confirm in plain English.',
    },
    {
        label: "Read data back",
        prompt: "What restaurants do we have saved?",
        expect: "Claude queries the DB and shows a readable list, not raw SQL or JSON.",
    },
    {
        label: "Add a private to-do",
        prompt: "Remind me to call the dentist tomorrow.",
        expect: "Inserts a todo with owner=you, shared=false.",
    },
    {
        label: "Shared shopping list",
        prompt: "Add milk and eggs to the grocery list.",
        expect: "Inserts two shopping_items with shared=true.",
    },
];

export default function StepTest() {
    const navigate = useNavigate();

    return (
        <VStack align="stretch" gap={6}>
            <Box>
                <Text color="green.600" fontWeight="semibold" mb={1}>
                    Step 4 of 4
                </Text>
                <Heading size="xl" mb={2}>
                    Test it out 🎉
                </Heading>
                <Text color="gray.600" fontSize="lg">
                    Open your <strong>Family Notes</strong> Claude Project and try these prompts.
                </Text>
            </Box>

            <Alert status="success" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                    If anything doesn't work, check the Troubleshooting section below.
                </Text>
            </Alert>

            <VStack align="stretch" gap={4}>
                {TEST_PROMPTS.map((t, i) => (
                    <Box
                        key={i}
                        p={5}
                        bg="white"
                        borderRadius="lg"
                        shadow="sm"
                        border="1px solid"
                        borderColor="gray.200"
                    >
                        <HStack mb={2}>
                            <Badge colorScheme="green" fontSize="xs">
                                Test {i + 1}
                            </Badge>
                            <Text fontWeight="semibold" fontSize="sm">
                                {t.label}
                            </Text>
                        </HStack>
                        <CodeBlock code={t.prompt} language="prompt" />
                        <Text fontSize="sm" color="gray.500" mt={2}>
                            ✓ Expected: {t.expect}
                        </Text>
                    </Box>
                ))}
            </VStack>

            <Divider />

            <Box>
                <Heading size="md" mb={4}>
                    Troubleshooting
                </Heading>
                <VStack align="stretch" gap={4}>
                    <Box>
                        <Text fontWeight="semibold" mb={1}>
                            Connector shows a red ✗ or authentication fails
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            In Step 2, make sure you completed the browser OAuth flow all the way through
                            — Supabase should have redirected you back to Claude after login. Try
                            removing the connector and re-adding it to restart the auth flow.
                        </Text>
                    </Box>
                    <Box>
                        <Text fontWeight="semibold" mb={1}>
                            Claude says it doesn't have tools or can't access the database
                        </Text>
                        <UnorderedList fontSize="sm" color="gray.600" spacing={1} pl={4}>
                            <ListItem>
                                Make sure you're chatting inside the <em>My Notes</em> Project, not a
                                regular chat.
                            </ListItem>
                            <ListItem>
                                Check that the Supabase connector is enabled for the project (project
                                settings → Connectors).
                            </ListItem>
                            <ListItem>
                                Try asking: "list your available tools" — Claude should mention
                                execute_sql, list_tables, etc.
                            </ListItem>
                        </UnorderedList>
                    </Box>
                    <Box>
                        <Text fontWeight="semibold" mb={1}>
                            "Project not found" or permission errors
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Check that the <code>project_ref</code> in your connector URL matches
                            your actual Supabase project reference ID (the short code from your
                            dashboard URL).
                        </Text>
                    </Box>
                    <Box>
                        <Text fontWeight="semibold" mb={1}>
                            Supabase free project is paused
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Free Supabase projects pause after 7 days of no activity. Visit your{" "}
                            <Link href="https://supabase.com/dashboard" color="green.600" isExternal>
                                Supabase dashboard
                            </Link>{" "}
                            and click <strong>Restore</strong> to wake it up. Takes about 30 seconds.
                        </Text>
                    </Box>
                </VStack>
            </Box>

            <Divider />

            <Box>
                <Heading size="md" mb={3}>
                    Sharing with friends
                </Heading>
                <Text color="gray.600" fontSize="sm">
                    Each friend follows the same 4 steps independently — they get their own
                    Supabase project and their own private database. Send them this onboarding URL
                    and they're set up in about 10 minutes.
                </Text>
            </Box>

            <Box p={5} bg="green.50" borderRadius="lg" border="1px solid" borderColor="green.200">
                <Heading size="sm" mb={2} color="green.800">
                    You're all set!
                </Heading>
                <Text fontSize="sm" color="green.700">
                    You now have an AI-powered personal notes database. Claude will
                    automatically create new tables as you discover new things to track —
                    recipes, movies, books, gift ideas, you name it. All free, all private, all
                    natural language.
                </Text>
            </Box>

            <HStack justify="space-between">
                <Button variant="ghost" onClick={() => navigate("/step/3")}>
                    ← Back
                </Button>
                <Link href="https://github.com/SteveMilesQuant/teasenotes" isExternal>
                    <Button colorScheme="gray" variant="outline">
                        View on GitHub
                    </Button>
                </Link>
            </HStack>
        </VStack>
    );
}
