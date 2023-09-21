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

     const handleClick = ()=> setshow(!show)
     const submitHandler = async()=> {
        setprocess(true);
        if(!email || !password){
            toast({
                title: "Please Fill all the feilds",
                status : "warning",
                duration : 4000,
                isClosable : true,
                position : "bottom"
            });
            setprocess(false);
            return;
        }
        try {
            const config = {
                headers : {
                     "Content-type": "application/json",
                }
            };
            const {data} = await axios.post("https://backend-p1wy.onrender.com/api/v1/user/login",{
                email,password
            },config);
            toast({
                title: "Logged in successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setprocess(false);
            history.push("/chats");
        } catch (error) {
              toast({
                    title: "Error Occured!",
                    description: error.response.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
            });
            setprocess(false);
        };

     }
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
                 onChange={(e) => setpassword(e.target.value)}
                 />
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