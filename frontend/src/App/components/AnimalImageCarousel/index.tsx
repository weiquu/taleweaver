import React, { useRef, useState } from 'react';
import { animalImages } from '../../../images/animal_images/index';
import { animalSounds } from '../../../audio/animal_sounds/index';

const animalImagesAndSounds = animalImages.map((image, index) => {
  return {
    image: image,
    sound: animalSounds[index],
  };
});

const AnimalImageCarousel = () => {
  const audioRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [moveLeft, setMoveLeft] = useState(true);
  const [animalImageSrc, setAnimalImageSrc] = useState(
    animalImagesAndSounds[0].image,
  );
  const [animalSoundSrc, setAnimalSoundSrc] = useState(
    animalImagesAndSounds[0].sound,
  );
  const [animalIndex, setAnimalIndex] = useState(0);

  const startMovingAnimal = () => {
    setAnimalImageSrc(animalImagesAndSounds[animalIndex].image);
    setAnimalSoundSrc(animalImagesAndSounds[animalIndex].sound);
    audioRef.current.load();
    setAnimalIndex((animalIndex + 1) % animalImagesAndSounds.length);
  };

  const handleAnimalAnimationEnded = () => {
    setMoveLeft(!moveLeft);
    startMovingAnimal();
  };

  const handleAnimalSoundEnded = () => {
    setIsPlaying(false);
  };

  const toggleAnimalSound = () => {
    if (!isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={'moving-image-container'}>
      <img
        className={'animal-image ' + (moveLeft ? 'slideLeft' : 'slideRight')}
        draggable="false"
        src={animalImageSrc}
        alt="animal image"
        onClick={toggleAnimalSound}
        onAnimationEnd={handleAnimalAnimationEnded}
      />
      <audio ref={audioRef} onEnded={handleAnimalSoundEnded}>
        <source src={animalSoundSrc} type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default AnimalImageCarousel;
