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
import type { ReactNode } from "react";

const STEP_LABELS = ["1. Supabase", "2. Connect MCP", "3. Claude", "4. Test"];

interface LayoutProps {
    children: ReactNode;
    step: number;
    onStepChange: (step: number) => void;
}

export default function Layout({ children, step, onStepChange }: LayoutProps) {
    const currentStep = step - 1; // 0-based index

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
                            {STEP_LABELS.map((label, i) => (
                                <Box
                                    key={label}
                                    as="button"
                                    onClick={() => onStepChange(i + 1)}
                                    px={3}
                                    py={1}
                                    borderRadius="md"
                                    fontSize="sm"
                                    fontWeight={currentStep === i ? "bold" : "normal"}
                                    bg={currentStep === i ? "white" : "transparent"}
                                    color={currentStep === i ? "green.700" : "whiteAlpha.800"}
                                    _hover={{ bg: currentStep === i ? "white" : "whiteAlpha.300" }}
                                    cursor="pointer"
                                    border="none"
                                >
                                    {label}
                                </Box>
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
                    style={{ width: `${((currentStep + 1) / STEP_LABELS.length) * 100}%` }}
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
