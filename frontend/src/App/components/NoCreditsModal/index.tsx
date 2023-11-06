import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack
} from '@chakra-ui/react'

const NoCreditsModal = ({ isOpen, onClose, isPremium }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Not Enough Credits</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {
              isPremium
              ? 
              <VStack>
                <Text>You do not have enough credits to purchase a story.</Text>
                <Text>You can purchase more credits here:</Text>
                <Button
                  as="a"
                  target="_blank"
                  href="https://www.taleweaver.net" // TODO: some link to purchase credits
                  variant="styled"
                  my="2rem"
                >
                  Get More Credits 
                </Button>
              </VStack>
              : 
              <VStack>
                <Text>You do not have enough credits to purchase a story.</Text>
                <Text>You can either purchase more credits or update your subscription:</Text>
                <Button
                  as="a"
                  target="_blank"
                  href="https://www.taleweaver.net" // TODO: some link to purchase credits
                  variant="styled"
                  my="2rem"
                >
                  Get More Credits 
                </Button>
                <Button
                  as="a"
                  target="_blank"
                  href="https://billing.stripe.com/p/login/7sIeWf3yh16221adQQ"
                  variant="styled"
                  my="2rem"
                >
                  Manage Subscription
                </Button>
              </VStack>
            }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
};

export default NoCreditsModal;
