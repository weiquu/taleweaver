import {
  Button,
  Card,
  Heading,
  Box,
  Text,
  Modal,
  Container,
  CardFooter,
  Tag,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Image,
  Stack,
  Skeleton,
  VStack,
  Center,
  SimpleGrid,
  Spinner,
  HStack,
  Icon,
  Checkbox,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

import { useAuth } from '../../context/AuthProvider';
import { Story } from '../../App/components/FlipbookDisplay';
import { usePublicStories } from '../../App/hooks/usePublicStories';
import FlipbookDisplay from '../../App/components/FlipbookDisplay';
import StoryCard from '../../App/components/StoryCard';


// interface Story {
//   storyid: number;
//   ispublic: boolean;
//   age: number;
//   moral: string;
//   title: string;
//   genre: string;
//   userid: string;
//   story: [];
// }

const PublicLibrary = () => {
  const { user } = useAuth();
  const storageUrl = import.meta.env.VITE_STORAGE_URL;
  const [publicStories, setPublicStories] = useState<Story[]>([]);
  const [filteredAndSortedStories, setFilteredAndSortedStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story>(); // To store the selected story for viewing in the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // To toggle the modal
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState<Number[]>([]);
  const [storyBeingLoaded, setStoryBeingLoaded] = useState(-1);
  const [sortBys, setSortBys] = useState<string[]>([]);

  const {
    data: publicStoriesData,
    error: publicStoriesError,
    refetch: refetchPublicStories,
  } = usePublicStories(user, (data) => {
    setIsLoading(true);
    setPublicStories(data);
    setIsLoading(false);
  });

  const onLoad = (storyId: Number) => {
    setIsImageLoaded((prevImages) => [...prevImages, storyId]);
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // set filtered stories
    if (sortBys.length === 0) {
      setFilteredAndSortedStories(getFilteredStories());
    } else if (sortBys.length === 1) {
      setFilteredAndSortedStories(getFilteredAndSortedStories(nameToFunctionMap[sortBys[0]]));
    } else {
      setFilteredAndSortedStories(getFilteredAndSortedStories(sortByScoreAndAlphabetical));
    }
  }, [publicStories, sortBys]);


  // Filter stories based on the search query
  const getFilteredAndSortedStories = (sortBy: (arg0: Story, arg1: Story) => number) => {
    const filteredStories = publicStories.filter((story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    return filteredStories.sort(sortBy);
  };

  const getFilteredStories = () => {
    return publicStories.filter((story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  // TODO: write the following functions in a more extensible manner

  const sortByScore = (a: Story, b: Story) => {
    return b.score - a.score;
  };

  const sortByAlphabetical = (a: Story, b: Story) => {
    return a.title.localeCompare(b.title);
  }

  const sortByScoreAndAlphabetical = (a: Story, b: Story) => {
    if (b.score === a.score) {
      return a.title.localeCompare(b.title);
    }
    return b.score - a.score;
  }

  const setSortBy = (checked: boolean, sortBy: string) => {
    if (checked) {
      setSortBys((prevSortBys) => [...prevSortBys, sortBy]);
    } else {
      setSortBys((prevSortBys) => prevSortBys.filter((prevSortBy) => prevSortBy !== sortBy));
    }
  };

  const SCORE = 'Sort By Score';
  const ALPHABETICAL = 'Sort By Alphabetical';
  const nameToFunctionMap = {
    'Sort By Score': sortByScore,
    'Sort By Alphabetical': sortByAlphabetical,
  };

  const handleIncreaseScore = async (story: Story) => {
    try {
      const response = await fetch(`${storageUrl}/increase-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          story_id: story.storyid,
        }),
      });
      if (!response.ok) {
        console.log('Network response was not ok');
        return;
      }
      // set the latest score and userLiked
      const data = await response.json();
      const updatedStory = { ...story, score: data.score, userLiked: true };
      setPublicStories((prevPublicStories) =>
        prevPublicStories.map((prevStory) =>
          prevStory.storyid === story.storyid ? updatedStory : prevStory,
        ),
      );
    } catch (error) {
      console.error('Error increasing score:', error);
    }
  };

  const handleDecreaseScore = async (story: Story) => {
    try {
      const response = await fetch(`${storageUrl}/decrease-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          story_id: story.storyid,
        }),
      });
      if (!response.ok) {
        console.log('Network response was not ok');
        return;
      }
      // set the latest score and userLiked
      const data = await response.json();
      const updatedStory = { ...story, score: data.score, userLiked: false };
      setPublicStories((prevPublicStories) =>
        prevPublicStories.map((prevStory) =>
          prevStory.storyid === story.storyid ? updatedStory : prevStory,
        ),
      );
    } catch (error) {
      console.error('Error decreasing score:', error);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!publicStoriesData) {
      refetchPublicStories();
    } else {
      setPublicStories(publicStoriesData);
      setIsLoading(false);
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
        Public Gallery
      </Heading>
      <HStack p="1rem">
        <Input mr="1rem"
          maxWidth="500px"
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Stack spacing={5} direction='row'>
          <Checkbox onChange={(e) => setSortBy(e.target.checked, SCORE)}>
            Sort By Score
          </Checkbox>
          <Checkbox onChange={(e) => setSortBy(e.target.checked, ALPHABETICAL)}>
            Sort By Alphabetical
          </Checkbox>
        </Stack>
      </HStack>

      {isLoading ? (
        <Stack spacing={5} mt="2rem" mx="1rem">
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
        </Stack>
      ) : filteredAndSortedStories.length === 0 ? (
        <Text>No stories available.</Text>
      ) : (
        <SimpleGrid minChildWidth="240px">
          {filteredAndSortedStories.map((story, index) => (
            <Stack spacing={0} key={index}>
              <StoryCard
                key={story.storyid}
                story={story}
                handleViewStoryClick={() => navigate(`/story/${story.storyid}`)}
                isLoadingImage={isImageLoaded.includes(story.storyid)}
                storyBeingLoaded={storyBeingLoaded}
              />
              <HStack px="1rem" color="gray">
                <Icon
                  as={story.userLiked ? AiFillHeart : AiOutlineHeart}
                  onClick={() => {
                    // Optimistically update the UI before the fetch request
                    const updatedStory = {
                      ...story,
                      userLiked: !story.userLiked,
                      // Optionally, you can also optimistically update the score
                      score: story.userLiked
                        ? Math.max(0, story.score - 1)
                        : story.score + 1,
                    };

                    setPublicStories((prevPublicStories) =>
                      prevPublicStories.map((prevStory) =>
                        prevStory.storyid === story.storyid
                          ? updatedStory
                          : prevStory,
                      ),
                    );

                    // Call the respective handler function
                    story.userLiked
                      ? handleDecreaseScore(story)
                      : handleIncreaseScore(story);
                  }}
                  color={story.userLiked ? 'red' : 'gray'}
                  cursor="pointer"
                  _hover={{
                    background: 'transparent',
                    transform: 'scale(1.5)',
                    opacity: 1,
                  }}
                  transition="0.2s"
                />
                <Text fontSize="sm">{story.score}</Text>
              </HStack>
            </Stack>
          ))}
        </SimpleGrid>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        size={'full'}
        scrollBehavior={'inside'}
      >
        <ModalContent
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="contrast(98%) blur(5px)"
        >
          <ModalHeader textAlign="center" color="white" fontWeight="400">
            {selectedStory?.title}
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
              <Container textAlign="center" maxW={'4xl'} py={12}>
                <FlipbookDisplay selectedStory={selectedStory} />
              </Container>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PublicLibrary;
