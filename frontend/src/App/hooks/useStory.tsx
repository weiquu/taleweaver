import { useQuery } from '@tanstack/react-query';

const storageUrl = import.meta.env.VITE_STORAGE_URL;

const fetchStory = async (session, storyId, dataConsumer, errorConsumer) => {
  try {
    console.log('Story id:', storyId);
    const response = await fetch(`${storageUrl}/${storyId}/get-story`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    if (!response.ok) {
      errorConsumer('Network response was not ok');
      return;
    }
    const data = await response.json();
    const json_data = JSON.parse(data);
    if (dataConsumer) {
      dataConsumer(json_data);
    }
    return json_data;
  } catch (error) {
    errorConsumer(error);
    return;
  }
};

export const useStory = (session, storyId, dataConsumer, errorConsumer) => {
  return useQuery(['story', storyId],
  		  () => fetchStory(session, storyId, dataConsumer, errorConsumer),
		  // will hold the cache until session ends.
      // rationale for this is that individual stories are cannot be changed, so we don't need to refetch them
		  {
		    staleTime: Infinity,
		    cacheTime: Infinity,
		  }
  );
}
