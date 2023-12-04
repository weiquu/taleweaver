import {
  Box,
  Flex,
  ButtonGroup,
  Container,
  Divider,
  IconButton,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import {
  FaBehance,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa';
import { WhiteLogo } from '../../WhiteLogo';

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

const Footer = () => {
  return (
    <Flex
      flexDirection="column"
      bg="rgb(226, 88, 18)"
      color="#eeeeee"
      width="100%"
    >
      <Divider />
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 2fr' }}
          spacing={8}
        >
          <Stack spacing={6}>
            <WhiteLogo />
            <Text fontSize={'sm'}>
              © {new Date().getFullYear()} TaleWeaver. All rights reserved.
            </Text>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Links</ListHeader>
            <Link href={'/'}>Home</Link>
            <Link href={'/create'}>Create Story</Link>
            <Link href={'/my-library'}>My Library</Link>
            <Link href={'/public-library'}>Gallery</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Information</ListHeader>

            <Link href={'/privacy'}>Privacy Policy</Link>
          </Stack>
          <ButtonGroup variant="ghost">
            <IconButton
              as="a"
              href="https://www.linkedin.com/company/taleweaver/"
              aria-label="LinkedIn"
              target="_blank"
              icon={<FaLinkedin fontSize="1.25rem" />}
              color="white"
              _hover={{ bgColor: '#333333' }}
            />
            {/* <IconButton
              as="a"
              href="http://github.com/joshenx/TaleWeaver"
              aria-label="GitHub"
              target="_blank"
              icon={<FaGithub fontSize="1.25rem" />}
              color="white"
              _hover={{ bgColor: '#333333' }}
            /> */}
            <IconButton
              as="a"
              href="http://instagram.com/taleweaver.app"
              aria-label="Instagram"
              target="_blank"
              icon={<FaInstagram fontSize="1.25rem" />}
              color="white"
              _hover={{ bgColor: '#333333' }}
            />
            <IconButton
              as="a"
              href="https://www.facebook.com/profile.php?id=61552834593132"
              aria-label="Facebook"
              target="_blank"
              icon={<FaFacebook fontSize="1.25rem" />}
              color="white"
              _hover={{ bgColor: '#333333' }}
            />
          </ButtonGroup>
        </SimpleGrid>
      </Container>
    </Flex>
  );
};

export default Footer;
