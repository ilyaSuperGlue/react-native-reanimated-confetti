import { Dimensions, Platform } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import Confetti from '../Components/Confetti';
import { type ConfettiProps } from './interface';
import { type StyleProp, type ViewStyle } from 'react-native';

const width = Dimensions.get('window').width;

const default_colors = ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'];
const getRandomColor = (colors: string[]) => {
  return colors[Math.floor(Math.random() * colors.length)];
};

const useConfetti = (props?: ConfettiProps) => {
  const {
    duration = 2000,
    particlesAmount = Platform.OS === 'android' ? 80 : 150,
    colors = default_colors,
  } = props || {};

  const [isPlaying, setISPlaying] = React.useState(false);

  useEffect(() => {
    if (isPlaying) {
      setTimeout(() => {
        setISPlaying(false);
      }, duration * 2);
    }
  }, [isPlaying, duration]);

  const startconfetti = useCallback(() => {
    setISPlaying(true);
  }, []);
  const reverse = useRef(false);

  const mod = useMemo(
    () =>
      Math.floor(width / (particlesAmount < width ? particlesAmount : width)),
    [particlesAmount]
  );

  const RenderConfetti = useCallback(
    ({ particleStyle }: { particleStyle?: StyleProp<ViewStyle> }) => {
      if (!isPlaying) return null;
      return (
        <>
          {Array.from({ length: particlesAmount }).map((_, index) => {
            let startXPosition = mod;
            if (reverse.current) {
              // Going left
              // 0 <---- x
              startXPosition = mod * (index - 1);
              if (startXPosition < 0) {
                startXPosition = 0;
                reverse.current = false;
              }
            } else {
              // Going right
              // 0 ----> x
              startXPosition = mod * (index + 1);
              if (startXPosition > width) {
                startXPosition = width;
                reverse.current = true;
              }
            }

            return (
              <Confetti
                key={'conffeti-item' + index}
                color={getRandomColor(colors)}
                startXPosition={startXPosition}
                isPlaying={isPlaying}
                duration={duration}
                particleStyle={particleStyle}
              />
            );
          })}
        </>
      );
    },
    [isPlaying, duration, particlesAmount, mod, colors]
  );

  return { RenderConfetti, startconfetti };
};

export default useConfetti;
