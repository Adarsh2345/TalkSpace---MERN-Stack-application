import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Heading,
  Link,
  Flex,
  useColorModeValue
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiURL from "../../utils";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${apiURL}/api/users/register`, {
        email,
        password,
        username,
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message || "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={bgColor}
      p={4}
    >
      <Box
        w="100%"
        maxW="md"
        p={8}
        borderRadius="xl"
        boxShadow="lg"
        bg={cardBg}
        borderWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="lg" mb={2}>
              Create Your Account
            </Heading>
            <Text color="gray.500">
              Join our student-built chat platform
            </Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="cool_username123"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <Button
                type="submit"
                isLoading={loading}
                colorScheme="blue"
                width="full"
                mt={4}
                size="lg"
              >
                Register
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" mt={4}>
            Already have an account?{" "}
            <Link 
              as={Link}
              to="/login"
              color="blue.500"
              fontWeight="medium"
            >
              Sign in
            </Link>
          </Text>

          <Box mt={8} textAlign="center">
            <Text fontSize="sm" color="gray.500">
              A student project by Adarsh
            </Text>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Register;
