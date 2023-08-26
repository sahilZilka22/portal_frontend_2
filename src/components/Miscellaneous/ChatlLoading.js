import { Stack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height="32px" />
      <Skeleton height="32px" />
      <Skeleton height="32px" />
      <Skeleton height="32px" />
      <Skeleton height="32px" />
      <Skeleton height="32px" />
      <Skeleton height="32px" />
      <Skeleton height="32px" />
      <Skeleton height="32px" />
      <Skeleton height="32px" />
      <Skeleton height="32px" />
      <Skeleton height="32px" />
    </Stack>
  );
};

export default ChatLoading;