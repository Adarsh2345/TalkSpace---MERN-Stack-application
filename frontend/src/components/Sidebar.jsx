// Sidebar.jsx
import {
  Box,
  VStack,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Flex,
  Badge,
  Icon
} from "@chakra-ui/react";
import { FiLogOut, FiPlus } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";
import apiURL from "../../utils";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ setSelectedGroup }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const { data } = await axios.get(`${apiURL}/api/groups`, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}` }
      });
      setGroups(data);
      
      const userGroupIds = data
        .filter(group => group.members.some(m => m._id === JSON.parse(localStorage.getItem("userInfo"))._id))
        .map(group => group._id);
      setUserGroups(userGroupIds);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load groups",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleGroupAction = async (groupId) => {
    try {
      const endpoint = userGroups.includes(groupId) ? "leave" : "join";
      await axios.post(
        `${apiURL}/api/groups/${groupId}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}` } }
      );
      fetchGroups();
      toast({
        title: `Successfully ${endpoint === 'leave' ? 'left' : 'joined'} group`,
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Action failed",
        status: "error",
        duration: 3000,
      });
    }
  };

  const createGroup = async () => {
    try {
      await axios.post(
        `${apiURL}/api/groups`,
        newGroup,
        { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}` } }
      );
      onClose();
      fetchGroups();
      setNewGroup({ name: "", description: "" });
      toast({
        title: "Group created",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create group",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <Box h="100%" p={4} overflowY="auto" display="flex" flexDirection="column">
      <Box flex="1">
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="xl" fontWeight="bold">Chat Groups</Text>
          <Button size="sm" leftIcon={<FiPlus />} onClick={onOpen}>
            New
          </Button>
        </Flex>

        <VStack spacing={3} align="stretch">
          {groups.map(group => (
            <Box 
              key={group._id}
              p={3} 
              borderWidth="1px" 
              borderRadius="md"
              cursor="pointer"
              bg={userGroups.includes(group._id) ? "blue.50" : "white"}
              onClick={() => setSelectedGroup(group)}
            >
              <Flex justify="space-between">
                <Box>
                  <Text fontWeight="bold">{group.name}</Text>
                  <Text fontSize="sm" color="gray.600">{group.description}</Text>
                </Box>
                <Button 
                  size="sm" 
                  colorScheme={userGroups.includes(group._id) ? "red" : "blue"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGroupAction(group._id);
                  }}
                >
                  {userGroups.includes(group._id) ? "Leave" : "Join"}
                </Button>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Logout Button - Restored */}
      <Button
        mt={4}
        colorScheme="red"
        variant="outline"
        leftIcon={<FiLogOut />}
        onClick={handleLogout}
      >
        Logout
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4}>
              <FormLabel>Group Name</FormLabel>
              <Input 
                value={newGroup.name}
                onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input 
                value={newGroup.description}
                onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
              />
            </FormControl>
            <Button mt={4} colorScheme="blue" onClick={createGroup}>
              Create
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Sidebar;