import {
  Container,
  Heading,
  HStack,
  Text,
  Button,
  Modal,
  Stack,
  VStack,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Center,
  IconButton,
  Skeleton,
  Box,
  Tooltip,
  Icon,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { BsFullscreen, BsCaretLeftFill } from 'react-icons/bs';
import React from 'react';

import FlipbookDisplay from '../../App/components/FlipbookDisplay';
import { Story } from '../../App/components/FlipbookDisplay';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { useStory } from '../../App/hooks/useStory';

const StoryPage = () => {
  const { user, session } = useAuth();
  const storageUrl = import.meta.env.VITE_STORAGE_URL;

  const [story, setStory] = useState<Story>();
  const [error, setError] = useState<string>();
  const { id } = useParams();
  const storyId = parseInt(id!);

  const [isModalOpen, setIsModalOpen] = useState(false); // To toggle the modal

  let navigate = useNavigate();

  const { data: storyData, refetch: refetchStory } = useStory(
    session,
    storyId,
    setStory,
    setError,
  );

  useEffect(() => {
    if (!storyData) {
      refetchStory();
    } else {
      setStory(storyData);
    }
  }, []);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Container mt="4rem" textAlign="center" maxW={'4xl'} py={12}>
        <Box textAlign="left">
          <Button fontWeight="400" variant="link" onClick={() => navigate(-1)}>
            <BsCaretLeftFill /> Stories
          </Button>
        </Box>
        <Heading as="h1" p="1rem" size="2xl">
          {story ? (
            story.title
          ) : error ? (
            error
          ) : (
            <VStack spacing={10}>
              <Skeleton width="100%" height="40px" />
              <Skeleton width="100%" height="400px" />
            </VStack>
          )}
        </Heading>
        <Stack direction={{ base: 'column', md: 'row' }} alignItems="top">
          <FlipbookDisplay selectedStory={story} />
          {story && (
            <Tooltip
              hasArrow
              placement="right"
              label="View Fullscreen"
              bgColor="brand.orange80"
            >
              <>
                <IconButton
                  size="md"
                  variant="ghost"
                  color="current"
                  marginLeft="2"
                  onClick={openModal}
                  icon={<BsFullscreen />}
                  aria-label={`Switch to fullscreen mode`}
                />
                <Text
                  fontSize="sm"
                  display={{ base: 'inline-block', md: 'none' }}
                >
                  View Fullscreen
                </Text>
              </>
            </Tooltip>
          )}
        </Stack>
      </Container>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        size={'full'}
        scrollBehavior={'inside'}
      >
        <ModalContent
          bg="rgba(0, 0, 0, 0.9)"
          backdropFilter="contrast(98%) blur(5px)"
        >
          <ModalHeader textAlign="center" color="white" fontWeight="400">
            {story?.title}
          </ModalHeader>
          <ModalCloseButton size="lg" color="white" />
          <ModalBody overflowX="hidden" overflowY="scroll">
            <style>
              {`
                /* Hide the scrollbar track and thumb */
                ::-webkit-scrollbar {
                  width: 0.5rem; /* Adjust the width as needed */
                }
                ::-webkit-scrollbar-track {
                  background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                  background: transparent;
                }

                /* Hide the scrollbar in Firefox */
                scrollbar-width: none;
              `}
            </style>
            <Center>
              <Container textAlign="center" maxW={'6xl'} py={12}>
                <FlipbookDisplay selectedStory={story} />
              </Container>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default StoryPage;
