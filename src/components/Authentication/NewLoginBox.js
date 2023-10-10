import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
} from "@chakra-ui/react";
import OTPverify from "./OTPverify";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { firebaseAuth } from "../../config/firebase.config";

const NewLoginBox = () => {
  const { setUser } = ChatState();
  const toast = useToast();
  const history = useHistory();
  const [showOTP, setShowOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [process, setprocess] = useState(false);
  const [loading, setLoading] = useState(false);
  const backend = "https://backend-p1wy.onrender.com/api/v1";
  const localbackend = "http://localhost:5001/api/v1";

  const api = axios.create({
    baseURL: localbackend,
  });
  const submitHandler = async (phoneNumber) => {
    setprocess(true);
    if (!phoneNumber) {
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
      const  response  = await api.post(`/newuser/getuser`, {phoneNumber:phoneNumber}, config);
      console.log(response);
      if (response && response.data) {
        toast({
          title: "Logged in successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }else{
        return toast({
          title: "Error getting the user",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

      }
      setUser(response.data);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      return response.data;
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

  function onCaptchaVerify() {
    if (!window.recaptchaVerifier) {
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
  }

  function onSignUp() {
    setLoading(true);

    // Call onCaptchaVerify to set up reCAPTCHA verification
    onCaptchaVerify();

    const appVerifier = window.recaptchaVerifier;

    // Use a callback to get the latest phoneNumber state value
    setPhoneNumber((prevPhoneNumber) => {
      const formatPh = "+91" + prevPhoneNumber; // Use the previous value of phoneNumber

      signInWithPhoneNumber(firebaseAuth, formatPh, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setLoading(false);
          setShowOTP(true);

          toast({
            title: "OTP sent Successfully",
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "bottom",
          });
        })
        .catch((error) => {
          setLoading(false);

          toast({
            title: "Error Occurred!",
            description: error.message, // Display the error message from Firebase
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        });

      return prevPhoneNumber; // Return the previous value to update the state
    });
  }


 function OTPVerify(otp) {
   setLoading(true);
   window.confirmationResult
     .confirm(otp)
     .then(async (res) => {
       setLoading(false);

       // Call the submitHandler function and await its response
       const response = await submitHandler(phoneNumber);

       if (response && response.status === 200) {
         setShowOTP(false);
         history.push("/chats");
         console.log("Method working properly");
       } else {
         console.log("Some error occurred or user does not exist.");
       }
     })
     .catch((err) => {
       console.log(err);
       setLoading(false);
       alert(err);
     });
 }

  return (
    <>
      <div id="recaptcha-container" style={{display:"flex"}}></div>
      {showOTP ? (
        <>
          <OTPverify OTPverify={OTPVerify} />
        </>
      ) : (
        <>
          <VStack>
            <FormControl id="phoneNumber" isRequired>
              <FormLabel>Phone Number</FormLabel>
              <InputGroup>
                <InputLeftAddon children="+91" />
                <Input
                  type="tel"
                  maxLength={10}
                  placeholder="Phone number"
                  _placeholder={{ opacity: 2, color: "black" }}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <Button
              colorScheme="blue"
              width="100%"
              style={{ marginTop: 15 }}
              onClick={onSignUp}
              isLoading={process}
            >
              Login
            </Button>
          </VStack>
        </>
      )}
    </>
  );
};

export default NewLoginBox;
