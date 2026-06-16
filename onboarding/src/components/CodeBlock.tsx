import { Box, Text, Button } from "@chakra-ui/react";
import { useState } from "react";

interface Props {
    code: string;
    language?: string;
}

export default function CodeBlock({ code, language = "sql" }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        });
    };

    return (
        <Box position="relative" my={4}>
            <Box
                as="pre"
                bg="gray.900"
                color="green.300"
                p={5}
                borderRadius="md"
                overflowX="auto"
                fontSize="sm"
                lineHeight="tall"
                fontFamily="mono"
            >
                {language && (
                    <Text as="span" color="gray.500" fontSize="xs" display="block" mb={2}>
                        {language}
                    </Text>
                )}
                <code>{code}</code>
            </Box>
            <Button
                size="xs"
                position="absolute"
                top={2}
                right={2}
                colorScheme={copied ? "green" : "gray"}
                variant="solid"
                onClick={handleCopy}
            >
                {copied ? "Copied!" : "Copy"}
            </Button>
        </Box>
    );
}
