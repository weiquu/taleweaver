import React from 'react';
import { Box, Text, Image, Heading, Divider, VStack } from '@chakra-ui/react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import taleweaverIcon from '/src/images/taleweaver_icon_svg.svg';
import { WhiteColoredLogo } from '../../../WhiteColoredLogo';
import { Story } from '..';

interface StoryCarouselProps {
  selectedStory: Story;
}

const StoryCarousel: React.FC<StoryCarouselProps> = ({ selectedStory }) => {
  return (
    <Box width="100%" maxW="600px" mx="auto">
      <Carousel
        showStatus={false}
        showThumbs={false}
        showIndicators={false}
        swipeable={true}
        emulateTouch={true}
        infiniteLoop={false}
        preventMovementUntilSwipeScrollTolerance={true}
        swipeScrollTolerance={50}
      >
        <Box
          className="cover-page"
          p="10px"
          border="1px"
          borderColor="gray.300"
          borderRadius="10px"
          overflow="clip"
          height="100%"
          position="relative"
        >
          <Heading
            fontFamily="caveat"
            color="white"
            textShadow="2px 2px 10px #080808"
            fontSize="4xl"
            pt="4rem"
          >
            {selectedStory.title}
          </Heading>
          <Image
            alt="TaleWeaver icon"
            src={taleweaverIcon}
            height="40px"
            position="absolute"
            bottom="2rem"
            display="inherit !important"
          />
          <Box
            backgroundImage={`linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 75%, rgba(0, 0, 0, 0.8) 100%), url('${selectedStory.story[0].image_url}')`}
            backgroundSize="cover"
            border="1px"
            borderColor="gray.300"
            borderRadius="10px"
            position="absolute"
            top="0"
            left="0"
            zIndex="-1"
            bgPosition="center"
            width="100%"
            height="100%"
          />
        </Box>
        {selectedStory.story.map((pageData) => (
          <Box
            key={pageData.page}
            p="10px"
            bg="white"
            border="1px"
            borderColor="gray.300"
            borderRadius="10px"
            overflow="clip"
            textAlign="center"
          >
            <Image
              objectFit="cover"
              borderRadius="1rem"
              boxSize="100%"
              src={pageData.image_url}
              alt={pageData.image_prompt}
            />
            <Text fontSize="1rem" mt="1rem">
              {pageData.text}
            </Text>
            <Divider mt="1rem" />
            <Text fontSize="sm" mt="1rem">
              {pageData.page}
            </Text>
          </Box>
        ))}
        <Box
          className="back-page"
          p="10px"
          height="100%"
          border="1px"
          borderColor="gray.300"
          borderRadius="10px"
          overflow="clip"
          position="relative"
        >
          <VStack
            alignItems="left"
            textAlign="left"
            position="absolute"
            top="1rem"
            left="2rem"
            color="white"
          >
            <Heading
              textShadow="2px 2px 10px #080808"
              py="1rem"
              fontFamily="caveat"
              fontSize="4xl"
            >
              The End!
            </Heading>
          </VStack>
          <VStack
            alignItems="left"
            textAlign="left"
            position="absolute"
            bottom="1rem"
            left="2rem"
            color="white"
            py="1rem"
          >
            <Heading fontFamily="caveat" fontSize="4xl">
              {selectedStory.title}
            </Heading>
            <Text opacity="0.5">made with </Text>
            <WhiteColoredLogo width="160px !important" />
          </VStack>

          <Box
            backgroundImage={`linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 50%), url('${selectedStory.story[0].image_url}')`}
            filter="blur(2px)"
            backgroundSize="cover"
            border="1px"
            borderColor="gray.300"
            borderRadius="10px"
            position="absolute"
            top="0"
            left="0"
            zIndex="-1"
            bgPosition="center"
            width="100%"
            height="100%"
          />
        </Box>
      </Carousel>
    </Box>
  );
};

export default StoryCarousel;
