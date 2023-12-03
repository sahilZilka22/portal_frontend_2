import React, {useState} from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Text,
  Flex,
  useToast,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Icon,
} from '@chakra-ui/react';
import {DeleteIcon} from "@chakra-ui/icons";
import ReactPlayer from "react-player";
import { useDisclosure } from '@chakra-ui/react';
import { MdMic } from 'react-icons/md';

const AudioRecorder = ({children,onAudioRecorded}) => {
  

  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [clipName, setClipName] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const [isUploading, setIsUploading] = useState(false)
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const visualize = (stream) => {
  if (!window.AudioContext) {
    console.log('AudioContext not supported on your browser!');
    return;
  }

  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512; // Increase fftSize for slower motion
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);

  const canvas = document.querySelector('.visualizer');
  const canvasCtx = canvas.getContext('2d');

  
  function draw() {
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    let sliceWidth = (WIDTH * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = v * (HEIGHT / 2);

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }
  draw();
  };

  // Function to start recording
  const startRecording = async () => {
  try {
    setClipName('');
    setAudioFile(null);
    setAudioURL('');
    const constraints = { audio: true, video :false };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const mediaOptions = { mimeType: 'audio/webm' }; // You can change this to your desired format and codec

    // Create a new MediaRecorder instance
    const newMediaRecorder = new MediaRecorder(stream,mediaOptions);
    setMediaRecorder(newMediaRecorder);
    

    // Initialize an array to store audio chunks
    const audioChunks = [];
  
    // Event listener for when data is available
    newMediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        // Push the data of the MediaRecorder chunks into audioChunks array
        audioChunks.push(e.data);
      }
    };

    newMediaRecorder.onstop = async () => {
      
      // Create a Blob from audioChunks using async/await
      //new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
      const blob = new Blob(audioChunks, { type: "audio/mpeg-3" });
      const audioURL = URL.createObjectURL(blob);
      // Now you can do something with the audio URL, e.g., save it to state
      setAudioURL(audioURL);
      setAudioFile(blob);
    };
   
    // Call the visualize function to display the audio visualizer
    visualize(stream,true);

    // Start recording
    newMediaRecorder.start();
    setIsRecording(true);
  } catch (error) {
    console.error('Error accessing microphone:', error);
  }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Function to handle audio file upload
  const uploadAudio = ()=>{
    try {
      setIsUploading(true);
        onAudioRecorded(audioFile);
      setIsUploading(false);
      setAudioFile(null)
    } catch (error) {
      toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
    }
  }


  return (
    <>
      {children ? (<span onClick={onOpen}>{children}</span>) :
       (<IconButton
        display={{base : "flex"}}
        icon={<Icon as={MdMic}/>}
        backgroundColor="red.500"
        color="white"
        onClick={onOpen}></IconButton>)
       }
      <Modal size="lg"   isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Audio Recorder</ModalHeader>
        <ModalCloseButton />
        <ModalBody >
          <FormControl>
            <FormLabel>Audio File Name</FormLabel>
          </FormControl>
          <canvas
            className="visualizer"
            height="35"
            style={{
              border: '1px solid #000',
              backgroundColor: '#eee',
              borderRadius: '5px',
            }}
          />
          <Flex justifyContent="space-between" marginTop={3}>
            <Button
              onClick={startRecording}
              isDisabled={isRecording}
              colorScheme="teal"
              variant="solid"
              size="sm"
              w="30%"
            >
              Record
            </Button>
            <Button
              onClick={stopRecording}
              isDisabled={!isRecording}
              colorScheme="red"
              variant="solid"
              size="sm"
              w="30%"
            >
              Stop
            </Button>
            <Button
              onClick={uploadAudio}
              isDisabled={!audioFile}
              colorScheme="blue"
              variant="solid"
              size="sm"
              w="30%"
            >
              {isUploading ? 'Uploading the audio..' : 'Upload Audio'}
            </Button>
          </Flex>
          {audioFile && (
            <Flex alignItems="center" justify="space-between" px={4} py={2} mt={4}>
              <Text fontSize="sm">{clipName ? clipName : 'Recorded Audio'}</Text>
              <IconButton
                icon={<DeleteIcon />}
                onClick={() => {
                  setAudioFile(null);
                  setAudioURL('');
                }}
                colorScheme="red"
                aria-label="Delete Audio"
                size="sm"
              />
            </Flex>
          )}
          {audioFile && (
            <ReactPlayer
              url={audioURL}
              controls
              width="100%"
              height="50px" // You can adjust the height as needed
            />
          )}
        </ModalBody>
        <ModalFooter>
          {/* Add your modal footer content here */}
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  );
}

export default AudioRecorder;
