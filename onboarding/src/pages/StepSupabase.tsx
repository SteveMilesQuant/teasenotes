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
                    Each person gets their own private database.
                </Text>
            </Box>

            <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                    The free tier includes 500 MB storage and 50,000 API calls per day — plenty for
                    a personal notes app. Free projects pause after 7 days of no activity; just visit
                    your dashboard to wake one up, or upgrade to a paid plan ($25/mo) to prevent it.
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
                        Click <strong>New project</strong>. Give it any name (e.g.{" "}
                        <code>my-notes</code>). Pick the region closest to you. Set a database
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

            <Alert status="success" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                    That's all for this step — no SQL to run, no keys to copy. Supabase's official
                    MCP connector handles authentication for you in the next step.
                </Text>
            </Alert>

            <Button
                colorScheme="green"
                size="lg"
                alignSelf="flex-end"
                onClick={() => navigate("/step/2")}
            >
                Next: Connect Claude to your database →
            </Button>
        </VStack>
    );
}

