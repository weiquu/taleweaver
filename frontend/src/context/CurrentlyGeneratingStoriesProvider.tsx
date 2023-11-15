import React, { createContext, useContext, useEffect } from 'react';

import { useAuth } from './AuthProvider';
import {
  CurrentlyGeneratingStoriesSubject,
  StoryGenerationResult,
  StoryGenerationResultObserver,
  StoryGenerationStatus,
  currentlyGeneratingStoriesSubjectSingleton,
} from './subjects/CurrentlyGeneratingStoriesSubject';

import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Text } from '@chakra-ui/react';

/* 
// How to use this context in a component:

import { useCurrentlyGeneratingStories } from '../../context/CurrentlyGeneratingStoriesProvider';

const MyComponent = () => {
  // get the singleton instance from the context
  const { currentlyGeneratingStoriesSubjectSingleton } = useCurrentlyGeneratingStories();

  // create an observer function, which will be called with the latest data whenever there is a change
  // to the 'stories' table in the database
  const onCurrentlyGeneratingStoriesChange: CurrentlyGeneratingStoriesObserver = (stories: string[]) => {
    // set your variables, etc. here
    setNumGeneratingStories(latestData.length);
  }

  useEffect(() => {
    // subscribe to the subject on mount
    currentlyGeneratingStoriesSubjectSingleton.subscribe(onCurrentlyGeneratingStoriesChange);

    // We need to manually fetch the data once. Note: this is only called on mount, because there
    // was no change in the database, so the observer function would not be called
    const latestData = currentlyGeneratingStoriesSubjectSingleton.getLatestData();
    // set your variables, etc. here
    setNumGeneratingStories(latestData.length);

    // Unsubscribe the observer when the component unmounts
    return () => currentlyGeneratingStoriesSubjectSingleton.unsubscribe(onCurrentlyGeneratingStoriesChange);
  }, []);
}

*/

// Toasting section
const SuccessStoryToast = ({ story }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => story.storyid && navigate(`/story/${story.storyid}`)}>
      <Text>
        Hooray! Your story{' '}
        <u>
          <b>{story.title}</b>
        </u>{' '}
        is ready! 🥳🥳🥳
      </Text>
      <Text>Click me to view it!</Text>
    </div>
  );
};

const ContentWarningToast = ({ story }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/create/${story.storyid}`)}>
      <Text>
        Hmm, your prompt <b>{story.storyprompt}</b> did not pass our safety
        filters.
      </Text>
      <Text>Click here to try creating another story!</Text>
    </div>
  );
};

const FailureToast = ({ story }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/create/${story.storyid}`)}>
      <Text>
        Shucks! Something went wrong while generating your story:{' '}
        <b>{story.storyprompt}</b>
      </Text>
      <Text>Click here to try again with the same prompt.</Text>
    </div>
  );
};

const onStoryGenerationResultChange: StoryGenerationResultObserver = (
  storyGenerationResult: StoryGenerationResult,
) => {
  switch (storyGenerationResult.status) {
    case StoryGenerationStatus.Success:
      toast.success(<SuccessStoryToast story={storyGenerationResult.story} />, {
        position: 'bottom-right',
        autoClose: 20000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    case StoryGenerationStatus.Failure:
      toast.error(<FailureToast story={storyGenerationResult.story} />, {
        position: 'bottom-right',
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    case StoryGenerationStatus.ContentWarning:
      toast.error(<ContentWarningToast story={storyGenerationResult.story} />, {
        position: 'bottom-right',
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
  }
};

const CurrentlyGeneratingStoriesContext = createContext<
  CurrentlyGeneratingStoriesSubject | undefined
>(undefined);

export function useCurrentlyGeneratingStories(): CurrentlyGeneratingStoriesSubject {
  const context = useContext(CurrentlyGeneratingStoriesContext);
  if (context === undefined) {
    throw new Error(
      'useCurrentlyGeneratingStories must be used within a CurrentlyGeneratingStoriesProvider',
    );
  }
  return context;
}

const CurrentlyGeneratingStoriesProvider = ({ children }) => {
  const storageUrl = import.meta.env.VITE_STORAGE_URL;
  const { user } = useAuth();
  currentlyGeneratingStoriesSubjectSingleton.user = user;
  currentlyGeneratingStoriesSubjectSingleton.storageUrl = storageUrl;
  currentlyGeneratingStoriesSubjectSingleton.triggerInitialFetch();

  useEffect(() => {
    currentlyGeneratingStoriesSubjectSingleton.storyGenSubscribe(
      onStoryGenerationResultChange,
    );
    return () =>
      currentlyGeneratingStoriesSubjectSingleton.storyGenUnsubscribe(
        onStoryGenerationResultChange,
      );
  });

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <CurrentlyGeneratingStoriesContext.Provider
        value={{ currentlyGeneratingStoriesSubjectSingleton }}
      >
        {children}
      </CurrentlyGeneratingStoriesContext.Provider>
    </>
  );
};

export default CurrentlyGeneratingStoriesProvider;
