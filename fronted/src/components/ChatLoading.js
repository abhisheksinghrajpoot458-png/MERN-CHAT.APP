
// import React from "react";

// import {
//     Stack,
//     Skeleton,
// } from "@chakra-ui/react";


// const ChatLoading = () => {
//     return (
//         <Stack
//             spacing={4}
//             padding="10px"
//         >
//             <Skeleton height="20px" />
//             <Skeleton height="20px" />
//             <Skeleton height="20px" />
//             <Skeleton height="20px" />
//             <Skeleton height="20px" />
//             <Skeleton height="20px" />
//         </Stack>
//     );
// };


// export default ChatLoading;



// import React from "react";

// import {
//     Stack,
//     Skeleton,
// } from "@chakra-ui/react";

// const ChatLoading = () => {
//     return (
//         <Stack spacing={3} p={3}>
//             <Skeleton height="20px" />
//             <Skeleton height="20px" />
//             <Skeleton height="20px" />
//             <Skeleton height="20px" />
//             <Skeleton height="20px" />
//             <Skeleton height="20px" />
//         </Stack>
//     );
// };

// export default ChatLoading;

import React from "react";
import {
  Stack,
  Skeleton,
} from "@chakra-ui/react";

const ChatLoading = () => {
  return (
    <Stack spacing={3}>
      <Skeleton height="50px" borderRadius="md" />
      <Skeleton height="50px" borderRadius="md" />
      <Skeleton height="50px" borderRadius="md" />
      <Skeleton height="50px" borderRadius="md" />
      <Skeleton height="50px" borderRadius="md" />
    </Stack>
  );
};

export default ChatLoading;