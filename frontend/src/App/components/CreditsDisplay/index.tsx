import { Icon, Text, HStack, Tooltip } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useCredits } from '../../../context/CreditProvider';
import { useAuth } from '../../../context/AuthProvider';
import { FaCoins } from 'react-icons/fa';

export default function CreditsDisplay() {
  const { credits } = useCredits();
  const { user } = useAuth();

  // This useEffect will now only serve the purpose of perhaps updating the UI if needed when the user changes.
  useEffect(() => {
    // You might want to perform other side effects here when the user changes.
  }, [user]);

  return (
    <Tooltip
      label="Number of stories you can generate!"
      hasArrow
      bgColor="brand.orange80"
    >
      <HStack>
        {credits != -Infinity && (
          <>
            <Icon as={FaCoins} />
            <Text>{credits}</Text>
          </>
        )}
      </HStack>
    </Tooltip>
  );
}
