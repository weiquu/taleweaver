import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import { useAuth } from './AuthProvider';
import { subscribe, unsubscribe }  from '../App/components/supabaseUpdateSubscriber';

const CurrentlyGeneratingStoriesContext = createContext(undefined);

export const useCurrentlyGeneratingStories = () => {
  const context = useContext(CurrentlyGeneratingStoriesContext);
  if (context === undefined) {
    throw new Error('useCurrentlyGeneratingStories must be used within a CurrentlyGeneratingStoriesProvider');
  }
  return context;
};

const CurrentlyGeneratingStoriesProvider = ({ children }) => {
  const storageUrl = import.meta.env.VITE_STORAGE_URL;
  const { user } = useAuth();
  // TODO: dont use negative infinity
  const [currentlyGeneratingStories, setCurrentlyGeneratingStories] = useState([]);

  const fetchCurrentlyGeneratingStories = async (user_id) => {
    // convert response to string
    const response = await fetch(`${storageUrl}/${user_id}/currently-generating-stories/`)
      .then((res) => res.json())

    setCurrentlyGeneratingStories(response);
  };

  // Fetch the initial credits from the server when the component mounts
  useEffect(() => {
    if (user) {
      fetchCurrentlyGeneratingStories(user.id);
    }
  }, [user]);

  subscribe('stories-db-changes', '*', (payload) => {
    fetchCurrentlyGeneratingStories(user.id);
  });

  return (
    <CurrentlyGeneratingStoriesContext.Provider value={{ currentlyGeneratingStories }}>
      {children}
    </CurrentlyGeneratingStoriesContext.Provider>
  );
};

export default CurrentlyGeneratingStoriesProvider;
