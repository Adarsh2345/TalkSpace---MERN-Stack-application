import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Flex,
  VStack,
  HStack,
  Badge,
  Avatar,
  AvatarBadge
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FiMessageSquare,
  FiUsers,
  FiLock,
  FiLogIn,
  FiUserPlus,
  FiGlobe,
  FiActivity
} from "react-icons/fi";

const FeatureCard = ({ title, description, icon }) => {
  return (
    <Stack
      p={6}
      spacing={4}
      bg={useColorModeValue("white", "gray.800")}
      borderRadius="xl"
      boxShadow="md"
      borderWidth="1px"
      borderColor={useColorModeValue("gray.100", "gray.700")}
    >
      <Flex
        w={12}
        h={12}
        align="center"
        justify="center"
        borderRadius="lg"
        bg="blue.500"
        color="white"
      >
        {icon}
      </Flex>
      <Heading size="md" color="blue.500">{title}</Heading>
      <Text color={useColorModeValue("gray.600", "gray.400")}>{description}</Text>
    </Stack>
  );
};

export default function LandingPage() {
  return (
    <Box bg={useColorModeValue("gray.50", "gray.900")}>
      {/* Hero Section */}
      <Container maxW="container.lg" py={20}>
        <Stack align="center" spacing={8} textAlign="center">
          <Box>
            <Badge colorScheme="blue" variant="subtle" px={4} py={1} borderRadius="full" fontSize="lg">
              CS Student Project
            </Badge>
            <Heading size="2xl" mt={4} lineHeight={1.2}>
              Welcome to <span style={{ color: "#3182CE", fontWeight: "800" }}>Talkspace</span>
            </Heading>
            <Text fontSize="xl" mt={4} maxW="2xl">
              A simple, real-time chat application built with MERN stack
            </Text>
          </Box>

          <Stack direction="row" spacing={4}>
            <Button
              as={RouterLink}
              to="/register"
              size="lg"
              colorScheme="blue"
              rightIcon={<FiUserPlus />}
              px={8}
            >
              Try Talkspace
            </Button>
            <Button
              as={RouterLink}
              to="/login"
              size="lg"
              variant="outline"
              rightIcon={<FiLogIn />}
              px={8}
            >
              Demo Login
            </Button>
          </Stack>

          {/* App Preview */}
          <Box mt={10} p={6} bg="white" borderRadius="xl" boxShadow="lg" maxW="md">
            <Flex justify="space-between" align="center" mb={4}>
              <HStack>
                <Avatar name="Talkspace Team" size="sm" />
                <Text fontWeight="bold">Class Group</Text>
              </HStack>
              <Badge colorScheme="green">Online</Badge>
            </Flex>
            
            <VStack spacing={4} align="stretch" mb={4}>
              <Flex justify="flex-start">
                <Box bg="gray.100" p={3} borderRadius="xl" maxW="80%">
                  <Text fontWeight="semibold">Alex</Text>
                  <Text>Hey everyone! Project due next week</Text>
                </Box>
              </Flex>
              <Flex justify="flex-end">
                <Box bg="blue.500" color="white" p={3} borderRadius="xl" maxW="80%">
                  <Text>Got it! I'll finish my part by Friday</Text>
                </Box>
              </Flex>
              <Text fontSize="sm" textAlign="center" color="gray.500">
                Sam is typing...
              </Text>
            </VStack>
          </Box>
        </Stack>

        {/* Features */}
        <Box mt={20}>
          <Heading size="xl" textAlign="center" mb={10}>Why <span style={{ color: "#3182CE" }}>Talkspace</span>?</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <FeatureCard
              icon={<Icon as={FiMessageSquare} w={5} h={5} />}
              title="Real-Time Chat"
              description="Send and receive messages instantly with socket.io technology"
            />
            <FeatureCard
              icon={<Icon as={FiUsers} w={5} h={5} />}
              title="Group Chats"
              description="Create study groups or project teams easily"
            />
            <FeatureCard
              icon={<Icon as={FiLock} w={5} h={5} />}
              title="Secure Auth"
              description="Student-built authentication system"
            />
          </SimpleGrid>
        </Box>

        {/* About Section */}
        <Box mt={20} p={8} bg={useColorModeValue("blue.50", "blue.900")} borderRadius="xl">
          <Heading size="lg" mb={4} color="blue.500">About This Project</Heading>
          <Text mb={4}>
            <strong>Talkspace</strong> was developed as a full-stack learning project by a computer science student. 
            It demonstrates skills in React, Node.js, Express, and MongoDB.
          </Text>
          <Text>
            The complete source code is available on GitHub for educational purposes.
          </Text>
        </Box>

        {/* Final CTA */}
        <Box mt={20} textAlign="center">
          <Heading size="xl" mb={6}>Ready to experience <span style={{ color: "#3182CE" }}>Talkspace</span>?</Heading>
          <Button
            as={RouterLink}
            to="/register"
            size="lg"
            colorScheme="blue"
            px={10}
            py={6}
            fontSize="xl"
          >
            Get Started Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
}