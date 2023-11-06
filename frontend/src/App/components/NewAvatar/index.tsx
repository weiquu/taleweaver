import {
  Button,
  Box,
  Stack,
  Spinner,
  Heading,
  Input,
  HStack,
  Image,
  Skeleton,
  VStack,
  Select,
  Alert,
  Text,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useAuth } from '../../../context/AuthProvider';
import { useState, useEffect } from 'react';
import placeholderAvatar from '../../../images/placeholder_avatar.png';

interface AvatarCustomisationComponentProps {
  fetchAvatars: () => void; // Specify the type of fetchAvatars function
  closeModal: () => void; // Specify the type of closeModal function
}

const AvatarCustomisationComponent: React.FC<
  AvatarCustomisationComponentProps
> = ({ fetchAvatars, closeModal }) => {
  const { user } = useAuth();
  const genapiUrl = import.meta.env.VITE_GENAPI_URL;
  const storageUrl = import.meta.env.VITE_STORAGE_URL;

  const clothingColors = [
    'Red',
    'Orange',
    'Yellow',
    'Blue',
    'Green',
    'Purple',
    'Pink',
    'Black',
    'White',
  ];

  const [avatarName, setAvatarName] = useState('');
  const [hairColor, setHairColor] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [hairstyle, setHairstyle] = useState('');
  const [age, setAge] = useState(1);
  const [gender, setGender] = useState('');
  const [favoriteClothingColor, setFavoriteClothingColor] = useState('');
  const [avatarImage, setAvatarImage] = useState({});

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Notification Handling
  const {
    isOpen: isError,
    onClose: onErrorClose,
    onOpen: onErrorOpen,
  } = useDisclosure({ defaultIsOpen: false });

  const {
    isOpen: isSuccess,
    onClose: onSuccessClose,
    onOpen: onSuccessOpen,
  } = useDisclosure({ defaultIsOpen: false });

  const validateInputs = () => {
    if (
      !avatarImage ||
      !avatarName ||
      !hairColor ||
      !ethnicity ||
      !hairstyle ||
      !age ||
      !gender ||
      !favoriteClothingColor
    ) {
      onErrorOpen();
      return false;
    }
    return true;
  };

  const validateImageInputs = () => {
    if (
      !hairColor ||
      !ethnicity ||
      !hairstyle ||
      !age ||
      !gender ||
      !favoriteClothingColor
    ) {
      onErrorOpen();
      return false;
    }
    return true;
  };

  const addAvatar = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      setSubmitLoading(true);
      const response = await fetch(`${storageUrl}/avatars/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          avatar_data: {
            avatarImage: avatarImage,
            avatarName: avatarName,
            hairColor: hairColor,
            ethnicity: ethnicity,
            hairstyle: hairstyle,
            age: age,
            gender: gender,
            favoriteClothingColor: favoriteClothingColor,
          },
        }),
      });
      if (!response.ok) {
        console.log(`Network response was not ok: ${response.statusText}`);
        setSubmitLoading(false);
        return;
      }
      // Avatar added successfully
      console.log('Avatar added successfully');
      fetchAvatars();
      onSuccessOpen();
      closeModal();
      setSubmitLoading(false);
    } catch (error) {
      console.error('Error adding avatar:', error);
      setSubmitLoading(false);
    }
  };

  const getAvatarImage = async () => {
    if (!validateImageInputs()) {
      return;
    }

    try {
      setAvatarLoading(true);
      const avatarDescription = `${age} year old ${ethnicity} ${gender} with ${hairColor} ${hairstyle} hair, wearing ${favoriteClothingColor} clothes`;
      console.log(avatarDescription);
      const imageResponse = await fetch(`${genapiUrl}/generate-avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: avatarDescription,
        }),
      });

      if (!imageResponse.ok) {
        console.log('Failed to generate avatar.');
        setAvatarLoading(false);
        return;
      }

      let image = await imageResponse.json();
      image = JSON.parse(image);
      setAvatarImage(image['image']);
      setAvatarLoading(false);
    } catch (error) {
      console.error('Error generating image:', error);
      setAvatarLoading(false);
    }
  };

  return (
    <VStack spacing={5}>
      <Heading as="h2" size="xl">
        Create Avatar
      </Heading>
      <InstructionComponent
        number={1}
        text="Fill in the descriptors of your avatar!"
      />
      <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
        <VStack order={{ base: '2', md: '1' }} spacing={4} align="center">
          <Select
            placeholder="Hair Color"
            width="280px"
            height="40px"
            borderRadius="48px"
            value={hairColor}
            onChange={(e) => setHairColor(e.target.value)}
          >
            <option value="black">Black Hair</option>
            <option value="brown">Brown Hair</option>
            <option value="blonde">Blonde Hair</option>
            {/* Add more hair color options */}
          </Select>
          <Select
            placeholder="Ethnicity"
            width="280px"
            height="40px"
            borderRadius="48px"
            value={ethnicity}
            onChange={(e) => setEthnicity(e.target.value)}
          >
            <option value="indian">Indian</option>
            <option value="malay">Malay</option>
            <option value="chinese">Chinese</option>
            <option value="white">White</option>
            <option value="hispanic">Hispanic</option>
            <option value="black">Black</option>
            {/* Add more ethnicity options */}
          </Select>
          <Select
            placeholder="Hairstyle"
            width="280px"
            height="40px"
            borderRadius="48px"
            value={hairstyle}
            onChange={(e) => setHairstyle(e.target.value)}
          >
            <option value="straight">Straight Hair</option>
            <option value="wavy">Wavy Hair</option>
            <option value="curly">Curly Hair</option>
            {/* Add more hairstyle options */}
          </Select>
        </VStack>
        <VStack pb="1rem" order={{ base: '1', md: '2' }} spacing={4}>
          {avatarLoading ? (
            <Skeleton height="170px" width="170px" />
          ) : (
            <Image
              height="170px"
              src={avatarImage}
              fallbackSrc={placeholderAvatar}
              alt="Avatar Image"
            />
          )}
        </VStack>
        <VStack order="3" spacing={4} align="center">
          <Select
            placeholder="Age"
            width="280px"
            height="40px"
            borderRadius="48px"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          >
            {Array.from({ length: 10 }, (_, index) => (
              <option key={index} value={index + 1}>
                {index + 1} years old
              </option>
            ))}
          </Select>
          <Select
            placeholder="Gender"
            width="280px"
            height="40px"
            borderRadius="48px"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="boy">Boy</option>
            <option value="girl">Girl</option>
            {/* Add more gender options */}
          </Select>
          <HStack width="280px">
            <Box
              width="40px"
              height="40px"
              borderRadius="10px"
              borderWidth="1px"
              bg={favoriteClothingColor}
              transition="background-color 0.3s ease-in-out"
            />
            <Select
              placeholder="Favorite Clothing Color"
              width="240px"
              height="40px"
              borderRadius="48px"
              value={favoriteClothingColor}
              onChange={(e) => setFavoriteClothingColor(e.target.value)}
            >
              {clothingColors.map((color) => (
                <option key={color} value={`${color}`}>
                  {`${color} Clothes`}
                </option>
              ))}
            </Select>
          </HStack>
          <VStack display={{ base: 'inherit', md: 'none' }}>
            <InstructionComponent
              number={2}
              text="Generate an avatar that will appear in your stories!"
            />
            <Button onClick={getAvatarImage}>
              {avatarLoading ? <Spinner /> : 'Generate Avatar'}
            </Button>
          </VStack>
        </VStack>
      </Stack>
      <VStack display={{ base: 'none', md: 'inherit' }}>
        <InstructionComponent
          number={2}
          text="Generate an avatar that will appear in your stories!"
        />
        <Button onClick={getAvatarImage}>
          {avatarLoading ? <Spinner /> : 'Generate Avatar'}
        </Button>
      </VStack>
      <InstructionComponent number={3} text="Enter a name for your avatar!" />
      <Input
        maxWidth="500px"
        height="60px"
        borderRadius="48px"
        type="text"
        textAlign={'center'}
        placeholder="Enter your Avatar's name"
        value={avatarName}
        onChange={(e) => setAvatarName(e.target.value)}
      />
      <HStack spacing={10}>
        <Button variant="styled-color" onClick={addAvatar}>
          {submitLoading ? <Spinner /> : 'Create Avatar'}
        </Button>
        <Button variant="link" onClick={closeModal}>
          Go Back
        </Button>
      </HStack>

      {isError && (
        <Alert status="error" justifyContent="space-between" mt={4}>
          <HStack>
            <AlertIcon />
            <AlertTitle mr={2}>Oopsie!</AlertTitle>
            <AlertDescription>
              Please fill in all input fields.
            </AlertDescription>
          </HStack>
          <CloseButton onClick={onErrorClose} />
        </Alert>
      )}
      {isSuccess && (
        <Alert status="success" justifyContent="space-between" mt={4}>
          <HStack>
            <AlertIcon />
            <AlertTitle mr={2}>Success!</AlertTitle>
            <AlertDescription>We did it!</AlertDescription>
          </HStack>
          <CloseButton onClick={onSuccessClose} />
        </Alert>
      )}
    </VStack>
  );
};

interface InstructionProps {
  number: number;
  text: string;
}

const InstructionComponent: React.FC<InstructionProps> = ({ number, text }) => {
  return (
    <HStack>
      <Box
        bg="brand.orange"
        opacity="80%"
        color="white"
        h="16px"
        w="16px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="50%"
        fontWeight={500}
      >
        <Text fontSize="xs">{number}</Text>
      </Box>
      <Text fontSize="xs" color="brand.orange80">
        {text}
      </Text>
    </HStack>
  );
};

export default AvatarCustomisationComponent;
