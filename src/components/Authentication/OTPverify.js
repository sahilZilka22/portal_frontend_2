import { Box, Text, Button, Spinner,HStack,PinInput,PinInputField } from "@chakra-ui/react";
import React, { useState } from "react";
import OTPInput from "otp-input-react";

const OTPverify = ({OTPverify}) => {
  
  const [otp, setOTP] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleVerifyOTP = () => {
      OTPverify(otp);
  };
  
  return (
    <Box
      textAlign="center"
      p="2"
      display="flex"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
    >
      <Text fontSize="xl" marginBottom="5">
        Enter OTP
      </Text>
      <Box display="flex" justifyContent="space-between" gap="1">
        <HStack>
          <PinInput value={otp} onChange={setOTP}>
            <PinInputField  />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </HStack>
      </Box>
      <Button
        onClick={handleVerifyOTP}
        mt="2"
        colorScheme="blue"
        width="70%"
        style={{ marginTop: 15 }}
      >
        {verifying && (
          <Spinner
            thickness="3px"
            speed="0.5s"
            emptyColor="gray.200"
            color="blue.500"
            size="md"
            marginRight={6}
          />
        )}
        <Text fontSize="md">Verify</Text>
      </Button>
    </Box>
  );
  
};

export default OTPverify;

/** 
 * 
//.otp-container {
apply flex justify-between gap-2
}
//.otp-container input {
apply !mr-0 flex-1 py-5 outline-none;
}
*/
