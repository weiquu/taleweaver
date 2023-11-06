import { Box, Text, Badge, Center } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useSubscription } from '../../../context/SubscriptionProvider';
import { useAuth } from '../../../context/AuthProvider';

export default function SubscriptionDisplay(props) {
  const { subscription } = useSubscription();
  const { user } = useAuth();

  // This useEffect will now only serve the purpose of perhaps updating the UI if needed when the user changes.
  useEffect(() => {
    // You might want to perform other side effects here when the user changes.
  }, [user]);

  return (
    <Center>
      <Box>
        {subscription != '' && (
          <Badge
            colorScheme={
              subscription == 'FREE'
                ? 'gray'
                : subscription == 'MEMBER'
                ? 'yellow'
                : 'purple'
            }
            {...props}
          >
            {subscription}
          </Badge>
        )}
      </Box>
    </Center>
  );
}
