import { Dimensions, Platform } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import Confetti from '../Components/Confetti';
import { type ConfettiProps } from './interface';
import { type StyleProp, type ViewStyle } from 'react-native';

const width = Dimensions.get('window').width;

const DEFAULT_COLORS = ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'];

const getRandomColor = (colors: string[]) => {
  return colors[Math.floor(Math.random() * colors.length)];
};

const generateConfettiData = (
  particlesAmount: number,
  widthProp: number,
  colors: string[],
  mod: number,
  reverse: boolean
) => {
  const data = [];
  for (let i = 0; i < particlesAmount; i++) {
    let startXPosition = mod;
    if (reverse) {
      startXPosition = mod * (i - 1);
      if (startXPosition < 0) startXPosition = 0;
    } else {
      startXPosition = mod * (i + 1);
      if (startXPosition > widthProp) startXPosition = widthProp;
    }
    data.push({
      id: i,
      startXPosition,
      color: getRandomColor(colors),
    });
  }
  return data;
};

const useConfetti = (props?: ConfettiProps) => {
  const {
    duration = 2000,
    particlesAmount = Platform.OS === 'android' ? 80 : 200,
    colors = DEFAULT_COLORS,
  } = props || {};

  const [isPlaying, setISPlaying] = React.useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reverseRef = useRef(false);

  useEffect(() => {
    if (isPlaying) {
      timeoutRef.current = setTimeout(() => {
        setISPlaying(false);
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, duration]);

  const startconfetti = useCallback(() => {
    setISPlaying(true);
  }, []);

  const mod = useMemo(
    () =>
      Math.floor(width / (particlesAmount < width ? particlesAmount : width)),
    [particlesAmount]
  );

  const confettiData = useMemo(
    () =>
      generateConfettiData(
        particlesAmount,
        width,
        colors,
        mod,
        reverseRef.current
      ),
    [particlesAmount, colors, mod]
  );

  const RenderConfetti = useCallback(
    ({ particleStyle }: { particleStyle?: StyleProp<ViewStyle> }) => {
      return (
        <>
          {confettiData.map(({ id, startXPosition, color }) => (
            <Confetti
              key={`confetti-${id}`}
              color={color}
              startXPosition={startXPosition}
              isPlaying={isPlaying}
              duration={duration}
              particleStyle={particleStyle}
            />
          ))}
        </>
      );
    },
    [isPlaying, duration, confettiData]
  );

  return { RenderConfetti, startconfetti, isPlaying };
};

export default useConfetti;
