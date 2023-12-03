import React from 'react'
import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";
import {Text} from "@chakra-ui/react"

const UserBadgeItem = ({user,handleFunction,admin}) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="subtle"
      fontSize={12}
      colorScheme="red.200"
      cursor="pointer"
      onClick={handleFunction}
    >
      {<span>{user.name} ({user.role})</span>}
      {admin === user._id && <span> (Admin)</span>}
      <CloseIcon pl={1} />
    </Badge>
  );
}

export default UserBadgeItem