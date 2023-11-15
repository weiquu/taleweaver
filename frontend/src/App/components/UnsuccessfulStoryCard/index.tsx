import React from 'react';
import { useState, useEffect } from 'react';
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
const UnsuccessfulStoryCard = ({
  story,
  handleViewStoryClick,
  isLoadingImage,
  storyBeingLoaded,
  handleDeleteStory,
  isDeleting,
}) => {
  return (
    <Card
      cursor="pointer"
      onClick={() => handleViewStoryClick(story.storyid)}
      key={story.storyid}
      height="70px"
      width="100%"
      margin="0rem"
      padding="0.5rem"
      borderRadius="10"
      justifyContent="space-between"
      // backgroundImage={`linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 50%), url('${story.coverurl}')`}
      bgColor={'#F5F5F5'}
      bgSize="cover"
      bgRepeat="no-repeat"
      bgPosition="center"
      transition="transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out"
      _hover={{
        transform: 'scale(1.05)',
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
      }}
    >
      <HStack flexDirection="row" justifyContent="space-between">
        {/* 
        <VStack width="100px" flexWrap="wrap" flexDirection="column" alignContent="center">
          <Tag width='100%' margin="1px" size={'sm'} variant="solid" colorScheme="teal">
            {story.moral}
          </Tag>
          <Tag width='100%' margin="3px" size={'sm'} variant="solid" colorScheme="orange">
            {story.genre}
          </Tag>
        </VStack> 
        */}
        <Text
          size="md"
          fontWeight="bold"
          color="dark"
          textAlign="left"
          width="100%"
        >
          {story.storyprompt}
        </Text>
        <Button
          variant="solid"
          colorScheme="red"
          onClick={(event) => {
            event.stopPropagation();
            handleDeleteStory(story.storyid)
          }}
          fontWeight="400"
          size="sm"
          height="55px"
        >
          {isDeleting.filter((id) => id === story.storyid).length ===
            0 && <Text>Delete</Text>}
          {isDeleting.filter((id) => id === story.storyid).length >
            0 && <Text>Deleting...</Text>}
        </Button>
      </HStack>
    </Card>
  );
};

export default UnsuccessfulStoryCard;
