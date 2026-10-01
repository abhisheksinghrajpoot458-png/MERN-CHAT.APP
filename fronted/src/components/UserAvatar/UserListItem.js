
// import React from "react";

// import {
//     Box,
//     Text,
//     Avatar,
// } from "@chakra-ui/react";


// const UserListItem = ({
//     user,
//     handleFunction,
// }) => {

//     return (
//         <Box
//             onClick={handleFunction}
//             cursor="pointer"
//             bg="#E8E8E8"
//             _hover={{
//                 background: "#38B2AC",
//                 color: "white",
//             }}
//             w="100%"
//             display="flex"
//             alignItems="center"
//             color="black"
//             px={3}
//             py={2}
//             mb={2}
//             borderRadius="lg"
//         >

//             {/* Profile Image */}

//             <Avatar
//                 mr={2}
//                 size="sm"
//                 cursor="pointer"
//                 name={user?.name || "User"}
//                 src={user?.pic}
//             />


//             {/* User Details */}

//             <Box>

//                 <Text
//                     fontWeight="500"
//                 >
//                     {user?.name || "Unknown User"}
//                 </Text>


//                 <Text
//                     fontSize="xs"
//                 >
//                     <b>Email:</b>{" "}
//                     {user?.email || "No email"}
//                 </Text>

//             </Box>

//         </Box>
//     );
// };


// export default UserListItem;


import React from "react";

import {
    Box,
    Text,
    Avatar,
} from "@chakra-ui/react";

const UserListItem = ({
    user,
    handleFunction,
}) => {
    return (
        <Box
            onClick={handleFunction}
            cursor="pointer"
            bg="#E8E8E8"
            _hover={{
                background: "#38B2AC",
                color: "white",
            }}
            width="100%"
            display="flex"
            alignItems="center"
            color="black"
            px={3}
            py={2}
            mb={2}
            borderRadius="lg"
        >
            <Avatar
                mr={3}
                size="sm"
                name={user?.name || "User"}
                src={user?.pic}
            />

            <Box>
                <Text fontWeight="600">
                    {user?.name || "Unknown User"}
                </Text>

                <Text fontSize="xs">
                    <b>Email:</b>{" "}
                    {user?.email || "N/A"}
                </Text>
            </Box>
        </Box>
    );
};

export default UserListItem;

