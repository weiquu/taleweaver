import React from 'react';
import {
  Button,
  Text,
  Container,
  HStack,
  Image,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  Skeleton,
  Spinner,
  ModalFooter,
  SimpleGrid,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalHeader,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import { useAuth } from '../../../context/AuthProvider';
import NewAvatar from '../NewAvatar';
import AddAvatarButton from './AddAvatarButton';
import placeholderAvatar from '../../../images/placeholder_avatar.png';
import { useAvatars } from '../../../App/hooks/useAvatars';

interface AvatarsGridProps {
  key: number;
  editable: boolean;
  variant: string;
  onSelectAvatar?: (avatar: Avatar) => void;
  selectedAvatar?: Avatar;
}

const AvatarsGrid: React.FC<AvatarsGridProps> = ({
  editable,
  variant,
  onSelectAvatar,
  selectedAvatar,
}) => {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [avatars, setAvatars] = useState();
  const [loadingAvatars, setLoadingAvatars] = useState(true);

  async function avatarsResponseConsumer(status, ok, statusText, data) {
    if (status === 404) {
      setAvatars(null);
      setLoadingAvatars(false);
      return;
    }

    if (!ok) {
      console.log(`Network response was not ok: ${statusText}`);
      setLoadingAvatars(false);
      return null;
    }

    setAvatars(data.avatars);
  }

  function avatarsErrorConsumer(error) {
    console.error('Error fetching avatars:', error);
    setLoadingAvatars(false);
    return null;
  }

  // Note: not use the refetch function, use the refetchAvatars function instead
  const { data: avatarsData, refetch } = useAvatars(user.id, avatarsResponseConsumer, avatarsErrorConsumer);

  async function refetchAvatars() {
    setLoadingAvatars(true);
    await refetch();
    setLoadingAvatars(false);
  }

  useEffect(() => {
    if (!avatarsData) {
      refetchAvatars();
    } else {
      setAvatars(avatarsData.avatars);
      setLoadingAvatars(false);
    }
  }, [user.id]);

  return (
    <>
      {loadingAvatars ? (
        <SimpleGrid columns={3} spacingX="40px" spacingY="20px" p="2rem">
          <Skeleton width="80px" height="80px" />
          <Skeleton width="80px" height="80px" />
          <Skeleton width="80px" height="80px" />
          <Skeleton width="80px" height="80px" />
          <Skeleton width="80px" height="80px" />
          <Skeleton width="80px" height="80px" />
        </SimpleGrid>
      ) : (
        <>
        <SimpleGrid
          columns={{ base: 2, md: 3 }}
          spacingX={{ base: '15px', md: '40px' }}
          spacingY="20px"
          alignItems="center"
          p="2rem"
        >
          {avatars?.map((avatar) => (
            <AvatarCard
              key={avatar.avatarid}
              avatar={avatar}
              refetchAvatars={refetchAvatars}
              editable={editable}
              variant={variant}
              onSelectAvatar={onSelectAvatar}
              isSelected={selectedAvatar?.avatarid === avatar.avatarid}
            />
          ))}
          <AddAvatarButton onClick={onOpen} />
        </SimpleGrid>
        { avatars?.length === 0 &&
        <Container pb="2rem">
          <Text>No avatars created yet! Create one by clicking on the '+' button above.</Text>
        </Container>
        }
        </>
      )}

      <Modal size="4xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent py="2rem">
          <ModalCloseButton />
          <ModalBody>
            <NewAvatar
              refetchAvatars={refetchAvatars}
              closeModal={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export interface Avatar {
  avatarid: number;
  name: string;
  hair_color: string;
  ethnicity: string;
  hairstyle: string;
  age: number;
  gender: string;
  clothing_color: string;
  image: string;
}

export interface AvatarCardProps {
  avatar: Avatar;
  refetchAvatars: () => void;
  editable: boolean;
  variant: string;
  onSelectAvatar?: (avatar: Avatar) => void;
  isSelected: boolean;
}

export const AvatarCard: React.FC<AvatarCardProps> = ({
  avatar,
  refetchAvatars,
  editable,
  variant,
  onSelectAvatar,
  isSelected,
}) => {
  const storageUrl = import.meta.env.VITE_STORAGE_URL;
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCardClick = () => {
    if (onSelectAvatar) {
      onSelectAvatar(avatar);
    }
  };

  const handleDelete = async (avatarid: number) => {
    try {
      setDeleteLoading(true);
      const response = await fetch(`${storageUrl}/avatars/${avatarid}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.log('Network response was not ok');
        return;
      }
      // Avatar deleted successfully
      onClose();
      refetchAvatars();
      setDeleteLoading(false);
    } catch (error) {
      console.error('Error deleting avatar:', error);
      setDeleteLoading(false);
    }
  };

  return (
    <VStack
      maxWidth="150px"
      borderWidth={isSelected ? '2px' : '1px'}
      borderRadius="13px"
      as={'button'}
      className="avatar-card"
      onClick={variant === 'create' ? handleCardClick : onOpen}
      borderColor={isSelected ? 'brand.orange' : 'default'}
    >
      <Image
        borderRadius="10px 10px 0px 0px"
        height="150px"
        objectFit="cover"
        src={avatar.image}
        fallbackSrc={placeholderAvatar}
        alt="Avatar Image"
      />
      <Text fontWeight={600}>{avatar.name}</Text>

      {editable && (
        <Modal size="lg" isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent py="2rem">
            <ModalCloseButton />
            <ModalHeader>
              <HStack justifyContent="space-between">
                <Text>{avatar.name}</Text>
              </HStack>
            </ModalHeader>
            <ModalBody>
              <Image
                borderRadius="10px"
                height="100%"
                src={avatar.image}
                fallbackSrc={placeholderAvatar}
                alt="Avatar Image"
              />
            </ModalBody>

            <ModalFooter>
              <HStack spacing={10}>
                <Button
                  variant="solid"
                  onClick={() => handleDelete(avatar.avatarid)}
                >
                  {deleteLoading ? <Spinner bg="white" /> : 'Delete Avatar'}
                </Button>
                <Button variant="link" onClick={onClose}>
                  Go Back
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </VStack>
  );
};

export default AvatarsGrid;
