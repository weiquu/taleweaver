import {
  Box,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Button,
} from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

interface Props {
  children: React.ReactNode;
}

function PriceWrapper(props: Props) {
  const { children } = props;

  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: 'center', lg: 'flex-start' }}
      borderColor={useColorModeValue('gray.200', 'gray.500')}
      borderRadius={'xl'}
    >
      {children}
    </Box>
  );
}

export default function PricingSection() {
  const { auth, user } = useAuth();
  const navigate = useNavigate();

  const navigateToCreate = () => {
    // 👇️ navigate to /contacts
    navigate('/create');
  };
  return (
    <Box py={12}>
      <VStack spacing={2} textAlign="center" py="1rem">
        <Heading as="h1" fontSize="4xl">
          Invest in safe, educational screentime.
        </Heading>
        <Text fontSize="lg" color={'gray.500'}>
          Create an account to access all our customisation features. Start with
          3 free stories.
        </Text>
      </VStack>
      {auth ? (
        // <stripe-pricing-table // TEST DATA
        //   pricing-table-id="prctbl_1O5dKhLswuVFInXrCQsOV3mF"
        //   publishable-key="pk_test_51Nwv2ZLswuVFInXryQ4Dwwbl6cfiL6ybgcqugcyprMG1672TlMDOeArGS8QlVQjpDzGskChw1MfOFAsJ0fFvkD2f00cQk5N3rX"
        //   customer-email={user?.email}
        // ></stripe-pricing-table>
        <stripe-pricing-table
          pricing-table-id="prctbl_1O5Fs1LswuVFInXravTCgmdF"
          publishable-key="pk_live_51Nwv2ZLswuVFInXrYGR3Hr7arIMi0BYvKDiABfvfjT19I8eS3qciCQ2KxujehkoXiioF2BX58Lb1mcQYzwD9s2Xx000uX5Z2oX"
          customer-email={user?.email}
        ></stripe-pricing-table>
      ) : (
        <Stack
          direction={{ base: 'column', md: 'row' }}
          textAlign="center"
          justify="center"
          spacing={{ base: 4, lg: 10 }}
          py={10}
        >
          <PriceWrapper>
            <Box py={4} px={12}>
              <Text fontWeight="500" fontSize="xl">
                Reader's Club
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="3xl" fontWeight="600">
                  S$
                </Text>
                <Text fontSize="5xl" fontWeight="900">
                  9
                </Text>
                <Text fontSize="3xl" color="gray.500">
                  /month
                </Text>
              </HStack>
            </Box>
            <VStack
              bg={useColorModeValue('gray.50', 'gray.700')}
              py={4}
              borderBottomRadius={'xl'}
            >
              <List spacing={3} textAlign="start" px={12}>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  20 illustrated storybooks/month
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Complete customisation
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Feature-Your-Child feature
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />2
                  illustration styles
                </ListItem>
              </List>
              <Box w="80%" pt={7}>
                <Button w="full" variant="styled" onClick={navigateToCreate}>
                  Start trial
                </Button>
              </Box>
            </VStack>
          </PriceWrapper>

          <PriceWrapper>
            <Box position="relative">
              <Box
                position="absolute"
                top="-16px"
                left="50%"
                style={{ transform: 'translate(-50%)' }}
              >
                <Text
                  textTransform="uppercase"
                  bg="brand.orange"
                  px={3}
                  py={1}
                  color="gray.100"
                  fontSize="sm"
                  fontWeight="500"
                  rounded="xl"
                >
                  Most Popular
                </Text>
              </Box>
              <Box py={4} px={12}>
                <Text fontWeight="500" fontSize="xl">
                  Turbo Reader's Club
                </Text>
                <HStack justifyContent="center">
                  <Text fontSize="3xl" fontWeight="600">
                    S$
                  </Text>
                  <Text fontSize="5xl" fontWeight="900">
                    19
                  </Text>
                  <Text fontSize="3xl" color="gray.500">
                    /month
                  </Text>
                </HStack>
              </Box>
              <VStack
                bg={useColorModeValue('gray.50', 'gray.700')}
                py={4}
                borderBottomRadius={'xl'}
              >
                <List spacing={3} textAlign="start" px={12}>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    60 illustrated storybooks/month
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    Complete customisation
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    Feature-Your-Child feature
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    10+ illustration styles
                  </ListItem>
                </List>
                <Box w="80%" pt={7}>
                  <Button
                    w="full"
                    variant="styled-color"
                    onClick={navigateToCreate}
                  >
                    Start trial
                  </Button>
                </Box>
              </VStack>
            </Box>
          </PriceWrapper>
        </Stack>
      )}
    </Box>
  );
}
