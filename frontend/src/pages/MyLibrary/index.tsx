import {
  Button,
  Box,
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
  ModalFooter,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { useState, useEffect } from 'react';
import { Story } from '../../App/components/FlipbookDisplay';
import StoryCard from '../../App/components/StoryCard';
import { AiFillHeart } from 'react-icons/ai';
import FlaggedStoryCard from '../../App/components/FlaggedStoryCard';
import { useCurrentlyGeneratingStories } from '../../context/CurrentlyGeneratingStoriesProvider';

const MyLibrary = () => {
  const { user } = useAuth();
  const storageUrl = import.meta.env.VITE_STORAGE_URL;

  const [userStories, setUserStories] = useState<Story[]>([]);
  const [flaggedUserStories, setFlaggedUserStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story>(); // To store the selected story for viewing in the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // To toggle the modal
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<Number[]>([]);
  const [isImageLoaded, setIsImageLoaded] = useState<Number[]>([]);
  const [storyBeingLoaded, setStoryBeingLoaded] = useState(-1);

  /*
  // WIP code to get page to auto-refresh after a new story is done generating.
  // buggy for now but no time fix :(
  const { currentlyGeneratingStories } = useCurrentlyGeneratingStories();
  const [prev, setPrev] = useState<string[]>(['hello']);

  useEffect(() => {
    if (prev.length != currentlyGeneratingStories.length) {
      console.log(prev.length, currentlyGeneratingStories.length)
      console.error('refreshing');
      updatePage();
    }
    setPrev(currentlyGeneratingStories);
  }, [prev]);
  */

  const onLoad = (storyId: number) => {
    setIsImageLoaded((prevImages) => [...prevImages, storyId]);
  };

  function updatePage() {
    getUserStories();
    getFlaggedUserStories();
  }

  const getFlaggedUserStories = async () => {
    try {
      const response = await fetch(
        `${storageUrl}/${user.id}/get-flagged-stories`,
      );
      if (!response.ok) {
        console.log('Network response was not ok');
        return;
      }
      const data = await response.json();
      setFlaggedUserStories(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching flagged user stories:', error);
    }
  };

  const getUserStories = async () => {
    try {
      const response = await fetch(`${storageUrl}/${user.id}/get-all-stories`);
      if (!response.ok) {
        console.log('Network response was not ok');
        return;
      }
      const data = await response.json();
      setUserStories(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user stories:', error);
    }
  };

  const getStory = async (storyId: number) => {
    const userStory = userStories.find((story) => story.storyid === storyId);
    if (userStory && userStory.story != undefined) {
      setSelectedStory(userStory);
      return;
    }

    try {
      const response = await fetch(`${storageUrl}/${storyId}/get-story`);
      if (!response.ok) {
        console.log('Network response was not ok');
        return;
      }
      const data = await response.json();
      const json_data = JSON.parse(data);
      setSelectedStory(json_data);
      setUserStories((prevUserStories) =>
        prevUserStories.map((prevStory) =>
          prevStory.storyid === storyId
            ? { ...prevStory, story: json_data.story }
            : prevStory,
        ),
      );
    } catch (error) {
      console.error('Error fetching story:', error);
    }
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
      // Update the userStories state to reflect the change in public status
      setUserStories((prevStories) =>
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
      // Update the userStories state to reflect the change in private status
      setUserStories((prevStories) =>
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
      // Update the userStories state to reflect the change in public status
      setUserStories((prevStories) =>
        prevStories.map((story) =>
          story.storyid === storyId ? { ...story, ispublic: false } : story,
        ),
      );
    } catch (error) {
      console.error('Error setting to private:', error);
    }
  };

  // Filter stories based on the search query
  const filteredStories = userStories.filter((story) =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    updatePage();
  }, []);

  const navigate = useNavigate();

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
      <Box p="1rem">
        <Input
          maxWidth="500px"
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      {isLoading ? (
        <Stack spacing={5} mt="2rem">
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
        </Stack>
      ) : filteredStories.length === 0 ? (
        <Text>No stories available.</Text>
      ) : (
        <>
          {/*
          !!!
          DO NOT DELETE PLS
          !!!
          <SimpleGrid minChildWidth="240px">
            {flaggedUserStories.map((story, index) => (
              <VStack key={index}>
                <FlaggedStoryCard
                  key={story.storyid}
                  story={story}
                  handleViewStoryClick={() =>
                    navigate(`/story/${story.storyid}`)
                  }
                  storyBeingLoaded={storyBeingLoaded}
                />
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
                      onClick={() => handleUnshareButtonClick(story.storyid)}
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
                    {isDeleting.filter((id) => id === story.storyid).length ===
                      0 && <Text>Delete</Text>}
                    {isDeleting.filter((id) => id === story.storyid).length >
                      0 && <Text>Deleting...</Text>}
                  </Button>
                </HStack>
              </VStack>
            ))}
          </SimpleGrid> */}
          <Divider />
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
                      onClick={() => handleUnshareButtonClick(story.storyid)}
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
                    {isDeleting.filter((id) => id === story.storyid).length ===
                      0 && <Text>Delete</Text>}
                    {isDeleting.filter((id) => id === story.storyid).length >
                      0 && <Text>Deleting...</Text>}
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
        </>
      )}
    </Box>
  );
};

export default MyLibrary;
