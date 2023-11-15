import { useQuery } from '@tanstack/react-query';

const storageUrl = import.meta.env.VITE_STORAGE_URL;

const fetchAvatars = async (userId, responseConsumer, errorConsumer) => {
  // TODO: need to pass this into the function as a parameter
  // setLoadingAvatars(true);
  try {
    const response = await fetch(`${storageUrl}/avatars/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    responseConsumer(response.status, response.ok, response.statusText, data);
    return data
  } catch (error) {
    errorConsumer(error);
    return null;
  }
};

export const useAvatars = (userId, responseConsumer, errorConsumer) => {
  return useQuery(['avatars', userId],
  		  () => fetchAvatars(userId, responseConsumer, errorConsumer),
		  // will hold the cache for at least 5 minutes
		  {
		    staleTime: Infinity,
		    cacheTime: Infinity,
		  }
  );
}
