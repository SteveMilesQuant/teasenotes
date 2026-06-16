import {
    Box,
    Button,
    Heading,
    HStack,
    Text,
    VStack,
    Alert,
    AlertIcon,
    Badge,
    Input,
    FormLabel,
    FormControl,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CodeBlock from "../components/CodeBlock";

function generateKey() {
    const arr = new Uint8Array(24);
    crypto.getRandomValues(arr);
    return Array.from(arr)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export default function StepWorker() {
    const navigate = useNavigate();
    const [user1, setUser1] = useState("steve");
    const [key1] = useState(generateKey);
    const [user2, setUser2] = useState("sarah");
    const [key2] = useState(generateKey);

    const apiKeysValue = `${key1}:${user1},${key2}:${user2}`;

    const deploySteps = `# 1. Clone the repo (or download the worker folder)
git clone https://github.com/SteveMilesQuant/teasenotes.git
cd teasenotes/worker

# 2. Install dependencies
npm install

# 3. Deploy to Cloudflare (creates a free account if you don't have one)
npx wrangler deploy

# 4. Set your secrets (run each line separately, paste when prompted)
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_KEY
npx wrangler secret put API_KEYS`;

    const cronToml = `# Add to worker/wrangler.toml to prevent Supabase free tier from pausing:
[triggers]
crons = ["0 12 * * *"]`;

    return (
        <VStack align="stretch" gap={6}>
            <Box>
                <Text color="green.600" fontWeight="semibold" mb={1}>
                    Step 2 of 4
                </Text>
                <Heading size="xl" mb={2}>
                    Deploy the MCP server
                </Heading>
                <Text color="gray.600" fontSize="lg">
                    The MCP server is a tiny Cloudflare Worker — free, always-on, and no server to
                    maintain.
                </Text>
            </Box>

            <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                    Cloudflare Workers free tier: 100,000 requests/day, zero cold starts, global
                    edge network. No credit card needed.
                </Text>
            </Alert>

            {/* API key generator */}
            <Box p={5} bg="white" borderRadius="lg" shadow="sm" border="1px solid" borderColor="gray.200">
                <Heading size="sm" mb={4}>
                    Generate API keys for your family members
                </Heading>
                <Text fontSize="sm" color="gray.600" mb={4}>
                    Each person gets a unique key. These are like passwords — keep them secret.
                    You'll paste them into the Cloudflare secret in a moment.
                </Text>
                <VStack align="stretch" gap={3}>
                    <HStack>
                        <FormControl flex={1}>
                            <FormLabel fontSize="sm">Person 1 username</FormLabel>
                            <Input
                                value={user1}
                                onChange={(e) => setUser1(e.target.value)}
                                size="sm"
                            />
                        </FormControl>
                        <FormControl flex={2}>
                            <FormLabel fontSize="sm">Generated key</FormLabel>
                            <Input value={key1} isReadOnly size="sm" fontFamily="mono" />
                        </FormControl>
                    </HStack>
                    <HStack>
                        <FormControl flex={1}>
                            <FormLabel fontSize="sm">Person 2 username</FormLabel>
                            <Input
                                value={user2}
                                onChange={(e) => setUser2(e.target.value)}
                                size="sm"
                            />
                        </FormControl>
                        <FormControl flex={2}>
                            <FormLabel fontSize="sm">Generated key</FormLabel>
                            <Input value={key2} isReadOnly size="sm" fontFamily="mono" />
                        </FormControl>
                    </HStack>
                </VStack>
                <Text fontSize="xs" color="gray.400" mt={3}>
                    Keys are generated locally in your browser and never sent anywhere.
                </Text>
            </Box>

            <Box>
                <Heading size="md" mb={3}>
                    Deploy commands
                </Heading>
                <Text color="gray.600" mb={3}>
                    Run these in a terminal. When prompted for each secret, paste the values from
                    Step 1 (Supabase URL, service_role key) and the API_KEYS string below.
                </Text>
                <CodeBlock code={deploySteps} language="bash" />
            </Box>

            <Box>
                <Heading size="md" mb={2}>
                    Your API_KEYS value{" "}
                    <Badge colorScheme="orange" fontSize="xs">
                        keep secret
                    </Badge>
                </Heading>
                <Text color="gray.600" fontSize="sm" mb={2}>
                    Paste this when <code>wrangler secret put API_KEYS</code> prompts you:
                </Text>
                <CodeBlock code={apiKeysValue} language="text" />
                <Text fontSize="xs" color="gray.400">
                    Format: <code>key:username,key:username</code> — usernames will appear in your
                    database records.
                </Text>
            </Box>

            <Box>
                <Heading size="md" mb={2}>
                    Optional: prevent Supabase project from pausing
                </Heading>
                <Text color="gray.600" fontSize="sm" mb={2}>
                    Supabase pauses free projects after 7 days of inactivity. Add a daily cron to
                    keep it alive — add this to <code>worker/wrangler.toml</code> and re-deploy:
                </Text>
                <CodeBlock code={cronToml} language="toml" />
            </Box>

            <Box>
                <Heading size="md" mb={2}>
                    After deploying
                </Heading>
                <Text color="gray.600" fontSize="sm">
                    Wrangler will print a URL like{" "}
                    <code>https://teasenotes-mcp.YOUR-ACCOUNT.workers.dev</code>. Save it — you'll
                    add <code>/mcp</code> to the end when configuring Claude in the next step.
                </Text>
            </Box>

            <HStack justify="space-between">
                <Button variant="ghost" onClick={() => navigate("/step/1")}>
                    ← Back
                </Button>
                <Button colorScheme="green" size="lg" onClick={() => navigate("/step/3")}>
                    Next: Configure Claude →
                </Button>
            </HStack>
        </VStack>
    );
}
