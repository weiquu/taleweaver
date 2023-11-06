import { Button, Image } from '@chakra-ui/react';
import React from 'react';
import avatarButton from '../../../../images/add-avatar-button.svg';

interface AddAvatarButtonProps {
  onClick: () => void;
}

const AddAvatarButton: React.FC<AddAvatarButtonProps> = ({ onClick }) => {
  return (
    <Button
      width="fit-content"
      height="fit-content"
      background="transparent"
      _hover={{
        background: 'transparent',
        transform: 'scale(1.05)', // This makes the button become a bit bigger on hover
        opacity: 1, // Full opacity on hover
      }}
      _active={{
        background: 'transparent',
      }}
      onClick={onClick}
      padding="1rem"
      transition="0.3s" // Smooth transition effect
      opacity={0.6} // Initial opacity set to 80%
    >
      <Image src={avatarButton} height="100px" alt="Add Avatar" />
    </Button>
  );
};

export default AddAvatarButton;
