import {
  Box,
  VStack,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

import { useAuth } from '../../context/AuthProvider';
import { useState, useEffect } from 'react';

const PrivacyPolicy = () => {
  return (
    <Box margin="auto" maxWidth="5xl" minHeight="100vh">
      <VStack mt="5rem" textAlign="left">
        <Text fontSize="sm" color="gray.400" pt="2rem">
          Last Updated: 19/10/2023
        </Text>
        <Heading as="h2" size="2xl" mb={4}>
          Privacy Policy
        </Heading>
        <Text p="1rem">
          Welcome to TaleWeaver! We are committed to protecting your privacy and
          ensuring the security of your personal information. This Privacy
          Policy explains how we collect, use, and disclose your information
          when you use our app. By accessing or using TaleWeaver, you agree to
          the terms of this Privacy Policy.
        </Text>
        <Accordion
          defaultIndex={[0, 1, 2, 3, 4, 5, 6, 7]}
          allowMultiple
          width="full"
          py="3rem"
        >
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Information We Collect
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text mb={2}>
                <strong>Personal Information:</strong> When you use TaleWeaver,
                we collect the name of the main character, story outline, age of
                the child, and values you wish to teach children. We also
                collect information about the avatar, including physical
                descriptions, to create personalized storybook images.
              </Text>
              <Text>
                <strong>Usage Information:</strong> We collect information about
                how you use TaleWeaver, such as the features you access, the
                content you view, and the actions you take.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                How We Use Your Information
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text mb={2}>
                <strong>Personalized Storybooks:</strong> We use the information
                you provide to generate personalized children's storybooks
                tailored to your specifications.
              </Text>
              <Text mb={2}>
                <strong>Improve User Experience:</strong> We analyze usage
                patterns to enhance our app, making it more intuitive and
                enjoyable for our users.
              </Text>
              <Text mb={2}>
                <strong>Communication:</strong> We may use your contact
                information to send you updates, newsletters, or promotional
                materials related to TaleWeaver. You can opt-out of these
                communications at any time.
              </Text>
              <Text mb={2}>
                <strong>Research and Development:</strong> We may use anonymized
                and aggregated data for research and development purposes to
                improve our services and create new features.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Information Sharing
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text mb={2}>
                We do not sell, trade, or rent your personal information to
                third parties. However, we may share anonymized and aggregated
                data for marketing, advertising, research, or other purposes.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Data Security
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text mb={2}>
                We employ industry-standard security measures to protect your
                information from unauthorized access, alteration, disclosure, or
                destruction.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Children’s Privacy
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text mb={2}>
                TaleWeaver is intended for users of all ages, including
                children. We do not knowingly collect personal information from
                children under the age of 13 without parental consent. If we
                learn that we have collected personal information from a child
                under 13 without parental consent, we will promptly delete that
                information.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Google Login
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text mb={2}>
                TaleWeaver offers the option to log in using your Google
                account. By using this feature, you agree to Google's Privacy
                Policy and Terms of Service.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Changes to this Privacy Policy
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text mb={2}>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. We encourage you to review this Privacy
                Policy periodically. This product is in alpha development.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Contact Us
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text mb={2}>
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or the privacy practices of TaleWeaver, please
                contact us at taleweaverapp@gmail.com.
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Box>
  );
};

export default PrivacyPolicy;
