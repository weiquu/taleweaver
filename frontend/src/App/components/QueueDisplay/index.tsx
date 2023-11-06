import { Box, Text, Tooltip, HStack, Icon } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { useCurrentlyGeneratingStories } from '../../../context/CurrentlyGeneratingStoriesProvider';
import { FaPenNib } from 'react-icons/fa';

export default function QueueDisplay() {
  const storageUrl = import.meta.env.VITE_STORAGE_URL;
  const { user } = useAuth();
  const { currentlyGeneratingStories } = useCurrentlyGeneratingStories();

  useEffect(() => {}, []);

  return (
    <>
      {currentlyGeneratingStories.length != 0 && (
        <Tooltip
          label={`Your ${currentlyGeneratingStories.length} stories are being generated in the background!`}
          hasArrow
          bgColor="brand.orange80"
        >
          <HStack>
            <Icon as={FaPenNib} />
            <Text>{currentlyGeneratingStories.length}</Text>
          </HStack>
        </Tooltip>
      )}
    </>
  );
}
