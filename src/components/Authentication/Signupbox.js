import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React from 'react'
import { useState } from "react";
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import {useHistory} from "react-router-dom"


const Signupbox = () => {
    const toast =  useToast();
    const history = useHistory();

    const [show, setshow] = useState(false);
    const [name, setname] = useState();
    const [email, setmail] = useState();
    const [password, setpassword] = useState();
    const [confimpassword, setconfirmpassword] = useState();
    const [photo, setphoto] = useState();
    const [picloading,setPicloading] = useState(false);
   
    const backend = 'https://backend-p1wy.onrender.com/api/v1'
    const localbackend = "http://localhost:5001/api/v1"

    //making a function handle click which will invert the value of show usestate
    const handleClick = ()=> setshow(!show)

    const submitHandler = async()=> {
        setPicloading(true);
        if(!name || !email || !password || !confimpassword){
            toast({
                title: "Please Fill all the feilds",
                status : "warning",
                duration : 4000,
                isClosable : true,
                position : "bottom"
            });
            setPicloading(false);
            return;
        }
        if(password !== confimpassword){
            toast({
                title: "Passwords Do not match",
                status : "warning",
                duration : 4000,
                isClosable : true,
                position : "bottom"
            });
            return;
        }
        
        try {
            const config = {
                headers : {
                     "Content-type": "application/json",
                }
            };
            const {data } = await axios.post(`${backend}/user/`,{
                name,email,password,photo
            },config);
      
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setPicloading(false);
            history.push("/chats");
        } catch (error) {
             if(error.response){
                toast({
                    title: "Error Occured!",
                    description: error.response.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
             }else{ // network errors
                 toast({
                    title: "Error Occured from the servers!",
                    description: error.response.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
             }
            setPicloading(false);
          };
            
        }
    const postDetails = (pics) =>{
                setPicloading(true);
                if (pics === undefined) {
                    toast({
                        title: "Please Select an Image!",
                        status: "warning",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                });
                    return;
                }
                   
                if (pics.type === "image/jpeg" || pics.type === "image/png") {
                    const data = new FormData();
                    data.append("file", pics);
                    data.append("upload_preset", "chat-app");
                    data.append("cloud_name", "piyushproj");
                    fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
                        method: "post",
                        body: data,
                })
                .then((res) => res.json())
                    .then((data) => {
                        setphoto(data.url.toString());
                        setPicloading(false);
                    })
                .catch((err) => {
                        console.log(err);
                        setPicloading(false);
                    });
                } else {
                toast({
                    title: "Please Select an Image!",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                setPicloading(false);
                return;
                }

    }


  return (
    <VStack>
        <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter your name' onChange={(e) => setname(e.target.value)}>
            </Input>
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter your email' onChange={(e) => setmail(e.target.value)}>
            </Input>
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input type={show ? "text": "password"}
                 placeholder='Type your password' 
                 onChange={(e) => setpassword(e.target.value)}
                 />
                 <InputRightElement width='4.5rem'>
                 <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide": "Show"}
                 </Button>
                 </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='confirm-password' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input type={show ? "text": "password"}
                 placeholder='Type your password again' 
                 onChange={(e) => setconfirmpassword(e.target.value)}
                 />
                 <InputRightElement width='4.5rem'>
                 <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide": "Show"}
                 </Button>
                 </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl>
            <FormLabel>Upload your Picture </FormLabel>
            <Input type='file'
            p={1.5}
            accept='image/*'
            onChange={(e) => postDetails(e.target.files[0])}/>
        </FormControl>
        <Button
        colorScheme='blue'
        width="100%"
        style={{marginTop : 15}}
        onClick={submitHandler}
        isLoading={picloading} 
        >
            Sign Up
        </Button>
    </VStack>
  )
}

export default Signupbox

/*
use vstack from chakra => spacing 5px
Forrms
formcontrol,    form label and <Input/>
input => place holder,onChange
make useState for name email password, confirm password and picture
*/