import {
    Box,
    Container,
    Flex,
    Heading,
    HStack,
    Link,
    Text,
    Badge,
} from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

const STEPS = [
    { path: "/step/1", label: "1. Supabase" },
    { path: "/step/2", label: "2. Connect MCP" },
    { path: "/step/3", label: "3. Claude" },
    { path: "/step/4", label: "4. Test" },
];

export default function Layout({ children }: { children: ReactNode }) {
    const location = useLocation();
    const currentStep = STEPS.findIndex((s) => location.pathname.startsWith(s.path));

    return (
        <Box minH="100vh" bg="gray.50">
            {/* Top nav */}
            <Box bg="green.700" color="white" px={6} py={4} shadow="md">
                <Container maxW="4xl">
                    <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
                        <HStack gap={2}>
                            <Text fontSize="2xl">🍵</Text>
                            <Heading size="md" fontWeight="bold" letterSpacing="tight">
                                Teasenotes Setup
                            </Heading>
                            <Badge colorScheme="green" variant="subtle" fontSize="xs">
                                Free forever
                            </Badge>
                        </HStack>

                        <HStack gap={1} as="nav">
                            {STEPS.map((step, i) => (
                                <Link
                                    key={step.path}
                                    as={NavLink}
                                    to={step.path}
                                    px={3}
                                    py={1}
                                    borderRadius="md"
                                    fontSize="sm"
                                    fontWeight={currentStep === i ? "bold" : "normal"}
                                    bg={currentStep === i ? "white" : "transparent"}
                                    color={currentStep === i ? "green.700" : "whiteAlpha.800"}
                                    _hover={{ bg: "whiteAlpha.300", textDecoration: "none" }}
                                >
                                    {step.label}
                                </Link>
                            ))}
                        </HStack>
                    </Flex>
                </Container>
            </Box>

            {/* Progress bar */}
            <Box bg="green.100" h={1}>
                <Box
                    bg="green.500"
                    h="full"
                    transition="width 0.3s"
                    style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                />
            </Box>

            {/* Page content */}
            <Container maxW="4xl" py={10}>
                {children}
            </Container>

            <Box textAlign="center" py={8} color="gray.400" fontSize="sm">
                <Link
                    href="https://github.com/SteveMilesQuant/teasenotes"
                    color="green.600"
                    isExternal
                >
                    github.com/SteveMilesQuant/teasenotes
                </Link>
            </Box>
        </Box>
    );
}
