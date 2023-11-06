import {
  createIcon,
  Button,
  CloseButton,
  Divider,
  Flex,
  Heading,
  Image,
  Input,
  ScaleFade,
  Text,
  Box,
  Icon,
  useDisclosure,
  VStack,
  StackDivider,
  Link,
  Container,
} from '@chakra-ui/react';
import { useState } from 'react';
import trackExample from '/src/images/banner1-upscaled.png';
import gradientDivider from '/src/images/GradientDivider.svg';
import taleweaverIcon from '/src/images/taleweaver_icon_svg.svg';
import waves from '/src/images/waves.svg';
import heroBackground from '/src/images/banner1-upscaled.png';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
import { supabase } from '../../App/components/supabaseClient';
import SimpleThreeColumns from '../../App/components/SimpleThreeColumns';
import SplitWithImage from '../../App/components/SplitWithImage';
import SplitWithMessage from '../../App/components/SplitWithMessage';
import SplineScene from '../../App/components/SplineScene';
import PricingSection from '../../App/components/PricingSection';
import FlipbookDisplay from '../../App/components/FlipbookDisplay';
import './styles.css';

const Home = () => {
  const exampleStory = {
    title: "Holly's Flying Adventure",
    moral: 'Gratitude',
    genre: 'Poetry',
    vocabulary_age: '3',
    score: '0',
    total_pages: 4,
    story: [
      {
        page: 1,
        text: 'Holly watched birds soar high, wished she could fly too.',
        image_prompt:
          'A 5-year-old girl with pigtails, fair skin, and brown hair, a 5-year-old girl with pigtails, flapping her arms on a grassy hill with birds flying in the sky.',
        subject_description:
          '{"Holly": "A 5-year-old girl with pigtails, fair skin, and brown hair."}',
        image_url:
          'https://svnatoofwyqiyenodtsq.supabase.co/storage/v1/object/public/images/248/1.png',
      },
      {
        page: 2,
        text: 'A kind bird named Blue, offered Holly his feathered wings.',
        image_prompt:
          'A 5-year-old girl with pigtails, fair skin, and brown hair, with A blue bird with a friendly smile, a blue bird, helping her wear feathered wings on a tree branch.',
        subject_description:
          '{"Holly": "A 5-year-old girl with pigtails, fair skin, and brown hair.", "Blue": "A blue bird with a friendly smile."}',
        image_url:
          'https://svnatoofwyqiyenodtsq.supabase.co/storage/v1/object/public/images/248/2.png',
      },
      {
        page: 3,
        text: "Together they soared high, Holly's heart filled with joy.",
        image_prompt:
          'A 5-year-old girl with pigtails, fair skin, and brown hair and A blue bird with a friendly smile soaring through fluffy clouds in a vibrant blue sky.',
        subject_description:
          '{"Holly": "A 5-year-old girl with pigtails, fair skin, and brown hair.", "Blue": "A blue bird with a friendly smile."}',
        image_url:
          'https://svnatoofwyqiyenodtsq.supabase.co/storage/v1/object/public/images/248/3.png',
      },
      {
        page: 4,
        text: 'Grateful for the birds, Holly thanked them with a smile.',
        image_prompt:
          'A 5-year-old girl with pigtails, fair skin, and brown hair surrounded by a flock of colorful birds, all smiling happily.',
        subject_description:
          '{"Holly": "A 5-year-old girl with pigtails, fair skin, and brown hair."}',
        image_url:
          'https://svnatoofwyqiyenodtsq.supabase.co/storage/v1/object/public/images/248/4.png',
      },
    ],
  };
  const navigate = useNavigate();

  const navigateToCreate = () => {
    // 👇️ navigate to /contacts
    navigate('/create');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleScrollToTop = () => {
    scrollToTop();
  };

  return (
    <Flex
      gap={2}
      direction="column"
      alignItems="center"
      justifyContent="center"
      m="0rem"
      minHeight="80vh"
    >
      <Image
        src={heroBackground}
        position="absolute"
        width="min(1920px, 100%)"
        objectFit="cover"
        minHeight="100vh"
        top="0"
        margin="auto"
        zIndex={-1}
      />
      <VStack
        spacing="5"
        alignItems={{ base: 'center' }}
        textAlign="center"
        position="relative"
      >
        {/* <SplineScene /> */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 50 }}
          viewport={{ once: true }}
          transition={{ ease: 'easeOut', duration: 1, delay: 1 }}
        >
          <VStack
            mt="3rem"
            minHeight="60vh"
            pt={{ base: '1rem', lg: '4rem' }}
            spacing="10"
            width={{ base: '100vw', sm: '60vw', md: '45vw' }}
            position="relative"
          >
            <Heading
              py="2rem"
              color="white"
              as="h1"
              size="3xl"
              textShadow="2px 2px 30px rgba(6, 20, 48, 0.7)"
            >
              Personalised, educational storybooks for your kid.
            </Heading>

            <Text
              color="white"
              fontSize="lg"
              fontStyle="normal"
              textShadow="2px 2px 10px rgba(6, 20, 48, 0.7)"
            >
              Are you a time-strapped working parent struggling to find quality
              storytime for your child? Say goodbye to the frustration of
              repetitive bedtime tales and the endless quest for the right book.
              Start weaving your tales today.
            </Text>
            <Button variant="styled" onClick={navigateToCreate}>
              Create Story
            </Button>
          </VStack>
        </motion.div>
        <VStack spacing={-1}>
          <Image
            src={waves}
            width="100vw"
            sx={{
              bottom: 0,
              left: 0,
              overflow: 'hidden',
              lineHeight: 0,
              transform: 'rotate(180deg)',
            }}
          />{' '}
          <Box pt="3rem" bgColor="white" width="100vw">
            <Text textAlign="center" fontSize="4xl" fontWeight="600" p="1rem">
              Turn <span className="highlighted-text">imagination</span> into
              reality.
            </Text>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                type: 'spring',
                stiffness: 80,
                duration: 0.5,
                delay: 0.5,
              }}
            >
              <Text
                fontSize="2xl"
                fontFamily="caveat"
                my="1rem"
                fontStyle="normal"
              >
                Generate a story about a girl who wants to fly.
              </Text>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ease: 'easeOut', duration: 1, delay: 1 }}
            >
              <Container bgColor="white" height="2xl" maxWidth="4xl" mb="1rem">
                <FlipbookDisplay selectedStory={exampleStory} />
              </Container>
            </motion.div>
          </Box>
          <Text
            maxWidth="1080px"
            textAlign="center"
            fontSize="4xl"
            fontWeight="600"
            p="1rem"
          >
            Discover your child's imaginative potential through{' '}
            <span className="highlighted-text">
              customized storytelling journeys
            </span>
            .
          </Text>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 50 }}
            viewport={{ once: true }}
            transition={{ ease: 'easeOut', duration: 1, delay: 1 }}
          >
            <SimpleThreeColumns />
          </motion.div>
        </VStack>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 50 }}
          viewport={{ once: true }}
          transition={{ ease: 'easeOut', duration: 1, delay: 1 }}
        >
          <SplitWithImage pt="5rem" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 50 }}
          viewport={{ once: true }}
          transition={{ ease: 'easeOut', duration: 1, delay: 1 }}
        >
          <SplitWithMessage pt="5rem" />{' '}
        </motion.div>
        <PricingSection />
        <VStack
          spacing="5"
          width={{ base: '100vw', sm: '60vw', md: '30vw' }}
          px={{ base: '1rem', md: '0rem' }}
          alignItems={{ base: 'center' }}
          my="3rem"
          textAlign="center"
        >
          <Image alt="TaleWeaver icon" src={taleweaverIcon} height="50px" />
          <Text textAlign="center" fontSize="2xl" fontWeight="600">
            We're still in BETA!
          </Text>
          <Text textAlign="center" fontSize="md">
            We're as excited as you to weave the best tales for your kids, and
            we strongly believe in its transformative power to become a healthy
            alternative to mindless screentime. Try it today and leave some
            feedback for us to improve!
          </Text>

          <Button variant="styled" onClick={navigateToCreate}>
            Create Story
          </Button>
          <Box>
            <Icon
              as={Arrow}
              color={'gray.800'}
              w={81}
              position={'relative'}
              right={-110}
              top={'-30px'}
            />
            <Text
              fontSize={'lg'}
              fontFamily={'Caveat'}
              position={'relative'}
              right={'-150px'}
              top={'-75px'}
              transform={'rotate(10deg)'}
            >
              Try it for free!
            </Text>
          </Box>
        </VStack>
      </VStack>
    </Flex>
  );
};

const Arrow = createIcon({
  displayName: 'Arrow',
  viewBox: '0 0 72 24',
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.600904 7.08166C0.764293 6.8879 1.01492 6.79004 1.26654 6.82177C2.83216 7.01918 5.20326 7.24581 7.54543 7.23964C9.92491 7.23338 12.1351 6.98464 13.4704 6.32142C13.84 6.13785 14.2885 6.28805 14.4722 6.65692C14.6559 7.02578 14.5052 7.47362 14.1356 7.6572C12.4625 8.48822 9.94063 8.72541 7.54852 8.7317C5.67514 8.73663 3.79547 8.5985 2.29921 8.44247C2.80955 9.59638 3.50943 10.6396 4.24665 11.7384C4.39435 11.9585 4.54354 12.1809 4.69301 12.4068C5.79543 14.0733 6.88128 15.8995 7.1179 18.2636C7.15893 18.6735 6.85928 19.0393 6.4486 19.0805C6.03792 19.1217 5.67174 18.8227 5.6307 18.4128C5.43271 16.4346 4.52957 14.868 3.4457 13.2296C3.3058 13.0181 3.16221 12.8046 3.01684 12.5885C2.05899 11.1646 1.02372 9.62564 0.457909 7.78069C0.383671 7.53862 0.437515 7.27541 0.600904 7.08166ZM5.52039 10.2248C5.77662 9.90161 6.24663 9.84687 6.57018 10.1025C16.4834 17.9344 29.9158 22.4064 42.0781 21.4773C54.1988 20.5514 65.0339 14.2748 69.9746 0.584299C70.1145 0.196597 70.5427 -0.0046455 70.931 0.134813C71.3193 0.274276 71.5206 0.70162 71.3807 1.08932C66.2105 15.4159 54.8056 22.0014 42.1913 22.965C29.6185 23.9254 15.8207 19.3142 5.64226 11.2727C5.31871 11.0171 5.26415 10.5479 5.52039 10.2248Z"
      fill="currentColor"
    />
  ),
});

export default Home;
