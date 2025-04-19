// UsersList.jsx
import {
  Box,
  VStack,
  Text,
  Avatar,
  Flex,
  Badge,
  Icon,
  Tooltip
} from "@chakra-ui/react";
import { FiCircle } from "react-icons/fi";

const UsersList = ({ users }) => {
  return (
    <Box 
      w="250px" 
      borderLeft="1px solid" 
      borderColor="gray.200"
      bg="white"
      h="100%"
      overflowY="auto"
      display={{ base: "none", md: "block" }}
    >
      <Flex p={4} borderBottom="1px solid" borderColor="gray.200" align="center">
        <Text fontSize="lg" fontWeight="bold">Online Members</Text>
        <Badge ml={2} colorScheme="green" borderRadius="full">
          {users.length}
        </Badge>
      </Flex>
      
      <VStack spacing={3} p={4} align="stretch">
        {users.map(user => (
          <Tooltip key={user._id} label={`${user.username} is online`} placement="left">
            <Flex align="center" p={2} borderRadius="md">
              <Avatar 
                size="sm" 
                name={user.username} 
                mr={3}
                src={user.profilePic}
              />
              <Text flex="1">{user.username}</Text>
              <Icon as={FiCircle} color="green.500" boxSize={3} />
            </Flex>
          </Tooltip>
        ))}
      </VStack>
    </Box>
  );
};

export default UsersList;