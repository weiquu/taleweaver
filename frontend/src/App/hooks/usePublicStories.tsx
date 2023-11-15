import { useQuery } from '@tanstack/react-query';

const storageUrl = import.meta.env.VITE_STORAGE_URL;

const fetchPublicStories = async (user, dataConsumer) => {
  try {
    const response = await fetch(
      `${storageUrl}/${user.id}/get-public-stories`,
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (dataConsumer) {
      dataConsumer(data);
    }
    return data;
  } catch (error) {
    throw new Error(`Error fetching public stories`);
  }
};

export const usePublicStories = (user, dataConsumer) => {
  return useQuery(['publicStories', user],
  		  () => fetchPublicStories(user, dataConsumer),
		  // will hold the cache for at least 5 minutes
		  {
		    staleTime: 300000,
		    cacheTime: 300000,
		  }
  );
}
