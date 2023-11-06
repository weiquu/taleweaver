import React from 'react';
import {
  Card,
  HStack,
  Heading,
  Text,
  VStack,
  Tag,
  Button,
  Spinner,
  CardFooter,
} from '@chakra-ui/react';

// TODO: Change this to display information about the story and allow the user to make changes to the prompt?
const FlaggedStoryCard = ({
  story,
  handleViewStoryClick,
  isLoadingImage,
  storyBeingLoaded,
}) => {
  return (
    <Card
      cursor="pointer"
      onClick={() => handleViewStoryClick(story.storyid)}
      key={story.storyid}
      minHeight="300px"
      width="80%"
      margin="1rem"
      padding="1rem"
      borderRadius="10"
      justifyContent="space-between"
      // backgroundImage={`linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 50%), url('${story.coverurl}')`}
      bgSize="cover"
      bgRepeat="no-repeat"
      bgPosition="center"
      transition="transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out"
      _hover={{
        transform: 'rotate(1deg) scale(1.05)',
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
      }}
    >
      <HStack flexDirection="column" justifyContent="space-between">
        <VStack flexWrap="wrap" flexDirection="row" alignContent="center">
          {story.moral !== 'any' && (
            <Tag m="3px" size={'sm'} variant="solid" colorScheme="teal">
              {story.moral}
            </Tag>
          )}

          {story.genre !== 'any' && (
            <Tag m="3px" size={'sm'} variant="solid" colorScheme="orange">
              {story.genre}
            </Tag>
          )}
        </VStack>

        <Text
          size="md"
          fontWeight="bold"
          color="white"
          textShadow="2px 2px 10px #080808"
        >
          {story.storyprompt}
        </Text>
      </HStack>

      <CardFooter>
        <Button
          height="100%"
          bg="none"
          textShadow="2px 2px 5px #080808"
          color="rgba(255,255,255,0.2)"
          fontWeight="400"
          margin="auto"
          _hover={{ color: 'white' }}
          onClick={() => handleViewStoryClick(story.storyid)}
        >
          {storyBeingLoaded === story.storyid ? (
            <Spinner color="white" thickness="4px" size="xl" />
          ) : (
            'View Story'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FlaggedStoryCard;
