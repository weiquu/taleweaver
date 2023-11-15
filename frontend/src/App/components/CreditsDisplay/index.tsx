import { Icon, Text, HStack, Tooltip } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useCredits } from '../../../context/CreditProvider';
import { useAuth } from '../../../context/AuthProvider';
import { FaCoins } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function CreditsDisplay() {
  const { credits } = useCredits();
  const { user } = useAuth();

  // This useEffect will now only serve the purpose of perhaps updating the UI if needed when the user changes.
  useEffect(() => {
    // You might want to perform other side effects here when the user changes.
  }, [user]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }} // Initial state of the component
      animate={{ scale: 1, opacity: 1 }} // Animate to full size and opacity
      transition={{ duration: 0.5, type: 'spring', stiffness: 80 }} // Duration of the animation
    >
      <Tooltip
        label="Number of stories you can generate!"
        hasArrow
        bgColor="brand.orange80"
      >
        <HStack height="100%">
          {credits != -Infinity && (
            <>
              <Icon as={FaCoins} />
              <Text>{credits}</Text>
            </>
          )}
        </HStack>
      </Tooltip>
    </motion.div>
  );
}
