

import React from "react";

import {
  Box,
  Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      bg="purple.500"
      color="white"
      fontSize="12px"
      cursor="pointer"
      display="flex"
      alignItems="center"
      gap={1}
      onClick={handleFunction}
    >
      <Text>{user?.name}</Text>

      <CloseIcon boxSize={2.5} />
    </Box>
  );
};

export default UserBadgeItem;

