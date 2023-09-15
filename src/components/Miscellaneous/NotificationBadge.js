import React from 'react'
import { Badge } from "@chakra-ui/layout";

const NotificationBadge = ({notificationCount}) => {
  return (
    <>
      {notificationCount > 0 && (
        <Badge
          position="absolute"
          top="0"
          right="0"
          fontSize="0.8em"
          colorScheme="red"
          variant="solid"
          borderRadius="full"
          paddingX="1.5"
        >
          {notificationCount}
        </Badge>
      )}
    </>
  )
}

export default NotificationBadge