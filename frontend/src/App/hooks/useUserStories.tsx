import { useQuery } from '@tanstack/react-query';

const storageUrl = import.meta.env.VITE_STORAGE_URL;

const fetchUserStories = async (user, successfulStories, dataConsumer) => {
  let url = `${storageUrl}/${user.id}/get-all-stories`;
  if (!successfulStories) {
    url = `${storageUrl}/${user.id}/get-unsuccessful-stories`;
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (dataConsumer) {
      dataConsumer(data);
    }
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching user stories`);
  }
};

export const useSuccessfulUserStories = (user, dataConsumer) => {
  return useQuery(['successfulUserStories', user],
  		  () => fetchUserStories(user, true, dataConsumer),
		  // will hold the cache for at least 5 minutes
		  {
		    staleTime: Infinity,
		    cacheTime: Infinity,
		  }
  );
}

export const useUnsuccessfulUserStories = (user, dataConsumer) => {
  return useQuery(['unsuccessfulUserStories', user],
  		  () => fetchUserStories(user, false, dataConsumer),
		  // will hold the cache for at least 5 minutes
		  {
		    staleTime: Infinity,
		    cacheTime: Infinity,
		  }
  );
}
