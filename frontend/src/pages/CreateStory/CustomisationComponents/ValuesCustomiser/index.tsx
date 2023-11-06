import { Box, Text, Checkbox, HStack, Select } from '@chakra-ui/react';

interface ValuesCustomiserProps {
  setValues: (values: string) => void;
  values: string;
}

export const ValuesCustomiser: React.FC<ValuesCustomiserProps> = ({
  setValues,
  values,
}) => {
  const morals = [
    'Caring',
    'Cooperation',
    'Courage',
    'Empathy',
    'Fairness',
    'Forgiveness',
    'Friendship',
    'Generosity',
    'Gratitude',
    'Honesty',
    'Humility',
    'Independence',
    'Integrity',
    'Kindness',
    'Love',
    'Loyalty',
    'Optimism',
    'Patience',
    'Perseverance',
    'Respect',
    'Responsibility',
    'Self-discipline',
    'Self-respect',
    'Sharing',
    'Teamwork',
    'Tolerance',
    'Trust',
    'Understanding',
    'Unity',
    'Wisdom',
  ];

  const handleSelectChange = (event: { target: { value: string } }) => {
    // Call the callback function to set the age
    setValues(event.target.value);
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
        Moral:
      </Text>
      <Box flexGrow={10}>
        <Select
          onChange={handleSelectChange}
          placeholder="Choose a Moral"
          defaultValue={morals[9]}
        >
          {morals.map((moral) => {
            return (
              <option key={moral} value={moral}>
                {moral}
              </option>
            );
          })}
        </Select>
      </Box>
    </HStack>
  );
};
