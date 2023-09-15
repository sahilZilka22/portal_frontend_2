import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Image,
  Text,
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
import { DownloadIcon } from "@chakra-ui/icons";

const FileListComponent = ({ files }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState(null);
  console.log(files);

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
      <VStack spacing={4} align="flex-start">
        {files.map((file, index) => (
          <Box key={index} color="blue.300">
            {file.file_type === "image/jpeg" || file.file_type === "image/png" ? (
              <Tooltip label="Click to preview" hasArrow>
                <Image
                  src={file.download_url}
                  alt="Image"
                  boxSize="150px"
                  cursor="pointer"
                  maxH="400px"
                  maxW="100%"
                  onClick={() => openModal(file)}
                  objectFit="contain"
                />
              </Tooltip>
            ) : (
              // Display other file types with an icon to download
              <Tooltip label="Click to download" hasArrow>
                <IconButton
                  icon={<DownloadIcon />}
                  onClick={() => window.open(file.download_url)}
                  variant="outline"
                  size="lg"
                  isRound
                  colorScheme="blue"
                />
              </Tooltip>
            )}
          </Box>
        ))}
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={closeModal} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              {selectedFile && (
                <Box>
                  {selectedFile.file_type === "image/jpeg" || selectedFile.file_type === "image/png" ? (
                    <Image src={selectedFile.download_url} 
                    alt="Image"
                    boxSize="auto"
                    maxH="400px"
                    maxW="100%"
                    cursor="pointer"
                    objectFit="contain"/>
                  ) : (
                    // Display other file types as download link
                    <a href={selectedFile.download_url} download>
                      Download file
                    </a>
                  )}
                </Box>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </>
  );
};

export default FileListComponent;
