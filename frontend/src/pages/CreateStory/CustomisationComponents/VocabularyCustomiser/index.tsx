import {
  Box,
  Text,
  Checkbox,
  HStack,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';

interface VocabularyCustomiserProps {
  setAge: (age: number) => void;
  age: number;
}

export const VocabularyCustomiser: React.FC<VocabularyCustomiserProps> = ({
  age,
  setAge,
}) => {
  const handleSliderChange = (newValue: number) => {
    // Call the callback function to set the age
    setAge(newValue);
  };

  return (
    <HStack
      display="flex"
      width="100%"
      minHeight="50px"
      justifyContent="space-between"
      alignItems="center"
      flexDirection={{ base: 'column', md: 'row' }}
      align="stretch"
    >
      <Text as="b" p="1rem">
        Vocabulary:
      </Text>
      <Box
        width={{ base: '100%', sm: '70%' }}
        flexGrow={1}
        display="flex"
        flexDirection="row"
        alignContent="center"
      >
        <Box minWidth="5rem" mx="1rem">
          <Text>{age} years</Text>
        </Box>
        <Slider
          aria-label="slider-ex-2"
          id="slider"
          defaultValue={age}
          min={1}
          max={20}
          onChange={handleSliderChange}
        >
          <SliderTrack>
            <SliderFilledTrack bg="brand.orange" />
          </SliderTrack>
          <SliderThumb borderColor="brand.orange" />
        </Slider>
      </Box>
    </HStack>
  );
};
