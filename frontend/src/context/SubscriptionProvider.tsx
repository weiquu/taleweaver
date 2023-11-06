import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  FunctionComponent,
} from 'react';
import { useAuth } from './AuthProvider';

interface SubscriptionContextProps {
  subscription: string;
  // setSubscription: (subscription: string) => void; // This function is expected to be used in your components.
}

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(
  undefined,
);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      'useSubscription must be used within a SubscriptionProvider',
    );
  }
  return context;
};

const subscriptionToText = (subscription: string) => {
  switch (subscription) {
    case 'none':
      return 'FREE';
    case 'regular':
      return 'MEMBER';
    case 'turbo':
      return 'TURBO';
    default:
      return '';
  }
};

const SubscriptionProvider = ({ children }) => {
  const storageUrl = import.meta.env.VITE_STORAGE_URL;
  const { user } = useAuth();
  const [subscription, setSubscription] = useState('');

  const fetchSubscription = async (user_id) => {
    const response = await fetch(`${storageUrl}/subscription/${user_id}`).then(
      (res) => res.json(),
    );

    setSubscription(subscriptionToText(response));
  };

  // Fetch the initial subscription from the server when the component mounts
  useEffect(() => {
    if (user) {
      fetchSubscription(user.id);
    }
  }, [user]);

  return (
    <SubscriptionContext.Provider value={{ subscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionProvider;
