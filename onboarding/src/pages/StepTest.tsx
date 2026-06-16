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
                            "Invalid API key" or connector shows red ✗
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Double-check that the key you pasted in Claude matches exactly what's in the
                            <code>API_KEYS</code> Cloudflare secret (format:{" "}
                            <code>key:username</code>). Keys are case-sensitive.
                        </Text>
                    </Box>
                    <Box>
                        <Text fontWeight="semibold" mb={1}>
                            "Error: function exec_sql_query does not exist"
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            You need to run the SQL bootstrap script from Step 1c in your Supabase SQL
                            Editor.
                        </Text>
                    </Box>
                    <Box>
                        <Text fontWeight="semibold" mb={1}>
                            Claude says it doesn't have tools or can't access the database
                        </Text>
                        <UnorderedList fontSize="sm" color="gray.600" spacing={1} pl={4}>
                            <ListItem>
                                Make sure you're chatting inside the <em>Family Notes</em> Project (not a
                                regular chat).
                            </ListItem>
                            <ListItem>
                                Check that the Teasenotes connector is enabled for the project (Settings →
                                Connectors → project toggle).
                            </ListItem>
                            <ListItem>
                                Try asking: "list your available tools" — Claude should list list_tables,
                                query, write, etc.
                            </ListItem>
                        </UnorderedList>
                    </Box>
                    <Box>
                        <Text fontWeight="semibold" mb={1}>
                            Supabase returns errors about permissions
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Make sure you used the <strong>service_role</strong> key (not the{" "}
                            <strong>anon</strong> key) in the <code>SUPABASE_SERVICE_KEY</code> secret.
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
                    Each friend needs their own independent setup (their own Supabase project +
                    their own Cloudflare Worker deployment). Send them this onboarding URL and they
                    can follow the same 4 steps. Their data stays completely separate from yours.
                </Text>
            </Box>

            <Box p={5} bg="green.50" borderRadius="lg" border="1px solid" borderColor="green.200">
                <Heading size="sm" mb={2} color="green.800">
                    You're all set!
                </Heading>
                <Text fontSize="sm" color="green.700">
                    Your family now has an AI-powered personal notes database. Claude will
                    automatically create new tables as your wife discovers new things to track —
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
