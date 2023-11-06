import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  FunctionComponent,
} from 'react';
import { useAuth } from './AuthProvider';

interface CreditContextProps {
  credits: number;
  setCredits: (credits: number) => void; // This function is expected to be used in your components.
  deductCredit?: () => void; // If you have this function implemented.
}

const CreditContext = createContext<CreditContextProps | undefined>(undefined);

export const useCredits = () => {
  const context = useContext(CreditContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditProvider');
  }
  return context;
};

const CreditProvider = ({ children }) => {
  const storageUrl = import.meta.env.VITE_STORAGE_URL;
  const { user } = useAuth();
  const [credits, setCredits] = useState(-Infinity);

  const fetchCredits = async (user_id) => {
    const response = await fetch(`${storageUrl}/credits/${user_id}`).then(
      (res) => res.json(),
    );

    setCredits(response);
  };

  // Fetch the initial credits from the server when the component mounts
  useEffect(() => {
    if (user) {
      fetchCredits(user.id);
    }
  }, [user]);

  const deductCredit = () => {
    // Make an API call to deduct a credit and update the credit count based on the response
  };

  return (
    <CreditContext.Provider value={{ credits, setCredits, deductCredit }}>
      {children}
    </CreditContext.Provider>
  );
};

export default CreditProvider;
