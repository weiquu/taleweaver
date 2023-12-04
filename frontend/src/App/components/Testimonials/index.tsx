import {
  VStack,
  Avatar,
  Box,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Testimonials() {
  return (
    <Box width="100vw" m={0}>
      <Stack
        py={16}
        px={8}
        spacing={{ base: 8, md: 10 }}
        align={'center'}
        direction={'column'}
      >
        <VStack spacing={2} textAlign="center" py="1rem">
          <Text fontSize="4xl" fontWeight="600">
            Parents love us!
          </Text>
          <Text fontSize="lg" color={'gray.500'}>
            See why 50+ parents use TaleWeaver to create the most immersive
            experiences for their children!
          </Text>
        </VStack>
        <VStack
          borderRadius="1rem"
          p="2rem"
          boxShadow="0px 5px 20px rgba(0, 0, 0, 0.1)"
          spacing={10}
          transition="transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out"
          _hover={{
            transform: 'rotate(0.1deg) scale(1.05)',
            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
            zIndex: '1',
          }}
        >
          <Text
            fontSize={{ base: 'xl', md: '2xl' }}
            textAlign={'center'}
            maxW={'3xl'}
          >
            A great platform which was easy to use! My daughter and I had so
            much fun not only reading the many fun stories, but also enjoyed
            creating them together! Definitely would recommend!
          </Text>
          <Box textAlign={'center'}>
            <Avatar
              name="Samantha L"
              src="https://static.vecteezy.com/system/resources/previews/008/085/781/non_2x/female-portrait-lady-profile-with-beautiful-long-hair-young-woman-face-beauty-salon-illustration-good-for-avatar-vector.jpg"
              mb={2}
            />

            <Text fontWeight={600}>Samantha L</Text>
            <Text
              fontSize={'sm'}
              color={useColorModeValue('gray.400', 'gray.400')}
            >
              Mother of 2-y.o. girl
            </Text>
          </Box>
        </VStack>
      </Stack>
    </Box>
  );
}
