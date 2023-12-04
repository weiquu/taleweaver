import {
  Box,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Container,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import { useAuth } from '../../context/AuthProvider';
import { useState, useEffect } from 'react';
import PricingSection from '../../App/components/PricingSection';
import FAQDisplay from '../../App/components/FAQDisplay';

const Pricing = () => {
  return (
    <Box margin="auto" minHeight="100vh">
      <VStack mt="5rem" textAlign="left">
        <Heading as="h2" size="2xl">
          Pricing
        </Heading>
        <Text fontSize="lg" color={'gray.500'}>
          Begin customizing immersive illustrated storybooks for less than a
          dollar per book!
        </Text>
        <PricingSection />
      </VStack>
      <FAQDisplay />
    </Box>
  );
};

export default Pricing;
