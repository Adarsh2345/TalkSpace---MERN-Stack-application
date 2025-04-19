import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  Flex,
  Avatar,
  InputGroup,
  InputRightElement,
  useToast,
  Heading
} from "@chakra-ui/react";
import { FiSend, FiArrowLeft } from "react-icons/fi";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import apiURL from "../../utils";
import UsersList from "./UsersList";

const ChatArea = ({ selectedGroup, socket, setSelectedGroup }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userGroups, setUserGroups] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const toast = useToast();
  const currentUser = JSON.parse(localStorage.getItem("userInfo") || {});

  // Initialize socket listeners and join room
  useEffect(() => {
    if (!socket || !selectedGroup) return;

    console.log(`Joining room: ${selectedGroup._id}`);

    const handleMessageReceived = (message) => {
      console.log("Message received:", message);
      if (message.groupId === selectedGroup._id) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    };

    const handleUsersInRoom = (users) => {
      console.log("Users in room:", users);
      setConnectedUsers(users);
    };

    const handleUserTyping = ({ username }) => {
      setTypingUsers(prev => new Set(prev).add(username));
    };

    const handleUserStopTyping = ({ username }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(username);
        return newSet;
      });
    };

    // Setup all socket listeners
    socket.on("message received", handleMessageReceived);
    socket.on("users in room", handleUsersInRoom);
    socket.on("user typing", handleUserTyping);
    socket.on("user stop typing", handleUserStopTyping);

    // Join room and load initial data
    socket.emit("join room", selectedGroup._id);
    loadMessages();
    fetchUserGroups();

    // Cleanup function
    return () => {
      console.log(`Leaving room: ${selectedGroup._id}`);
      socket.off("message received", handleMessageReceived);
      socket.off("users in room", handleUsersInRoom);
      socket.off("user typing", handleUserTyping);
      socket.off("user stop typing", handleUserStopTyping);
      socket.emit("leave room", selectedGroup._id);
    };
  }, [socket, selectedGroup]);

  const loadMessages = async () => {
    try {
      const { data } = await axios.get(
        `${apiURL}/api/messages/${selectedGroup._id}`,
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      console.log("Loaded messages:", data);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        status: "error",
        duration: 3000,
      });
    }
  };

  const fetchUserGroups = async () => {
    try {
      const { data } = await axios.get(`${apiURL}/api/groups`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      const joinedGroups = data
        .filter(group => group.members.some(m => m._id === currentUser._id))
        .map(group => group._id);
      setUserGroups(joinedGroups);
    } catch (error) {
      console.error("Failed to fetch user groups", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    if (!userGroups.includes(selectedGroup._id)) {
      toast({
        title: "Error",
        description: "You must join this group before sending messages",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      const { data } = await axios.post(
        `${apiURL}/api/messages`,
        { content: newMessage, groupId: selectedGroup._id },
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      
      // Update local state immediately
      setMessages(prev => [...prev, data]);
      setNewMessage("");
      scrollToBottom();

      // Emit to socket
      socket.emit("new message", { 
        ...data, 
        groupId: selectedGroup._id,
        sender: currentUser
      });

      // Clear typing indicator
      socket.emit("stop typing", { groupId: selectedGroup._id });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!isTyping) {
      socket.emit("typing", { 
        groupId: selectedGroup._id, 
        username: currentUser.username 
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", { 
        groupId: selectedGroup._id 
      });
    }, 2000);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderTypingIndicator = () => {
    if (typingUsers.size === 0) return null;
    return (
      <Box textAlign="center" py={2}>
        <Text fontSize="sm" color="gray.500" fontStyle="italic">
          {Array.from(typingUsers).join(", ")} {typingUsers.size > 1 ? 'are' : 'is'} typing...
        </Text>
      </Box>
    );
  };

  return (
    <Flex direction="row" h="100vh">
      <Box flex="1" display="flex" flexDirection="column">
        <Flex p={4} bg="white" borderBottom="1px solid" borderColor="gray.200" align="center">
          <Button 
            display={{ md: "none" }} 
            variant="ghost" 
            mr={2}
            onClick={() => setSelectedGroup(null)}
          >
            <FiArrowLeft />
          </Button>
          <Heading size="md">{selectedGroup?.name}</Heading>
        </Flex>

        <Box flex="1" p={4} overflowY="auto">
          <VStack spacing={4} align="stretch">
            {messages.map((message) => (
              <Flex 
                key={message._id} 
                direction={message.sender._id === currentUser._id ? "row-reverse" : "row"}
                align="flex-start"
                gap={2}
              >
                <Avatar 
                  size="sm" 
                  name={message.sender.username} 
                  src={message.sender.profilePic}
                />
                <Box
                  bg={message.sender._id === currentUser._id ? "blue.500" : "gray.100"}
                  color={message.sender._id === currentUser._id ? "white" : "gray.800"}
                  p={3}
                  borderRadius="lg"
                  maxW="80%"
                >
                  <Text fontSize="sm" fontWeight="bold" mb={1}>
                    {message.sender._id === currentUser._id ? "You" : message.sender.username}
                  </Text>
                  <Text>{message.content}</Text>
                  <Text fontSize="xs" mt={1} opacity={0.7}>
                    {formatTime(message.createdAt)}
                  </Text>
                </Box>
              </Flex>
            ))}
            {renderTypingIndicator()}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>

        <Box p={4} bg="white" borderTop="1px solid" borderColor="gray.200">
          {!userGroups.includes(selectedGroup?._id) ? (
            <Button 
              width="100%" 
              colorScheme="blue"
              onClick={() => handleGroupAction(selectedGroup._id)}
            >
              Join Group to Chat
            </Button>
          ) : (
            <InputGroup>
              <Input
                value={newMessage}
                onChange={handleTyping}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <InputRightElement>
                <Button 
                  size="sm" 
                  colorScheme="blue"
                  onClick={sendMessage}
                >
                  <FiSend />
                </Button>
              </InputRightElement>
            </InputGroup>
          )}
        </Box>
      </Box>

      <UsersList users={connectedUsers} />
    </Flex>
  );
};

export default ChatArea;