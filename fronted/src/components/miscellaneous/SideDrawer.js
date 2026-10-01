



// import React, { useState } from "react";
// import axios from "axios";

// import {
//   Box,
//   Button,
//   Menu,
//   MenuButton,
//   MenuItem,
//   MenuList,
//   Text,
//   Tooltip,
//   Avatar,
//   Input,
//   InputGroup,
//   InputLeftElement,
//   VStack,
//   Drawer,
//   DrawerOverlay,
//   DrawerContent,
//   DrawerHeader,
//   DrawerBody,
//   DrawerCloseButton,
//   useDisclosure,
//   Badge,
//   useToast,
// } from "@chakra-ui/react";

// import {
//   BellIcon,
//   SearchIcon,
// } from "@chakra-ui/icons";

// import { ChatState } from "../../Context/ChatProvider";
// import ProfileModal from "../../ProfileModal";

// import ChatLoading from "./ChatLoading";
// import UserListItem from "./UserListItem";
// import {Spinner} from '@chakra-ui/spinner'


// const SideDrawer = () => {
//   // ChatState sirf EK baar call karein
//   const {
//     user,
//     setSelectedChat,
//     setLoadingChat,
//   } = ChatState();

//   const toast = useToast();

//   // Search states
//   const [search, setSearch] = useState("");
//   const [searchResult, setSearchResult] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Notifications
//   const [notifications] = useState([]);

//   // Drawer
//   const {
//     isOpen,
//     onOpen,
//     onClose,
//   } = useDisclosure();

//   // ========================================
//   // SEARCH USERS
//   // ========================================

//   const handleSearch = async () => {
//     if (!search.trim()) {
//       toast({
//         title: "Enter a name or email",
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//         position: "bottom-left",
//       });

//       setSearchResult([]);
//       return;
//     }

//     if (!user?.token) {
//       toast({
//         title: "Please login again",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//         position: "bottom-left",
//       });

//       return;
//     }

//     try {
//       setLoading(true);

//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`,
//         },
//       };

//       const { data } = await axios.get(
//         `/api/user?search=${encodeURIComponent(
//           search.trim()
//         )}`,
//         config
//       );

//       setSearchResult(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Search Error:", error);

//       toast({
//         title: "Search failed",
//         description:
//           error?.response?.data?.message ||
//           "Unable to load users",
//         status: "error",
//         duration: 4000,
//         isClosable: true,
//         position: "bottom-left",
//       });

//       setSearchResult([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ========================================
//   // ACCESS CHAT
//   // ========================================

//   const accessChat = async (userId) => {
//     if (!user?.token) {
//       toast({
//         title: "Please login again",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//         position: "bottom-left",
//       });

//       return;
//     }

//     try {
//       setLoadingChat(true);

//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`,
//         },
//       };

//       const { data } = await axios.post(
//         "/api/chat",
//         {
//           userId: userId,
//         },
//         config
//       );
//       if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

//       // Selected chat set karein
//       setSelectedChat(data);

//       // Search clear
//       setSearch("");
//       setSearchResult([]);

//       // Drawer close
//       onClose();
//     } catch (error) {
//       console.error("Access Chat Error:", error);

//       toast({
//         title: "Unable to access chat",
//         description:
//           error?.response?.data?.message ||
//           "Something went wrong",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom-left",
//       });
//     } finally {
//       setLoadingChat(false);
//     }
//   };

//   // ========================================
//   // LOGOUT
//   // ========================================

//   const handleLogout = () => {
//     localStorage.removeItem("userInfo");
//     window.location.href = "/";
//   };

//   // ========================================
//   // UI
//   // ========================================

//   return (
//     <>
//       {/* ======================================
//           NAVBAR
//       ======================================= */}

//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         bg="white"
//         width="100%"
//         p={{
//           base: "8px",
//           md: "10px 20px",
//         }}
//         borderBottom="1px solid"
//         borderColor="gray.200"
//         boxShadow="sm"
//         position="relative"
//         zIndex="10"
//       >
//         {/* SEARCH */}

//         <Tooltip
//           label="Search Users to Chat"
//           hasArrow
//         >
//           <Button
//             variant="ghost"
//             onClick={onOpen}
//             borderRadius="full"
//             leftIcon={<SearchIcon />}
//             _hover={{
//               bg: "blue.50",
//               color: "blue.600",
//             }}
//           >
//             <Text
//               display={{
//                 base: "none",
//                 md: "flex",
//               }}
//             >
//               Search User
//             </Text>
//           </Button>
//         </Tooltip>

//         {/* APP NAME */}

//         <Text
//           fontSize={{
//             base: "xl",
//             md: "2xl",
//           }}
//           fontFamily="Work Sans"
//           fontWeight="bold"
//           color="blue.600"
//         >
//           Talk-A-Tive
//         </Text>

//         {/* RIGHT */}

//         <Box
//           display="flex"
//           alignItems="center"
//           gap={2}
//         >
//           {/* NOTIFICATIONS */}

//           <Menu>
//             <MenuButton
//               as={Button}
//               variant="ghost"
//               borderRadius="full"
//               aria-label="Notifications"
//             >
//               <BellIcon fontSize="2xl" />

//               {notifications.length > 0 && (
//                 <Badge
//                   colorScheme="red"
//                   borderRadius="full"
//                   position="absolute"
//                   top="2px"
//                   right="2px"
//                 >
//                   {notifications.length}
//                 </Badge>
//               )}
//             </MenuButton>

//             <MenuList>
//               {notifications.length === 0 ? (
//                 <MenuItem>
//                   No new notifications
//                 </MenuItem>
//               ) : (
//                 notifications.map(
//                   (notification, index) => (
//                     <MenuItem key={index}>
//                       {notification}
//                     </MenuItem>
//                   )
//                 )
//               )}
//             </MenuList>
//           </Menu>

//           {/* PROFILE */}

//           <Menu>
//             <MenuButton
//               as={Button}
//               variant="ghost"
//               p={1}
//               borderRadius="full"
//             >
//               <Avatar
//                 size="sm"
//                 name={user?.name || "User"}
//                 src={user?.pic}
//               />
//             </MenuButton>

//             <MenuList
//               minW="220px"
//               p={2}
//               borderRadius="xl"
//               boxShadow="xl"
//             >
//               <ProfileModal user={user}>
//                 <MenuItem borderRadius="md">
//                   <Avatar
//                     size="xs"
//                     mr={3}
//                     name={user?.name || "User"}
//                     src={user?.pic}
//                   />

//                   <Box>
//                     <Text fontWeight="600">
//                       Profile
//                     </Text>

//                     <Text
//                       fontSize="xs"
//                       color="gray.500"
//                     >
//                       View your profile
//                     </Text>
//                   </Box>
//                 </MenuItem>
//               </ProfileModal>

//               <MenuItem
//                 mt={1}
//                 borderRadius="md"
//                 onClick={handleLogout}
//                 _hover={{
//                   bg: "red.50",
//                   color: "red.500",
//                 }}
//               >
//                 Logout
//               </MenuItem>
//             </MenuList>
//           </Menu>
//         </Box>
//       </Box>

//       {/* ======================================
//           SEARCH DRAWER
//       ======================================= */}

//       <Drawer
//         placement="left"
//         onClose={onClose}
//         isOpen={isOpen}
//         size="sm"
//       >
//         <DrawerOverlay />

//         <DrawerContent>
//           {/* DRAWER HEADER */}

//           <DrawerHeader
//             bg="blue.500"
//             color="white"
//             position="relative"
//           >
//             <Text
//               fontSize="xl"
//               fontWeight="bold"
//             >
//               Search Users
//             </Text>

//             <Text
//               fontSize="sm"
//               opacity={0.85}
//             >
//               Find someone to start a chat
//             </Text>

//             <DrawerCloseButton />
//           </DrawerHeader>

//           {/* DRAWER BODY */}

//           <DrawerBody
//             bg="gray.50"
//             p={5}
//           >
//             <VStack
//               spacing={4}
//               align="stretch"
//             >
//               {/* SEARCH INPUT */}

//               <InputGroup size="lg">
//                 <InputLeftElement>
//                   <SearchIcon color="gray.400" />
//                 </InputLeftElement>

//                 <Input
//                   placeholder="Search by name or email..."
//                   value={search}
//                   onChange={(e) =>
//                     setSearch(e.target.value)
//                   }
//                   bg="white"
//                   borderRadius="lg"
//                   focusBorderColor="blue.400"
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       handleSearch();
//                     }
//                   }}
//                 />
//               </InputGroup>

//               {/* SEARCH BUTTON */}

//               <Button
//                 colorScheme="blue"
//                 size="lg"
//                 borderRadius="lg"
//                 onClick={handleSearch}
//                 isLoading={loading}
//                 loadingText="Searching..."
//                 leftIcon={<SearchIcon />}
//               >
//                 Search
//               </Button>

//               {/* LOADING */}

//               {loading && <ChatLoading />}

//               {/* SEARCH RESULTS */}

//               {!loading &&
//                 searchResult.length > 0 && (
//                   <VStack
//                     spacing={2}
//                     align="stretch"
//                   >
//                     {searchResult.map((result) => (
//                       <UserListItem
//                         key={result._id}
//                         user={result}
//                         handleFunction={() =>
//                           accessChat(result._id)
//                         }
//                       />
//                     ))}
//                   </VStack>
//                 )}

//               {/* NO RESULTS */}

//               {!loading &&
//                 search.trim() &&
//                 searchResult.length === 0 && (
//                   <Box
//                     bg="white"
//                     p={6}
//                     borderRadius="lg"
//                     textAlign="center"
//                   >
//                     <SearchIcon
//                       boxSize={8}
//                       color="gray.300"
//                       mb={3}
//                     />

//                     <Text
//                       fontWeight="600"
//                       color="gray.600"
//                     >
//                       No users found
//                     </Text>

//                     <Text
//                       fontSize="sm"
//                       color="gray.400"
//                       mt={1}
//                     >
//                       Try another name or email.
//                     </Text>
//                   </Box>
//                 )}
//                       </VStack>
//               {loadingChat && <Spinner ml =" auto" d="flex"/>}
//           </DrawerBody>
//         </DrawerContent>
//       </Drawer>
//     </>
//   );
// };

// export default SideDrawer;

import React, { useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  useDisclosure,
  Badge,
  useToast,
  Spinner,
} from "@chakra-ui/react";

import { BellIcon, SearchIcon } from "@chakra-ui/icons";

import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "../../ProfileModal";

import ChatLoading from "../ChatLoading";
import UserListItem from "./UserListItem";

const SideDrawer = () => {
  // ChatState sirf ek baar call karein
  const {
    user,
    setUser,
    setSelectedChat,
    setLoadingChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();

  const toast = useToast();

  // Search states
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  // Drawer
  const {
    isOpen,
    onOpen,
    onClose,
  } = useDisclosure();

  // ========================================
  // SEARCH USERS
  // ========================================

  const handleSearch = async () => {
    if (!search.trim()) {
      toast({
        title: "Enter a name or email",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });

      setSearchResult([]);
      return;
    }

    if (!user?.token) {
      toast({
        title: "Please login again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });

      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/user?search=${encodeURIComponent(search.trim())}`,
        config
      );

      setSearchResult(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search Error:", error);

      toast({
        title: "Search failed",
        description:
          error?.response?.data?.message ||
          "Unable to load users",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });

      setSearchResult([]);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // ACCESS CHAT
  // ========================================

  const accessChat = async (userId) => {
    if (!user?.token) {
      toast({
        title: "Please login again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });

      return;
    }

    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat",
        {
          userId,
        },
        config
      );

      // Selected chat set karein
      setSelectedChat(data);

      // Search clear
      setSearch("");
      setSearchResult([]);

      // Drawer close
      onClose();
    } catch (error) {
      console.error("Access Chat Error:", error);

      toast({
        title: "Unable to access chat",
        description:
          error?.response?.data?.message ||
          "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoadingChat(false);
    }
  };

  const openNotification = async (notification) => {
    let chat = chats?.find(
      (item) => item._id === notification.chatId
    );

    try {
      if (!chat && user?.token) {
        const { data } = await axios.get("/api/chat", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const latestChats = Array.isArray(data) ? data : [];
        setChats(latestChats);
        chat = latestChats.find(
          (item) => item._id === notification.chatId
        );
      }

      if (!chat) {
        toast({
          title: "Chat not found",
          description: "This conversation may no longer be available.",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "bottom-left",
        });
        return;
      }

      setSelectedChat(chat);
      setNotifications((currentNotifications) =>
        currentNotifications.filter(
          (item) => item._id !== notification._id
        )
      );
    } catch (error) {
      toast({
        title: "Unable to open chat",
        description:
          error?.response?.data?.message ||
          "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setSelectedChat(null);
    setUser(null);
    window.location.href = "/";
  };

  // ========================================
  // UI
  // ========================================

  return (
    <>
      {/* NAVBAR */}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        width="100%"
        p={{
          base: "8px",
          md: "10px 20px",
        }}
        borderBottom="1px solid"
        borderColor="gray.200"
        boxShadow="sm"
        position="relative"
        zIndex="10"
      >
        {/* SEARCH */}

        <Tooltip
          label="Search Users to Chat"
          hasArrow
        >
          <Button
            variant="ghost"
            onClick={onOpen}
            borderRadius="full"
            leftIcon={<SearchIcon />}
            _hover={{
              bg: "blue.50",
              color: "blue.600",
            }}
          >
            <Text
              display={{
                base: "none",
                md: "flex",
              }}
            >
              Search User
            </Text>
          </Button>
        </Tooltip>

        {/* APP NAME */}

        <Text
          fontSize={{
            base: "xl",
            md: "2xl",
          }}
          fontFamily="Work Sans"
          fontWeight="bold"
          color="blue.600"
        >
          Talk-A-Tive
        </Text>

        {/* RIGHT */}

        <Box
          display="flex"
          alignItems="center"
          gap={2}
        >
          {/* NOTIFICATIONS */}

          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              borderRadius="full"
              aria-label="Notifications"
            >
              <BellIcon fontSize="2xl" />

              {notifications.length > 0 && (
                <Badge
                  colorScheme="red"
                  borderRadius="full"
                  position="absolute"
                  top="2px"
                  right="2px"
                >
                  {notifications.length}
                </Badge>
              )}
            </MenuButton>

            <MenuList>
              {notifications.length === 0 ? (
                <MenuItem>
                  No new notifications
                </MenuItem>
              ) : (
                notifications.map((notification) => (
                  <MenuItem
                    key={notification._id}
                    onClick={() => openNotification(notification)}
                    display="block"
                    whiteSpace="normal"
                    py={2}
                  >
                    <Text fontWeight="600" fontSize="sm" noOfLines={1}>
                      {notification.senderName || "New message"}
                    </Text>
                    {notification.chatName &&
                      notification.chatName !== notification.senderName && (
                        <Text fontSize="xs" color="gray.500" noOfLines={1}>
                          {notification.chatName}
                        </Text>
                      )}
                    <Text fontSize="sm" noOfLines={2}>
                      {notification.content || "Sent a message"}
                    </Text>
                  </MenuItem>
                ))
              )}
            </MenuList>
          </Menu>

          {/* PROFILE */}

          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              p={1}
              borderRadius="full"
            >
              <Avatar
                size="sm"
                name={user?.name || "User"}
                src={user?.pic}
              />
            </MenuButton>

            <MenuList
              minW="220px"
              p={2}
              borderRadius="xl"
              boxShadow="xl"
            >
              <ProfileModal user={user}>
                <MenuItem borderRadius="md">
                  <Avatar
                    size="xs"
                    mr={3}
                    name={user?.name || "User"}
                    src={user?.pic}
                  />

                  <Box>
                    <Text fontWeight="600">
                      Profile
                    </Text>

                    <Text
                      fontSize="xs"
                      color="gray.500"
                    >
                      View your profile
                    </Text>
                  </Box>
                </MenuItem>
              </ProfileModal>

              <MenuItem
                mt={1}
                borderRadius="md"
                onClick={handleLogout}
                _hover={{
                  bg: "red.50",
                  color: "red.500",
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      {/* SEARCH DRAWER */}

      <Drawer
        placement="left"
        onClose={onClose}
        isOpen={isOpen}
        size="sm"
      >
        <DrawerOverlay />

        <DrawerContent>
          {/* DRAWER HEADER */}

          <DrawerHeader
            bg="blue.500"
            color="white"
            position="relative"
          >
            <Text
              fontSize="xl"
              fontWeight="bold"
            >
              Search Users
            </Text>

            <Text
              fontSize="sm"
              opacity={0.85}
            >
              Find someone to start a chat
            </Text>

            <DrawerCloseButton />
          </DrawerHeader>

          {/* DRAWER BODY */}

          <DrawerBody
            bg="gray.50"
            p={5}
          >
            <VStack
              spacing={4}
              align="stretch"
            >
              {/* SEARCH INPUT */}

              <InputGroup size="lg">
                <InputLeftElement>
                  <SearchIcon color="gray.400" />
                </InputLeftElement>

                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  bg="white"
                  borderRadius="lg"
                  focusBorderColor="blue.400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </InputGroup>

              {/* SEARCH BUTTON */}

              <Button
                colorScheme="blue"
                size="lg"
                borderRadius="lg"
                onClick={handleSearch}
                isLoading={loading}
                loadingText="Searching..."
                leftIcon={<SearchIcon />}
              >
                Search
              </Button>

              {/* LOADING */}

              {loading && <ChatLoading />}

              {/* SEARCH RESULTS */}

              {!loading &&
                searchResult.length > 0 && (
                  <VStack
                    spacing={2}
                    align="stretch"
                  >
                    {searchResult.map((result) => (
                      <UserListItem
                        key={result._id}
                        user={result}
                        handleFunction={() =>
                          accessChat(result._id)
                        }
                      />
                    ))}
                  </VStack>
                )}

              {/* NO RESULTS */}

              {!loading &&
                search.trim() &&
                searchResult.length === 0 && (
                  <Box
                    bg="white"
                    p={6}
                    borderRadius="lg"
                    textAlign="center"
                  >
                    <SearchIcon
                      boxSize={8}
                      color="gray.300"
                      mb={3}
                    />

                    <Text
                      fontWeight="600"
                      color="gray.600"
                    >
                      No users found
                    </Text>

                    <Text
                      fontSize="sm"
                      color="gray.400"
                      mt={1}
                    >
                      Try another name or email.
                    </Text>
                  </Box>
                )}

              {/* ACCESS CHAT LOADING */}

              <Box
                display={setLoadingChat ? "none" : "none"}
              />

            </VStack>

            {/* Chat loading indicator */}

            {false && (
              <Spinner
                ml="auto"
                display="flex"
              />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;