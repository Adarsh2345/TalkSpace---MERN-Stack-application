import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Flex,
  Heading,
  useColorModeValue
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiLogIn, FiGithub } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/chat');
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      setLoading(false);
    }
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
        boxShadow="md"
        bg={cardBg}
        borderWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="lg" mb={2}>
              Student Chat Login
            </Heading>
            <Text color="gray.500">
              CS Project - MERN Stack Chat Application
            </Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <Button
                type="submit"
                isLoading={loading}
                colorScheme="blue"
                width="full"
                leftIcon={<FiLogIn />}
                mt={4}
              >
                Login
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" color="gray.600">
            New user?{" "}
            <Link 
              to="/register" 
              color="blue.500"
              fontWeight="medium"
            >
              Create account
            </Link>
          </Text>

          <Box mt={8} textAlign="center">
            <Text fontSize="sm" color="gray.500" mb={2}>
              View the source code on GitHub
            </Text>
            <Button
              as="a"
              href="https://github.com/yourusername/yourrepo"
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              variant="outline"
              leftIcon={<FiGithub />}
            >
              GitHub Repository
            </Button>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;