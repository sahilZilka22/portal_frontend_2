import React, { useEffect } from 'react'
import {
  Box,
  Container,
  Flex,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import NewSignUpBox from '../components/Authentication/NewSignUpBox';
import NewLoginBox from '../components/Authentication/NewLoginBox';

const HomePage = () => {
  const history =useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo && userInfo.status !== 404) {
      history.push("/chats");
    }
  }, [history]);

  return (
    <>
      <Container
        maxW="xl"
        maxH="-webkit-fit-content"
        justifyContent="flex-end"
        centerContent
        overflowY="auto"
        display={{
          base: "none",
          sm: "none",
          md: "block",
          lg: "block",
          xl: "block",
        }}
      >
        <Flex flexDirection="column">
          {/* Container for Text */}
          <Box mb={4}>
            <Text
              style={{
                color: "white",
                fontSize: 28,
                fontFamily: "Montserrat",
                fontWeight: "700",
                wordWrap: "break-word",
              }}
            >
              Welcome to
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 40,
                fontFamily: "Montserrat",
                fontWeight: "500",
                wordWrap: "break-word",
              }}
            >
              Dooper Portal
            </Text>
          </Box>
          {/* Container for Photo */}
          <Box pb={4} mt={10}>
            {/* Add your photo here */}
            <Image
              boxSize="450px"
              objectFit="cover"
              src="https://cloud.appwrite.io/v1/storage/buckets/650443d58db969add1ca/files/656318a11ae2bd003140/view?project=64fbff681fc58dbffca3&mode=admin" // Placeholder image source
              alt="Your Photo"
            />
          </Box>
        </Flex>
      </Container>

      <Container maxW="100%" backgroundColor="white" centerContent>
        <Box>
          <Image
            margin={16}
            src="https://cloud.appwrite.io/v1/storage/buckets/650443d58db969add1ca/files/65631808db0c623d2311/view?project=64fbff681fc58dbffca3&mode=admin" // Placeholder image source
            alt="Your Photo"
          />
        </Box>
        <Text
          style={{
            color: "black",
            fontSize: 22,
            fontFamily: "Montserrat",
            fontWeight: "500",
            wordWrap: "break-word",
          }}
        >
          Welcome to Dooper, Please enter your details
        </Text>

        {/* Container for Tabs */}
        <Box flex="1" p={4}>
          <Box bg="white" w="100%" p={4}>
            <Tabs
              variant="soft-rounded"
              colorScheme="red"
              isFitted
              bg="white" // Set background color to light gray
              borderRadius="md" // Add slight border radius
              p={4} // Add padding
              maxH="500px" // Set maximum height
              w="400px" // Set fixed width
            >
              <TabList mb="1em">
                <Tab width="50%">Login</Tab>
                <Tab width="50%">Sign Up!</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <NewLoginBox />
                </TabPanel>
                <TabPanel>
                  <NewSignUpBox />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default HomePage

//TODO: divide the screen in 2 containers one for the photo and another for tabs