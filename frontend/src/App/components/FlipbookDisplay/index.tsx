import {
  Container,
  Box,
  Tag,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  useBreakpointValue,
  Image,
  VStack,
  Divider,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { WhiteColoredLogo } from '../../WhiteColoredLogo';
import taleweaverIcon from '/src/images/taleweaver_icon_svg.svg';
import StoryCarousel from './alt/StoryCarousel';
import './styles.css';

export interface Story {
  storyid: number;
  ispublic: boolean;
  age: number;
  moral: string;
  title: string;
  genre: string;
  score: number;
  userid: string;
  coverurl: string;
  userLiked: boolean;
  story: {
    image_prompt: string;
    image_url: string;
    page: number;
    subject_description: string;
    text: string;
  }[];
}

const FlipbookDisplay = ({ selectedStory }: { selectedStory: Story }) => {
  const [isImageLoaded, setIsImageLoaded] = useState<number[]>([]);
  const displayCarousel = useBreakpointValue({ base: true, md: false });

  const onLoad = (pageNumber: number) => {
    if (selectedStory.story[pageNumber - 1].image_url === '') {
      console.log('image not generated');
      return;
    }
    setIsImageLoaded((prevImages) => [...prevImages, pageNumber]);
  };

  if (!selectedStory || !selectedStory.story) {
    return null; // Add a fallback for when the data is not available.
  }

  const width = 600;
  const height = 800;

  return (
    <>
      {displayCarousel ? ( // Conditionally render based on the breakpoint
        <StoryCarousel selectedStory={selectedStory} />
      ) : (
        <HTMLFlipBook
          width={width}
          height={height}
          key={`${width}-${height}`}
          size="stretch"
          minWidth={172}
          maxWidth={1000}
          minHeight={218}
          maxHeight={1000}
          maxShadowOpacity={0.5}
          showCover={true}
          usePortrait={false}
          mobileScrollSupport={true}
          className="demo-book"
        >
          <Box
            className="cover-page"
            p="10px"
            bg="white"
            border="1px"
            borderColor="gray.300"
            borderRadius="10px"
            overflow="clip"
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
              width="100%"
              alt="TaleWeaver icon"
              src={taleweaverIcon}
              height="40px"
              position="absolute"
              bottom="2rem"
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
            >
              <VStack key={pageData.page} maxHeight="100%">
                <Image
                  objectFit="cover"
                  borderRadius="1rem"
                  boxSize="100%"
                  src={pageData.image_url}
                  alt={pageData.image_prompt}
                  onLoad={() => onLoad(pageData.page)}
                  style={{
                    display: isImageLoaded.includes(pageData.page)
                      ? 'block'
                      : 'none',
                  }}
                />
                {!isImageLoaded.includes(pageData.page) && (
                  <Container
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="400px"
                    width="400px"
                  >
                    <Spinner color="brand.orange" size="lg" />
                  </Container>
                )}
                {/* <Text fontSize="sm" fontStyle="normal">
                  {pageData.image_prompt}
                </Text> */}
                <Text overflow="clip" fontSize="1rem" fontStyle="normal">
                  {pageData.text}
                </Text>
                <Box position="absolute" bottom="1rem">
                  <Divider />
                  <Text
                    fontFamily="Playpen-Sans"
                    fontSize="sm"
                    fontStyle="normal"
                  >
                    {pageData.page}
                  </Text>
                </Box>
              </VStack>
              <Box
                backgroundImage={pageData.image_url}
                backgroundSize="cover"
                filter="blur(5px)"
                border="1px"
                borderColor="gray.300"
                borderRadius="10px"
                position="absolute"
                top="0"
                left="0"
                zIndex="-1"
                opacity="0.1"
                bgPosition="center"
                width="100%"
                height="100%"
              />
            </Box>
          ))}
          <Box
            className="back-page"
            p="10px"
            bg="white"
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
              <WhiteColoredLogo />
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
        </HTMLFlipBook>
      )}
    </>
  );
};

const CoverPage = (title: string) => {
  return (
    <Box
      p="10px"
      bg="white"
      border="1px"
      borderColor="gray.300"
      borderRadius="10px"
      overflow="clip"
    >
      <Heading
        fontFamily="caveat"
        color="white"
        textShadow="2px 2px 10px #080808"
        fontSize="4xl"
        pt="4rem"
      >
        {title}
      </Heading>
      <Box
        backgroundImage={`linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 50%), url('${selectedStory.story[0].image_url}')`}
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
  );
};

export default FlipbookDisplay;
