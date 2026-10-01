

// // import React from "react";

// // import {
// //     Modal,
// //     ModalOverlay,
// //     ModalContent,
// //     ModalHeader,
// //     ModalCloseButton,
// //     ModalBody,
// //     ModalFooter,
// //     Button,
// //     IconButton,
// //     Image,
// //     Text,
// //     VStack,
// // } from "@chakra-ui/react";

// // import { ViewIcon } from "@chakra-ui/icons";
// // import { useDisclosure } from "@chakra-ui/react";


// // const ProfileModal = ({ user, children }) => {

// //     const { isOpen, onOpen, onClose } = useDisclosure();

// //     return (
// //         <>
// //             {/* Open Profile Modal */}
// //             {children ? (
// //                 <span
// //                     onClick={onOpen}
// //                     style={{ cursor: "pointer" }}
// //                 >
// //                     {children}
// //                 </span>
// //             ) : (
// //                 <IconButton
// //                     aria-label="View Profile"
// //                     icon={<ViewIcon />}
// //                     onClick={onOpen}
// //                 />
// //             )}

// //             {/* Profile Modal */}
// //             <Modal
// //                 isOpen={isOpen}
// //                 onClose={onClose}
// //                 isCentered
// //             >
// //                 <ModalOverlay />

// //                 <ModalContent>

// //                     <ModalHeader textAlign="center">
// //                         {user?.name || "User Profile"}
// //                         fontSize: ="40px"
// //                         fontFamily: "Work Sans"
// //                         d="flex"
// //                         justifyContent: "center"
// //                     </ModalHeader>

// //                     <ModalCloseButton />

// //                     <ModalBody
// //                     d= "flex"
// //                         flexDir="column"
// //                         alignItems="center"
// //                         justifyContent="center"
                    
// //                     >

// //                         <VStack spacing={4}>

// //                             {/* Profile Image */}
// //                             {user?.pic && (
// //                                 <Image
// //                                     borderRadius="full"
// //                                     boxSize="120px"
// //                                     src={user.pic}
// //                                     alt={user?.name || "User"}
// //                                 />
// //                             )}

// //                             {/* Name */}
// //                             <Text
// //                                 fontSize="xl"
// //                                 fontWeight="bold"
// //                             >
// //                                 {user?.name || "N/A"}
// //                             </Text>

// //                             {/* Email */}
// //                             <Text>
// //                                 <strong>Email:</strong>{" "}
// //                                 {user?.email || "N/A"}
// //                             </Text>

// //                         </VStack>

// //                     </ModalBody>

// //                     <ModalFooter>

// //                         <Button
// //                             colorScheme="blue"
// //                             onClick={onClose}
// //                         >
// //                             Close
// //                         </Button>

// //                     </ModalFooter>

// //                 </ModalContent>
// //             </Modal>
// //         </>
// //     );
// // };


// // export default ProfileModal;




// import React from "react";

// import {
//     Modal,
//     ModalOverlay,
//     ModalContent,
//     ModalHeader,
//     ModalCloseButton,
//     ModalBody,
//     ModalFooter,
//     Button,
//     IconButton,
//     Image,
//     Text,
//     VStack,
//     Box,
//     Divider,
// } from "@chakra-ui/react";

// import { ViewIcon } from "@chakra-ui/icons";
// import { useDisclosure } from "@chakra-ui/react";

// const ProfileModal = ({ user, children }) => {
//     const { isOpen, onOpen, onClose } = useDisclosure();

//     return (
//         <>
//             {/* =========================
//                 OPEN PROFILE MODAL
//             ========================== */}
//             {children ? (
//                 <Box
//                     onClick={onOpen}
//                     cursor="pointer"
//                     width="100%"
//                 >
//                     {children}
//                 </Box>
//             ) : (
//                 <IconButton
//                     aria-label="View Profile"
//                     icon={<ViewIcon />}
//                     onClick={onOpen}
//                     variant="ghost"
//                 />
//             )}

//             {/* =========================
//                 PROFILE MODAL
//             ========================== */}
//             <Modal
//                 isOpen={isOpen}
//                 onClose={onClose}
//                 isCentered
//                 size="sm"
//             >
//                 <ModalOverlay
//                     backdropFilter="blur(5px)"
//                 />

//                 <ModalContent
//                     borderRadius="2xl"
//                     overflow="hidden"
//                     boxShadow="2xl"
//                 >

//                     {/* Header */}
//                     <ModalHeader
//                         textAlign="center"
//                         fontSize="28px"
//                         fontFamily="Work Sans"
//                         fontWeight="bold"
//                         color="blue.600"
//                         pt={6}
//                     >
//                         User Profile
//                     </ModalHeader>

//                     <ModalCloseButton />

//                     {/* Body */}
//                     <ModalBody
//                         display="flex"
//                         flexDirection="column"
//                         alignItems="center"
//                         justifyContent="center"
//                         pb={6}
//                     >
//                         <VStack
//                             spacing={5}
//                             width="100%"
//                         >

//                             {/* Profile Image */}
//                             <Box
//                                 padding="5px"
//                                 borderRadius="full"
//                                 border="4px solid"
//                                 borderColor="blue.400"
//                                 boxShadow="lg"
//                             >
//                                 <Image
//                                     borderRadius="full"
//                                     boxSize="140px"
//                                     objectFit="cover"
//                                     src={
//                                         user?.pic ||
//                                         "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
//                                     }
//                                     alt={user?.name || "User"}
//                                 />
//                             </Box>

//                             {/* Name */}
//                             <Box textAlign="center">
//                                 <Text
//                                     fontSize="2xl"
//                                     fontWeight="bold"
//                                     color="gray.800"
//                                 >
//                                     {user?.name || "N/A"}
//                                 </Text>

//                                 <Text
//                                     fontSize="sm"
//                                     color="gray.500"
//                                     mt={1}
//                                 >
//                                     Chat User
//                                 </Text>
//                             </Box>

//                             <Divider />

//                             {/* Email */}
//                             <Box
//                                 width="100%"
//                                 bg="gray.50"
//                                 borderRadius="lg"
//                                 padding={4}
//                             >
//                                 <Text
//                                     fontSize="sm"
//                                     color="gray.500"
//                                     fontWeight="semibold"
//                                     mb={1}
//                                 >
//                                     EMAIL ADDRESS
//                                 </Text>

//                                 <Text
//                                     fontSize="md"
//                                     color="gray.700"
//                                     wordBreak="break-word"
//                                 >
//                                     {user?.email || "N/A"}
//                                 </Text>
//                             </Box>

//                         </VStack>
//                     </ModalBody>

//                     {/* Footer */}
//                     <ModalFooter
//                         justifyContent="center"
//                         pb={6}
//                     >
//                         <Button
//                             colorScheme="blue"
//                             width="160px"
//                             borderRadius="full"
//                             onClick={onClose}
//                             size="md"
//                         >
//                             Close
//                         </Button>
//                     </ModalFooter>

//                 </ModalContent>
//             </Modal>
//         </>
//     );
// };

// export default ProfileModal;


import React from "react";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Image,
    Text,
    VStack,
    Avatar,
    Box,
    useDisclosure,
} from "@chakra-ui/react";

const ProfileModal = ({
    user,
    children,
    variant = "default",
    triggerWidth = "100%",
}) => {
    const isChatProfile = variant === "chat";
    const {
        isOpen,
        onOpen,
        onClose,
    } = useDisclosure();

    return (
        <>
            <Box
                as="span"
                onClick={onOpen}
                cursor="pointer"
                display="inline-block"
                width={triggerWidth}
            >
                {children || (
                    <Avatar
                        size="sm"
                        name={user?.name || "User"}
                        src={user?.pic}
                    />
                )}
            </Box>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                size="sm"
            >
                <ModalOverlay />

                <ModalContent
                    borderRadius={isChatProfile ? "md" : "2xl"}
                    overflow="hidden"
                >
                    <ModalHeader
                        textAlign="center"
                        bg={isChatProfile ? "white" : "blue.500"}
                        color={isChatProfile ? "gray.800" : "white"}
                        fontSize={isChatProfile ? "2xl" : "2xl"}
                        fontFamily="Work Sans"
                    >
                        {isChatProfile ? user?.name || "User" : "User Profile"}
                    </ModalHeader>

                    <ModalCloseButton color={isChatProfile ? "gray.600" : "white"} />

                    <ModalBody
                        py={isChatProfile ? 5 : 8}
                    >
                        <VStack spacing={isChatProfile ? 3 : 4}>
                            <Image
                                src={user?.pic}
                                fallbackSrc="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                                alt={user?.name || "User"}
                                boxSize={isChatProfile ? "100px" : "140px"}
                                borderRadius="full"
                                objectFit="cover"
                                border={isChatProfile ? "none" : "4px solid"}
                                borderColor="blue.100"
                            />

                            {!isChatProfile && (
                                <Text fontSize="2xl" fontWeight="bold">
                                    {user?.name || "User"}
                                </Text>
                            )}

                            <Box
                                width="100%"
                                bg={isChatProfile ? "transparent" : "gray.50"}
                                p={isChatProfile ? 0 : 4}
                                borderRadius="lg"
                                textAlign={isChatProfile ? "center" : "left"}
                            >
                                <Text color="gray.500">
                                    {isChatProfile && "Email: "}
                                    {!isChatProfile && "Email"}
                                    {!isChatProfile && (
                                        <Text as="span" fontWeight="500" color="gray.800">
                                            {` ${user?.email || "N/A"}`}
                                        </Text>
                                    )}
                                    {isChatProfile && (user?.email || "N/A")}
                                </Text>
                            </Box>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            width={isChatProfile ? "auto" : "100%"}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ProfileModal;

