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
  VStack,
  HStack,
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';

const NoCreditsModal = ({ isOpen, onClose, isPremium }) => {
  const navigate = useNavigate();

  const navigateToPricing = () => {
    // 👇️ navigate to /contacts
    navigate('/pricing');
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Oops, you must be really enjoying TaleWeaver!
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isPremium ? (
              <VStack>
                <Text>You do not have enough credits to create a story.</Text>
                <Text>You can purchase more credits here:</Text>
                <Button
                  as="a"
                  target="_blank"
                  href="https://billing.stripe.com/p/login/7sIeWf3yh16221adQQ" // TODO: some link to purchase credits
                  variant="styled"
                  my="2rem"
                >
                  Upgrade Subscription
                </Button>
              </VStack>
            ) : (
              <VStack>
                <Text>You do not have enough credits to purchase a story.</Text>
                <Text>
                  You can subscribe to TaleWeaver or upgrade your existing
                  subscription:
                </Text>
                <HStack pt="2rem">
                  <Button
                    as="a"
                    target="_blank"
                    onClick={() => {
                      navigateToPricing();
                    }}
                    variant="styled-color"
                  >
                    View Pricing
                  </Button>
                  <Button
                    as="a"
                    target="_blank"
                    href="https://billing.stripe.com/p/login/7sIeWf3yh16221adQQ"
                    variant="styled"
                  >
                    Manage Subscription
                  </Button>
                </HStack>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NoCreditsModal;
