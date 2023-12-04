const faqData = [
  {
    question: 'Why are my stories not being generated?',
    answer:
      "In order to ensure the safety of our stories, we have imposed stricter than usual safety guardrails so that there won't be misuse of our app. If you feel that your topic is appropriate but is not getting generated, send us an email at taleweaverapp@gmail.com so we can improve our system! In the meantime, try generating a story about a different topic!",
  },
  {
    question: 'How do I feature my child in the stories?',
    answer:
      "While creating your story, first create an avatar using our detailed customizer that matches your child's descriptions. Then, select your avatar when creating your story. In your final story, you can see your child become the main hero/heroine!",
  },
  {
    question: 'Do credits expire after each month?',
    answer:
      "No, credits rollover to the next month, meaning that you are getting your full money's worth for each monthly subscription, and you can always weave more of your favourite stories depending on your schedule!",
  },
  {
    question: 'Where and how do I cancel my subscription?',
    answer:
      'You can cancel your subscription anytime by visiting your Profile > Manage Subscription page. Your subscription will remain active until the end of your current subscription period and will not be renewed after it ends.',
  },
  {
    question: 'Do you offer discounts?',
    answer:
      'TaleWeaver offers seasonal discounts! Additionally, we host special giveaways on Instagram and Facebook where you can stand a chance to win large discounts and free membership by participating!',
  },
  {
    question: 'What happens to my credits after I cancel my subscription?',
    answer:
      "After your subscription is cancelled, you will keep all your existing credits, but you will no longer be able to access TaleWeaver's premium features after your subscription period ends.",
  },
];

import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Heading,
  Text,
  Container,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const FAQDisplay = () => {
  return (
    <Container maxWidth="4xl" my="2rem">
      <Heading as="h2" size="2xl" my="2rem">
        FAQ
      </Heading>
      <Accordion allowMultiple width="100%" maxW="4xl" rounded="lg">
        {faqData.map((faq, index) => (
          <AccordionItem key={index}>
            <AccordionButton
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={4}
            >
              <Text fontWeight={600} fontSize="md">
                {faq.question}
              </Text>
              <ChevronDownIcon fontSize="24px" />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text textAlign="left" color="gray.600">
                {faq.answer}
              </Text>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Container>
  );
};

export default FAQDisplay;
