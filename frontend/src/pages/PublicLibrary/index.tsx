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
} from '@chakra-ui/react';
import { useAuth } from '../../context/AuthProvider';
import { useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import FlipbookDisplay from '../../App/components/FlipbookDisplay';
import { Story } from '../../App/components/FlipbookDisplay';
import StoryCard from '../../App/components/StoryCard';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

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
  const [selectedStory, setSelectedStory] = useState<Story>(); // To store the selected story for viewing in the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // To toggle the modal
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState<Number[]>([]);
  const [storyBeingLoaded, setStoryBeingLoaded] = useState(-1);

  const onLoad = (storyId: Number) => {
    setIsImageLoaded((prevImages) => [...prevImages, storyId]);
  };

  const getPublicStories = async () => {
    try {
      const response = await fetch(
        `${storageUrl}/${user.id}/get-public-stories`,
      );
      if (!response.ok) {
        console.log('Network response was not ok');
        return;
      }
      const data = await response.json();
      setPublicStories(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching public stories:', error);
    }
  };

  const getStory = async (storyId: number) => {
    const publicStory = publicStories.find(
      (story) => story.storyid === storyId,
    );
    if (publicStory && publicStory.story != undefined) {
      setSelectedStory(publicStory);
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
      setPublicStories((prevPublicStories) =>
        prevPublicStories.map((prevStory) =>
          prevStory.storyid === storyId
            ? { ...prevStory, story: json_data.story }
            : prevStory,
        ),
      );
    } catch (error) {
      console.error('Error fetching story:', error);
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

  const handleViewStoryClick = async (storyId: number) => {
    // hmm if story being loaded is not -1, then we should not load the story?
    setStoryBeingLoaded(storyId);
    await getStory(storyId);
    setStoryBeingLoaded(-1);
    openModal();
  };

  // Filter stories based on the search query
  const filteredStories = publicStories.filter((story) =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

  useEffect(() => {
    getPublicStories();
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
        Public Gallery
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
        <SimpleGrid minChildWidth="240px">
          {filteredStories.map((story, index) => (
            <Stack spacing={0}>
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
