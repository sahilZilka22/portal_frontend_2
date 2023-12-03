import {
  Box,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  VStack,
  Radio,
  Stack,
  RadioGroup,
  Toast,
  SimpleGrid,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import OTPverify from "./OTPverify";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { firebaseAuth } from "../../config/firebase.config";

const NewSignUpBox = () => {
  const toast = useToast();
  const history = useHistory();
  const [name, setname] = useState();
  const [ph, setph] = useState();
  const [role, setRole] = useState("");
  const [photo, setphoto] = useState();
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [picloading, setPicloading] = useState(false);
  const backend = "https://dooper-backend.onrender.com/api/v1";
  const localbackend = "http://localhost:5001/api/v1";

  const submitHandler = async () => {
    setPicloading(true);
    console.log(name,ph,role);
    if (!name || !ph || !role) {
      toast({
        title: "Please Fill all the feilds",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setPicloading(false);
      console.log("just left this");
      return;
    }

    try {
      console.log("sending");
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${backend}/newuser/`,
        {
          name,
          phoneNumber: ph,
          role,
          photo,
        },
        config
      );

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
      console.log(data);
      return data;
    } catch (error) {
      if (error.response) {
        console.log(error);
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        console.log(error);
        // network errors
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
    }
  };

  const postDetails = (pics) => {
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
    console.log("sending picture");
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
  };

  function onCaptchaVerify() {
    window.recaptchaVerifier = new RecaptchaVerifier(
      firebaseAuth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          onSignUp();
        },
        "expired-callback": () => {},
      }
    );
  }

  const onSignUp = async () => {
    setLoading(true);
    onCaptchaVerify();
    const formatPh = "+91" + ph;
    console.log(formatPh);
    try {
      const confirmationResult = await signInWithPhoneNumber(
        firebaseAuth,
        formatPh,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmationResult;
      setLoading(false);
      setShowOTP(true);

      toast({
        title: "OTP sent",
        description: "OTP send succesfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to send the OTP",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const OTPVerify = async (otp) => {
    setLoading(true);

    try {
      const res = await window.confirmationResult.confirm(otp);
      setLoading(false);

      // Check if the user exists or take necessary ac tion
      const user = await submitHandler(name, ph, role);
      if (user) {
        setShowOTP(false);
        console.log("Method working properly");
      } else {
        console.log("some error getting the user");
      }
    } catch (err) {
      if (err.code === "auth/invalid-verification-code") {
        toast({
          title: "Error Occured!",
          description: "Invalid OTP. Please enter a valid OTP.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        toast({
          title: "Error Occured!",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

      setLoading(false);
    }
  };
  return (
    <>
      <div id="recaptcha-container"></div>
      {showOTP ? (
        <>
          <OTPverify OTPverify={OTPVerify} />
        </>
      ) : (
        <>
          <VStack>
            <FormControl id="first-name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter your name"
                _placeholder={{ opacity: 2, color: "black" }}
                onChange={(e) => setname(e.target.value)}
              ></Input>
            </FormControl>
            <FormControl id="phoneNumber" isRequired>
              <FormLabel>Phone Number</FormLabel>
              <InputGroup>
                <InputLeftAddon children="+91" />
                <Input
                  type="tel"
                  maxLength={10}
                  placeholder="Phone number"
                  _placeholder={{ opacity: 2, color: "black" }}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setph(e.target.value)
                  }}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Upload your Picture </FormLabel>
              <Input
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
              />
            </FormControl>
            <Box textAlign="center">
              <Heading as="h6" size="sm" mb={2}>
                Select the user type
              </Heading>
              <RadioGroup onChange={setRole} value={role} colorScheme="red">
                <SimpleGrid columns={[1, 2, 3]} spacing={4} alignItems="center">
                  <Radio value="DOCTOR">Doctor</Radio>
                  <Radio value="DOOPER">Dooper</Radio>
                  <Radio value="DHA">DHA</Radio>
                  <Radio value="LAB">Lab</Radio>
                  <Radio value="PHARMACY">Pharmacy</Radio>
                  <Radio value="USER">User</Radio>
                </SimpleGrid>
              </RadioGroup>
            </Box>

            <Button
              colorScheme="red"
              width="100%"
              style={{ marginTop: 15 }}
              onClick={onSignUp}
            >
              Sign Up
            </Button>
          </VStack>
        </>
      )}
    </>
  );
};

export default NewSignUpBox;
