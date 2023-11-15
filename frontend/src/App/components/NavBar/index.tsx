import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  VStack,
  HStack,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  Container,
  useDisclosure,
  Avatar,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DefaultLogo } from '../../DefautLogo';
import { useAuth } from '../../../context/AuthProvider';
import { routerType } from '../../../types/router.types';
import pagesData from '../../../pages/pagesData';
import QueueDisplay from '../QueueDisplay';
import CreditsDisplay from '../CreditsDisplay';
import SubscriptionDisplay from '../SubscriptionDisplay';
import taleweaverIcon from '/src/images/taleweaver_icon_svg.svg';

export default function NavBar() {
  const { session, auth, user, signOut } = useAuth();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { error } = await signOut();
      console.log(error);
    } catch (error) {
      console.log(error);
    }
    onClose();
    navigate('/');
  };

  return (
    <Box>
      <Flex
        position="fixed"
        top="0"
        w="100%"
        backdropFilter="contrast(150%) blur(5px)"
        boxShadow="0px 0px 30px 0px rgba(0, 0, 0, 0.15)"
        bg="rgba(255,255,255,0.75)"
        color="gray.600"
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor="gray.200"
        align={'center'}
        zIndex="overlay"
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          alignItems="center"
          justify={{ base: 'center', md: 'start' }}
        >
          <DefaultLogo display={{ base: 'none', md: 'inline-block' }} />
          <Image
            alt="TaleWeaver icon"
            src={taleweaverIcon}
            height="30px"
            px="1rem"
            display={{ base: 'inline-block', md: 'none' }}
          />

          <Flex display={{ base: 'none', md: 'flex' }} ml={'1rem'}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={4}
        >
          {auth ? (
            <>
              <QueueDisplay />
              <CreditsDisplay />
              <Box fontSize={'sm'} fontWeight={400} textAlign="center">
                <Link to={'/profile'}>
                  <HStack justifyContent="flex-end">
                    <Avatar bg="brand.orange" size="sm" />
                    <VStack alignItems="flex-start" spacing={0}>
                      <Text
                        fontSize="sm"
                        display={{ base: 'none', lg: 'inline-flex' }}
                      >
                        {user?.email}{' '}
                      </Text>
                      <SubscriptionDisplay
                        display={{ base: 'none', md: 'inline-flex' }}
                        size="sm"
                      />
                    </VStack>

                    <Button
                      display={{ base: 'none', md: 'inline-flex' }}
                      fontSize={'sm'}
                      fontWeight={400}
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </HStack>
                </Link>
              </Box>
            </>
          ) : (
            <>
              <Box margin={{ base: 'default', md: 'auto' }}>
                <Link to={'/login'}>
                  <Button
                    _hover={{
                      textDecoration: 'none',
                      color: 'gray.800',
                    }}
                    margin="auto"
                    fontSize={'sm'}
                    fontWeight={400}
                    variant={'link'}
                  >
                    Sign In
                  </Button>
                </Link>
              </Box>
              <Link to={'/register'}>
                <Button
                  display={{ base: 'none', md: 'inline-flex' }}
                  fontSize={'sm'}
                  fontWeight={400}
                  color={'white'}
                  bg={'brand.orange'}
                  _hover={{
                    bg: 'brand.orange80',
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav handleLogout={handleLogout} session={session} onClickLink={onClose}/>
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');

  return (
    <Stack direction={'row'} spacing={4}>
      {pagesData
        .filter(({ mainNav }: routerType) => mainNav)
        .map(({ path, title }: routerType, index) => (
          <Box px="5px" key={title}>
            <Link to={`${path}`} color={linkColor}>
              <Button
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
              >
                {title}
              </Button>
            </Link>
          </Box>
        ))}
    </Stack>
  );
};

const MobileNav = ({ handleLogout, session, onClickLink }: { handleLogout: () => void, session: any, onClickLink: () => void }) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius="10px"
      mt="4rem"
      p={4}
      display={{ md: 'none' }}
      position="fixed"
      zIndex="overlay"
    >
      {pagesData
        .filter(({ mainNav }: routerType) => mainNav)
        .map(({ path, title }: routerType, index) => (
          <MobileNavItem path={path} key={index} mykey={index} title={title} onClick={onClickLink}/>
        ))}
      {session && <Button
        p="1rem"
        variant="solid"
        fontSize={'sm'}
        fontWeight={400}
        onClick={handleLogout}
      >
        Logout
      </Button>}
    </Stack>
  );
};

interface NavItem {
  path: string;
  mykey: number;
  title: string;
  onClick: () => void;
}

const MobileNavItem = ({ path, mykey, title, onClick }: NavItem) => {
  return (
    <Stack key={mykey} spacing={4}>
      <Link
        as="a"
        to={path}
        _hover={{
          textDecoration: 'none',
        }}
        onClick={onClick}
      >
        <Text
          py={2}
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {title}
        </Text>
      </Link>
    </Stack>
  );
};
