import { Box, Text, Checkbox, HStack, Select } from '@chakra-ui/react';

interface GenreCustomiserProps {
  setGenre: (values: string) => void;
  genre: string;
}

export const GenreCustomiser: React.FC<GenreCustomiserProps> = ({
  setGenre,
  genre,
}) => {
  const genres = [
    'Rhyming',
    'Adventure',
    'Fantasy',
    'Mystery',
    'Science Fiction',
    'Fairy Tale',
    'Animal Stories',
    'Humor',
    'Educational',
  ];

  const handleSelectChange = (event: { target: { value: string } }) => {
    // Call the callback function to set the age
    setGenre(event.target.value);
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
        Genre:
      </Text>
      <Box flexGrow={10}>
        <Select
          onChange={handleSelectChange}
          placeholder="Choose a Genre"
          defaultValue={genres[0]}
        >
          {genres.map((genre) => {
            return (
              <option key={genre} value={genre}>
                {genre}
              </option>
            );
          })}
        </Select>
      </Box>
    </HStack>
  );
};
