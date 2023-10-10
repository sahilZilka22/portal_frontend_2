import { Button,
     FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack } from '@chakra-ui/react';
import React from 'react'
import { useState } from "react";
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import {useHistory} from "react-router-dom"
import {ChatState} from "../../Context/ChatProvider"

const Loginbox = () => {
    const [show, setshow] = useState(false);
    const toast = useToast();
    const history = useHistory();
    const [process, setprocess] =useState(false);
    const [email, setmail] = useState();
    const [password, setpassword] = useState();
    const { setUser } = ChatState();
    const backend = 'https://backend-p1wy.onrender.com/api/v1'
    const localbackend = "http://localhost:5001/api/v1"

    const handleClick = ()=> setshow(!show)
    const submitHandler = async () => {
    setprocess(true);
    if (!email || !password) {
        toast({
        title: "Please Fill all the fields",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
        });
        setprocess(false);
        return;
    }
    try {
        const config = {
        headers: {
            "Content-type": "application/json",
        },
        };
        const response = await axios.post(`${localbackend}/user/login`, { email, password, }, config );

        if (response && response.data) {
            toast({
                title: "Logged in successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
        });
            setUser(response.data);
            localStorage.setItem("userInfo", JSON.stringify(response.data));
            history.push("/chats");
        } else {
        // Handle the case where the response or response.data is undefined
                toast({
                    title: "Error Occurred!",
                    description: "An unexpected error occurred.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
        }
    } catch (error) {
        if (error.response) {
        // Handle the case where the error has a response object
            toast({
                title: "Error Occurred !",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } else {
        // Handle other types of errors (e.g., network errors)
            toast({
                title: "Error Occurred from the server!",
                description: "An unexpected error occurred.",
                status: "error",
                duration: 6000,
                isClosable: true,
                position: "bottom",
            });
        }
    } finally {
        setprocess(false);
    }
    };

  return (
    <VStack>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                 <Input placeholder='Enter your email'value={email} onChange={(e) => setmail(e.target.value)}>
                 </Input>
                </FormControl>
                 <FormControl id='password' isRequired>
                 <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input type={show ? "text": "password"}
                     placeholder='Type your password' 
                     value={password}
                     onChange={(e) => setpassword(e.target.value)}/>
                 <InputRightElement width='4.5rem'>
                 <Button h="1.75rem" size="sm" onClick={handleClick}>
                     {show ? "Hide": "Show"}
                 </Button>
                 </InputRightElement>
             </InputGroup>
         </FormControl>
            <Button
             colorScheme='blue'
             width="100%"
             style={{marginTop : 15}}
             onClick={submitHandler}
             isLoading={process}>
                Login
            </Button>
         <Button
             colorScheme='red'
             width="100%"
             style={{marginTop : 15}}
             onClick={()=>{
            setmail("guest@gmail.com")
             setpassword("123456")
         }}>
            Get Guest credentials
        </Button>
    </VStack>
  )
}

export default Loginbox