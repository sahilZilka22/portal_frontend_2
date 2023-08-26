import React, { useEffect } from 'react'
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Loginbox from '../components/Authentication/Loginbox';
import Signupbox from '../components/Authentication/Signupbox';
import { useHistory } from "react-router-dom";

const HomePage = () => {
  const history =useHistory();
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if(user) history.push("/chats")
  },[history])
  return (
    <Container maxW="xl" centerContent>
        <Box 
        d="flex"
        justifyContent="center"
        p={3}
        bg="whatsapp.300"
        w='100%'
        m="40px 0 15px 0 "
        borderRadius="1g"
        borderWidth='1px'
    
        >
            <Text fontSize='4xl' fontFamily="Work sans">
                Dooper Portal
            </Text>
        </Box>
        <Box bg='blue.300' w="100%" p={4} borderRadius='1g' borderWidth='1px'>
            <Tabs variant='soft-rounded' colorScheme='green'>
            <TabList mb='1em'>
                <Tab width="50%">Login</Tab>
                <Tab width='50%'>Sign Up!</Tab>
            </TabList>
            <TabPanels>
                <TabPanel> <Loginbox/> </TabPanel>
                <TabPanel> <Signupbox/> </TabPanel>
            </TabPanels>
            </Tabs>
        </Box>

    </Container>
  )
}

export default HomePage

/*

tabpanel will contain the components to be shown



*/