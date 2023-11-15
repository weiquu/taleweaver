import {
  Button,
  Box,
  Heading,
  VStack,
  Text,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
  Stat,
  StatLabel,
  StatHelpText,
  StatNumber,
  Skeleton,
} from '@chakra-ui/react';
import { useAuth } from '../../context/AuthProvider';
import { useState, useEffect } from 'react';
import AvatarsGrid from '../../App/components/AvatarsGrid';
import { useSubscription } from '../../context/SubscriptionProvider';
import SubscriptionDisplay from '../../App/components/SubscriptionDisplay';
import { useCredits } from '../../context/CreditProvider';

const Profile = () => {
  const { subscription } = useSubscription();
  const { credits } = useCredits();

  return (
    <Box
      textAlign="center"
      justifyContent="center"
      margin="auto"
      maxWidth="5xl"
      minHeight="100vh"
    >
      <VStack mt="5rem">
        <Heading as="h2" size="2xl" mb={4}>
          My Profile
        </Heading>
        <VStack px="2rem" alignItems={'flex-start'}>
          <Heading as="h2" size="xl" mb={4}>
            Edit/Cancel Subscription
          </Heading>
          <Text>Your current subscription status: </Text>
          {subscription ? (
            <SubscriptionDisplay fontSize="1em" px="10px" mb="2rem" />
          ) : (
            <Skeleton height="30px" width="150px" />
          )}

          <Stat>
            <StatLabel>Stories Remaining</StatLabel>
            <StatNumber>{credits}</StatNumber>
          </Stat>

          <Button
            as="a"
            target="_blank"
            href="https://billing.stripe.com/p/login/7sIeWf3yh16221adQQ"
            variant="styled"
          >
            Manage Subscription
          </Button>
        </VStack>

        <Text fontSize="sm" color="gray.400" pt="2rem">
          Subscription issues or any queries? Email us at
          taleweaverapp@gmail.com!
        </Text>

        <Divider py="2rem" />
        <Heading as="h2" size="xl" mb={4}>
          Avatars
        </Heading>
        <AvatarsGrid editable variant="profile" />
      </VStack>
    </Box>
  );
};

export default Profile;
