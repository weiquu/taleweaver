import { Box, Text, Checkbox, HStack, Select } from '@chakra-ui/react';
import { useSubscription } from '../../../../context/SubscriptionProvider';

interface StyleCustomiserProps {
  setArtstyle: (values: string) => void;
  artstyle: string;
}

export const StyleCustomiser: React.FC<StyleCustomiserProps> = ({
  setArtstyle,
  artstyle,
}) => {
  const { subscription } = useSubscription();

  const freeArtstyles = [
    'watercolor',
    'cartoon'
  ];

  const turboArtstyles = [
    'watercolor',
    'cartoon',
    'colorpencil',
    'anime',
    'surreal',
    'pencil sketch',
    'realistic',
    'disney',
  ];

  const handleSelectChange = (event: { target: { value: string } }) => {
    // Call the callback function to set the style
    setArtstyle(event.target.value);
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
        Artstyle:
      </Text>
      <Box flexGrow={10}>
        { subscription != 'TURBO' ? 
        (<Select
        onChange={handleSelectChange}
        value={artstyle == '' ? freeArtstyles[0] : artstyle}
      >
        {freeArtstyles.map((artstyle) => {
          return (
            <option key={artstyle} value={artstyle}>
              {artstyle}
            </option>
          );
        })}
      </Select>):
      (<Select
      onChange={handleSelectChange}
      value={artstyle == '' ? turboArtstyles[0] : artstyle}
    >
      {turboArtstyles.map((artstyle) => {
        return (
          <option key={artstyle} value={artstyle}>
            {artstyle}
          </option>
        );
      })}
    </Select>)}
        
      </Box>
    </HStack>
  );
};
