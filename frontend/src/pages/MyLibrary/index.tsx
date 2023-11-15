import {
  Button,
  Box,
  Center,
  Divider,
  Tag,
  Container,
  Text,
  Modal,
  Heading,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  HStack,
  Image,
  VStack,
  SimpleGrid,
  Stack,
  Icon,
  Skeleton,
  Spinner,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  ModalFooter,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AiFillHeart } from 'react-icons/ai';

import { useAuth } from '../../context/AuthProvider';
import { Story } from '../../App/components/FlipbookDisplay';
import StoryCard from '../../App/components/StoryCard';
import {
  useSuccessfulUserStories,
  useUnsuccessfulUserStories,
} from '../../App/hooks/useUserStories';
import UnsuccessfulStoryCard from '../../App/components/UnsuccessfulStoryCard';
import { useCurrentlyGeneratingStories } from '../../context/CurrentlyGeneratingStoriesProvider';

const MyLibrary = () => {
  const { user } = useAuth();
  const storageUrl = import.meta.env.VITE_STORAGE_URL;

  const [successfulUserStories, setSuccessfulUserStories] = useState<Story[]>([]);
  const [unsuccessfulUserStories, setUnsuccessfulUserStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story>(); // To store the selected story for viewing in the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // To toggle the modal
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<Number[]>([]);
  const [isImageLoaded, setIsImageLoaded] = useState<Number[]>([]);
  const [storyBeingLoaded, setStoryBeingLoaded] = useState(-1);

  const {
    data: successfulUserStoriesData,
    isLoading: isSuccessfulUserStoriesLoading,
    error: successfulUserStoriesError,
    refetch: refetchSuccessfulUserStories,
  } = useSuccessfulUserStories(user, setSuccessfulUserStories);

  const {
    data: unsuccessfulUserStoriesData,
    isLoading: isUnsuccessfulUserStoriesLoading,
    error: unsuccessfulUserStoriesError,
    refetch: refetchUnsuccessfulUserStories,
  } = useUnsuccessfulUserStories(user, setUnsuccessfulUserStories);

  const { currentlyGeneratingStoriesSubjectSingleton } = useCurrentlyGeneratingStories();

  const onCurrentlyGeneratingStoriesChange: CurrentlyGeneratingStoriesObserver = (stories: string[]) => {
    refetchAll();
  }

  function refetchAll() {
    console.log('refreshing');
    refetchSuccessfulUserStories();
    refetchUnsuccessfulUserStories();
  }

  useEffect(() => {
    currentlyGeneratingStoriesSubjectSingleton.subscribe(onCurrentlyGeneratingStoriesChange);

    if (!successfulUserStoriesData) {
      refetchSuccessfulUserStories();
    } else {
      setSuccessfulUserStories(successfulUserStoriesData);
      setIsLoading(false);
    }

    if (!unsuccessfulUserStoriesData) {
      refetchUnsuccessfulUserStories();
    } else {
      setUnsuccessfulUserStories(unsuccessfulUserStoriesData);
      setIsLoading(false);
    }

    // Unsubscribe the observer when the component unmounts
    return () => currentlyGeneratingStoriesSubjectSingleton.unsubscribe(onCurrentlyGeneratingStoriesChange);
  }, []);

  const onLoad = (storyId: number) => {
    setIsImageLoaded((prevImages) => [...prevImages, storyId]);
  };

  const handleDeleteStory = async (storyId: number) => {
    setIsDeleting((prevDeletings) => [...prevDeletings, storyId]);
    try {
      const response = await fetch(`${storageUrl}/${storyId}/delete-story`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.log('Network response was not ok');
        return;
      }
      // Update the successfulUserStories state to reflect the change in public status
      setSuccessfulUserStories((prevStories) =>
        prevStories.filter((story) => story.storyid !== storyId),
      );
    } catch (error) {
      console.error('Error deleting story:', error);
    } finally {
      setIsDeleting((prevDeletings) =>
        prevDeletings.filter((id) => id !== storyId),
      );
    }
  };

  const handleDeleteUnsuccessfulStory = async (storyId: number) => {
    setIsDeleting((prevDeletings) => [...prevDeletings, storyId]);
    try {
      const response = await fetch(`${storageUrl}/${storyId}/delete-story`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.log('Network response was not ok');
        return;
      }
      // Update the successfulUserStories state to reflect the change in public status
      setUnsuccessfulUserStories((prevStories) =>
        prevStories.filter((story) => story.storyid !== storyId),
      );
    } catch (error) {
      console.error('Error deleting story:', error);
    } finally {
      setIsDeleting((prevDeletings) =>
        prevDeletings.filter((id) => id !== storyId),
      );
    }
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleShareButtonClick = async (storyId: number) => {
    try {
      const response = await fetch(`${storageUrl}/${storyId}/set-to-public`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.log('Network response was not ok');
        return;
      }
      // Update the successfulUserStories state to reflect the change in private status
      setSuccessfulUserStories((prevStories) =>
        prevStories.map((story) =>
          story.storyid === storyId ? { ...story, ispublic: true } : story,
        ),
      );
    } catch (error) {
      console.error('Error setting to public:', error);
    }
  };

  const handleUnshareButtonClick = async (storyId: number) => {
    try {
      const response = await fetch(`${storageUrl}/${storyId}/set-to-private`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.log('Network response was not ok');
        return;
      }
      // Update the successfulUserStories state to reflect the change in public status
      setSuccessfulUserStories((prevStories) =>
        prevStories.map((story) =>
          story.storyid === storyId ? { ...story, ispublic: false } : story,
        ),
      );
    } catch (error) {
      console.error('Error setting to private:', error);
    }
  };

  // Filter stories based on the search query
  const filteredStories = successfulUserStories.filter((story) =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!successfulUserStoriesData) {
      refetchSuccessfulUserStories();
    } else {
      setSuccessfulUserStories(successfulUserStoriesData);
    }

    if (!unsuccessfulUserStoriesData) {
      refetchUnsuccessfulUserStories();
    } else {
      setUnsuccessfulUserStories(unsuccessfulUserStoriesData);
    }
  }, []);

  return (
    <Box
      textAlign="center"
      justifyContent="center"
      margin="auto"
      maxWidth="5xl"
      minHeight="100vh"
    >
      <Heading mt="4rem" as="h1" py="1rem">
        My Library
      </Heading>
      <Tabs align="center" colorScheme='orange' isFitted>
        <TabList>
          <Tab>Generated Stories</Tab>
          <Tab>Unsuccessful Stories</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box p="1rem">
              <Input
                maxWidth="500px"
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Box>
            {isSuccessfulUserStoriesLoading ? (
              <Stack spacing={5} mt="2rem">
                <Skeleton height="60px" />
                <Skeleton height="60px" />
                <Skeleton height="60px" />
                <Skeleton height="60px" />
              </Stack>
            ) : filteredStories.length === 0 ? (
              <Text>No stories available.</Text>
            ) : (
              <SimpleGrid minChildWidth="240px">
                {filteredStories.map((story, index) => (
                  <VStack position="relative" key={index} spacing={0}>
                    <StoryCard
                      key={story.storyid}
                      story={story}
                      handleViewStoryClick={() =>
                        navigate(`/story/${story.storyid}`)
                      }
                      isLoadingImage={isImageLoaded.includes(story.storyid)}
                      storyBeingLoaded={storyBeingLoaded}
                    />
                    {story.ispublic && (
                      <Box
                        bgColor="rgba(255,255,255,1)"
                        borderRadius="5px"
                        borderColor="gray.200"
                        borderStyle="solid"
                        borderWidth="1px"
                        px="3px"
                        position="absolute"
                        top="8px"
                        right="8px"
                      >
                        <HStack zIndex={1} color="gray">
                          <Icon as={AiFillHeart} color="red" />
                          <Text fontSize="sm">{story.score}</Text>
                        </HStack>
                      </Box>
                    )}
                    <HStack>
                      {story.ispublic ? (
                        <Button
                          _hover={{
                            textDecoration: 'none',
                            color: 'gray.800',
                          }}
                          mx="1rem"
                          fontSize={'sm'}
                          fontWeight={400}
                          variant={'link'}
                          onClick={() =>
                            handleUnshareButtonClick(story.storyid)
                          }
                        >
                          Unpublish
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => handleShareButtonClick(story.storyid)}
                          fontWeight="400"
                          size="sm"
                          px="1.5rem"
                        >
                          Publish
                        </Button>
                      )}
                      <Button
                        variant="solid"
                        colorScheme="red"
                        onClick={() => handleDeleteStory(story.storyid)}
                        fontWeight="400"
                        size="sm"
                      >
                        {isDeleting.filter((id) => id === story.storyid)
                          .length === 0 && <Text>Delete</Text>}
                        {isDeleting.filter((id) => id === story.storyid)
                          .length > 0 && <Text>Deleting...</Text>}
                      </Button>
                    </HStack>
                  </VStack>
                ))}
                {/* <Image src={story['story'][0].image_url} /> */}
                {/* <VStack flexDirection="row" justifyContent="left">
                <Image
                  borderRadius="1rem"
                  width="120px"
                  height="120px"
                  objectFit="cover"
                  src={story.coverurl}
                  alt={`Cover image for ${story.title}`}
                  onLoad={() => onLoad(story.storyid)}
                  style={{
                    display: isImageLoaded.includes(story.storyid)
                      ? 'block'
                      : 'none',
                  }}
                />
                {!isImageLoaded.includes(story.storyid) && (
                  <Skeleton height="100px" width="100px" />
                )}
                <HStack flexDirection="column">
                  <VStack
                    flexDirection="row"
                    justifyContent="space-between"
                    w="100%"
                  >
                    <Text fontWeight="bold">
                      {index + 1}. {story.title}
                    </Text>
                  </VStack>

                  <VStack flexDirection="row" justifyContent="left" w="100%">
                    <Tag m="3px" size={'sm'} variant="solid" colorScheme="teal">
                      {story.moral}
                    </Tag>
                    <Tag
                      m="3px"
                      size={'sm'}
                      variant="solid"
                      colorScheme="orange"
                    >
                      {story.genre}
                    </Tag>
                  </VStack>

                  <VStack
                    flexDirection="row"
                    justifyContent="space-between"
                    pt="1rem"
                  >
                    <Box flexGrow={1}>
                      <Button
                        variant="styled"
                        onClick={() => handleViewStoryClick(story.storyid)}
                      >
                        {storyBeingLoaded === story.storyid && (
                          <Spinner mr="3px" />
                        )}
                        View Story
                      </Button>
                    </Box>
                    {!story.ispublic && (
                      <Button
                        variant="outline"
                        onClick={() => handleShareButtonClick(story.storyid)}
                        fontWeight="400"
                        size="sm"
                        px="1.5rem"
                      >
                        Publish
                      </Button>
                    )}
                    {story.ispublic && (
                      <Button
                        _hover={{
                          textDecoration: 'none',
                          color: 'gray.800',
                        }}
                        mx="1rem"
                        fontSize={'sm'}
                        fontWeight={400}
                        variant={'link'}
                        onClick={() => handleUnshareButtonClick(story.storyid)}
                      >
                        Unpublish
                      </Button>
                    )}
                    <Button
                      variant="solid"
                      colorScheme="red"
                      onClick={() => handleDeleteStory(story.storyid)}
                      fontWeight="400"
                      size="sm"
                    >
                      {isDeleting.filter((id) => id === story.storyid)
                        .length === 0 && <Text>Delete</Text>}
                      {isDeleting.filter((id) => id === story.storyid).length >
                        0 && <Text>Deleting...</Text>}
                    </Button>
                  </VStack>
                </HStack>
              </VStack> */}
              </SimpleGrid>
            )}
          </TabPanel>
          <TabPanel>
            <Text paddingBottom={'20px'}>
              These stories were not successfully generated. Make some changes
              and try again!
            </Text>
            <Center>
              <VStack>
                {unsuccessfulUserStories.map((story, index) => (
                  <VStack key={index} w={'90%'}>
                    <UnsuccessfulStoryCard
                      key={story.storyid}
                      story={story}
                      handleViewStoryClick={() =>
                        navigate(`/create/${story.storyid}`)
                      }
                      storyBeingLoaded={storyBeingLoaded}
                      handleDeleteStory={handleDeleteUnsuccessfulStory}
                      isDeleting={isDeleting}
                    />
                  </VStack>
                ))}
              </VStack>
            </Center>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MyLibrary;
