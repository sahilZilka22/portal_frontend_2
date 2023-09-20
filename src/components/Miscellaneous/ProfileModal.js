import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useDisclosure,
  Image,Text,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'

const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
    {children? (<span onClick={onOpen}>{children}</span>):(<IconButton display={{base : 'flex'}} icon={<ViewIcon/>} onClick={onOpen}> </IconButton>) }

    <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
                fontSize="40px"
                fontFamily="Work sans"
                d="flex"
                justifyContent="center">

                {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
             boxSize='150px'
             objectFit='cover'
             src='https://bit.ly/dan-abramov'
             alt='Dan Abramov'
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal