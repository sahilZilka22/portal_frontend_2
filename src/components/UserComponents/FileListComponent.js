import React, { useState } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { DownloadIcon } from "@chakra-ui/icons";
import {MdPlayCircle} from "react-icons/md"
import ReactPlayer from "react-player";

const FileListComponent = ({ files }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState(null);
  const isVideoFile = selectedFile && selectedFile.file_type.startsWith("video/mp4");
  const videoThumbnailUrl = "https://cloud.appwrite.io/v1/storage/buckets/64fbffae4ddba6825d2c/files/650de38d8b71cfcda75d/view?project=64fbff681fc58dbffca3&mode=admin"
  const playbutton = "https://cloud.appwrite.io/v1/storage/buckets/64fbffae4ddba6825d2c/files/650de396818b9315dbe1/view?project=64fbff681fc58dbffca3&mode=admin"
  const openModal = (file) => {
    setSelectedFile(file);
    onOpen(); // Open the modal using onOpen from useDisclosure
  };

  const closeModal = () => {
    setSelectedFile(null);
    onClose(); // Close the modal using onClose from useDisclosure
  };

  return (
    <>
     {files.map((file, index) => (
        <div key={index} style={{ marginBottom: '10px', cursor: 'pointer' }}>
          {file.file_type === 'image/jpeg' || file.file_type === 'image/png' ? (
            <div onClick={() => openModal(file)}>
              <Tooltip label="Click to view" hasArrow>
                <img
                  src={file.download_url}
                  style={{
                    maxWidth: '250px',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                  }}
                  alt="Image"
                />
              </Tooltip>
            </div>
          ) : file.file_type === 'video/mp4' ? (
            <div onClick={() => openModal(file)}>
              <Tooltip label="Click to play video" hasArrow>
                <div
                  style={{
                    maxWidth: '250px',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                    backgroundColor: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {/* You can add a video thumbnail here */}
                  <img
                    src={videoThumbnailUrl} // Replace with video thumbnail URL
                    style={{
                      maxWidth: '50%',
                      maxHeight: '50%',
                    }}
                    alt="Video Thumbnail"
                  />
                  {/* Play button */}
                  <div>
                    <IconButton
                      icon={<Icon as={MdPlayCircle} boxSize={10} />}
                      variant="ghost"
                      colorScheme="blue"
                      aria-label="Play Video"
                      size="sm"
                      position="absolute"
                      top="50px"
                      left="105px"
                    />
                  </div>
                </div>
              </Tooltip>
            </div>
          ) : file.file_type === 'video/webm' || file.file_type === 'audio/mp3' ? (
            <div style={{ maxWidth: '350px' }}>
              <ReactPlayer
                url={file.download_url}
                controls
                width="100%"
                height='100px'
              />
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5px',
                maxWidth: 'auto',
                backgroundColor: '#ed93e4',
                borderRadius: '8px',
              }}
            >
              {/* You can customize the file display here */}
              <span>{file.file_type}</span>
              <Tooltip label="Download file" hasArrow>
                <IconButton
                  icon={<DownloadIcon />}
                  onClick={() => {
                    // Open the file in a new window for download
                    const newWindow = window.open(file.download_url, '_blank');
                    if (!newWindow) {
                      // If the pop-up was blocked, provide a direct link for download
                      window.location.href = file.download_url;
                    }
                  }}
                  variant="ghost"
                  colorScheme="blue"
                  aria-label="Download file"
                  size="sm"
                  marginLeft={2}
                />
              </Tooltip>
            </div>
          )}
        </div>
      ))}


      {/* Modal for Preview */}
      {/* <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={closeModal} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton
          position="absolute"
          right={2}
          top={2}
          color="white"
          bg="gray.500"
          _hover={{ bg: 'gray.600' }}
        />
        <ModalBody>
          {selectedFile && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="80vh" // Adjust the height as needed
                  >
                    {selectedFile.file_type === 'image/jpeg' || selectedFile.file_type === 'image/png' ? (
                      <Zoom>
                        <img
                          src={selectedFile.download_url}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                          }}
                        />
                      </Zoom>
                    ) : (
                      // Display other file types as download link
                      <div style={{ textAlign: 'center' }}>
                        <a
                          href={selectedFile.download_url}
                          download
                          style={{ marginRight: '10px', fontSize: '18px' }}
                        >
                          Download File
                        </a>
                      </div>
                    )}
                  </Box>
                )}
              </ModalBody>
            </ModalContent>
      </Modal> */}

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton position="absolute" right={2} top={2} color="white" bg="gray.500" _hover={{ bg: "gray.600" }} />
        <ModalBody>
          {selectedFile && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="80vh" // Adjust the height as needed
            >
              {isVideoFile ? (
                <video controls style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "8px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)" }}>
                  <source src={selectedFile.download_url} type={selectedFile.file_type} />
                  Your browser does not support the video tag.
                </video>
              ) : selectedFile.file_type === "image/jpeg" || selectedFile.file_type === "image/png" ? (
                <Zoom>
                  <img
                    src={selectedFile.download_url}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "8px",
                      boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                </Zoom>
              ) : (
                // Display other file types as download link
                <div style={{ textAlign: "center" }}>
                  <a href={selectedFile.download_url} download style={{ marginRight: "10px", fontSize: "18px" }}>
                    Download File
                  </a>
                </div>
              )}
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal> 
    </>
  );
};

export default FileListComponent;
