import { Box, Text, Tooltip, HStack, Icon } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { useCurrentlyGeneratingStories } from '../../../context/CurrentlyGeneratingStoriesProvider';
import { CurrentlyGeneratingStoriesObserver } from '../../../context/subjects/CurrentlyGeneratingStoriesSubject';
import { FaPenNib } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function QueueDisplay() {
  const storageUrl = import.meta.env.VITE_STORAGE_URL;
  const { user } = useAuth();
  const { currentlyGeneratingStoriesSubjectSingleton } =
    useCurrentlyGeneratingStories();

  const [numGeneratingStories, setNumGeneratingStories] = useState(0);

  const onCurrentlyGeneratingStoriesChange: CurrentlyGeneratingStoriesObserver =
    (stories: string[]) => {
      setNumGeneratingStories(stories.length);
    };

  useEffect(() => {
    currentlyGeneratingStoriesSubjectSingleton.subscribe(
      onCurrentlyGeneratingStoriesChange,
    );
    const latestData =
      currentlyGeneratingStoriesSubjectSingleton.getLatestData();
    setNumGeneratingStories(latestData.length);

    // Unsubscribe the observer when the component unmounts
    return () =>
      currentlyGeneratingStoriesSubjectSingleton.unsubscribe(
        onCurrentlyGeneratingStoriesChange,
      );
  }, []);

  return (
    <>
      {numGeneratingStories != 0 && (
        <motion.div
          initial={{ scale: 5, opacity: 0 }} // Initial state of the component
          animate={{ scale: 1, opacity: 1 }} // Animate to full size and opacity
          transition={{ duration: 0.5, type: 'spring', stiffness: 80 }} // Duration of the animation
        >
          <Tooltip
            label={
              numGeneratingStories == 1
                ? `Your story is being generated in the background!`
                : `Your ${numGeneratingStories} stories are being generated in the background!`
            }
            hasArrow
            bgColor="brand.orange80"
          >
            <HStack height="100%" alignItems="center">
              <Icon as={FaPenNib} />
              <Text>{numGeneratingStories}</Text>
            </HStack>
          </Tooltip>
        </motion.div>
      )}
    </>
  );
}
