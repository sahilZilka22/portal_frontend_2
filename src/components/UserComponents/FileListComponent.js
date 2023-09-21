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
} from "@chakra-ui/react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { DownloadIcon } from "@chakra-ui/icons";

const FileListComponent = ({ files }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState(null);

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
              />
              </Tooltip>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems:"center",
                justifyContent:"center",
                padding: '5px',
                maxWidth:"auto",
                backgroundColor: '#ed93e4',
                borderRadius: '8px',
              }}
            >
              {/* You can customize the file display here */}
              <span>{file.file_type}</span>
               <Tooltip label={`Download file`} hasArrow>
                    <IconButton
                      icon={<DownloadIcon />}
                      onClick={() => {
                        // Open the file in a new window for download
                        const newWindow = window.open(file.download_url, '_blank');
                        if (!newWindow) {
                          // If pop-up was blocked, provide a direct link for download
                          window.location.href = file.download_url;
                        }
                      }}
                      variant="ghost"
                      colorScheme="blue"
                      aria-label={`Download file`}
                      size="sm"
                      marginLeft={2}
                    />
               </Tooltip>
            </div>
          )}
        </div>
      ))}

      {/* Modal for Preview */}
  <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={closeModal} size="xl">
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
                      Download Image
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
