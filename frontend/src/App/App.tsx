import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/calistoga/400.css';
import '@fontsource/caveat/400.css';
import './styles.css';

import { Box, ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Router from '../pages/router';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import theme from './theme';
import AuthProvider from '../context/AuthProvider';
import CreditProvider from '../context/CreditProvider';
import CurrentlyGeneratingStoriesProvider from '../context/CurrentlyGeneratingStoriesProvider';
import SubscriptionProvider from '../context/SubscriptionProvider';

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
            <CreditProvider>
              <CurrentlyGeneratingStoriesProvider>
                <Box fontSize="md">
                  <NavBar />
                  <Box minHeight="100vh">
                    <Router />
                  </Box>
                  <Footer />
                </Box>
              </CurrentlyGeneratingStoriesProvider>
            </CreditProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  </QueryClientProvider>
);
