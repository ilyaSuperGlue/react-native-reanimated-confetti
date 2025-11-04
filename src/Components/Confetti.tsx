import {
  Dimensions,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { height, width } = Dimensions.get('window');
const MAX_X_OFFSET = 30;

interface ConfettiProps {
  color?: string;
  startXPosition: number;
  isPlaying: boolean;
  duration?: number;
  particleStyle?: StyleProp<ViewStyle>;
}

const generateRandomPositions = (
  startPos: number,
  maxOffset: number,
  widthProp: number,
  count: number = 6
): number[] => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const randomOffset =
      Math.random() * maxOffset * (Math.random() < 0.5 ? -1 : 1);
    let newPosition = startPos + randomOffset;
    if (newPosition < 0) newPosition = 0;
    if (newPosition > widthProp) newPosition = widthProp;
    positions.push(newPosition);
  }
  return positions;
};

const Confetti = ({
  color,
  startXPosition,
  isPlaying,
  duration = 2000,
  particleStyle,
}: ConfettiProps) => {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(startXPosition);
  const animationRef = useRef(false);

  const skewYThreshold = useRef(Math.random() * 100 + 50).current;
  const skewXThreshold = useRef(Math.random() * 100 + 50).current;
  const rotateZThreshold = useRef(Math.random() * 100 + 50).current;

  const prevSkewX = useSharedValue(0);
  const prevSkewY = useSharedValue(0);
  const prevRotateZ = useSharedValue(0);

  const randomPositions = useMemo(
    () => generateRandomPositions(startXPosition, MAX_X_OFFSET, width),
    [startXPosition]
  );

  const particleDimensions = useMemo(
    () => ({
      width: Math.random() * 10 + 10,
      aspectRatio: Math.random() * 1 + 1,
    }),
    []
  );

  const animatedStyle = useAnimatedStyle(() => {
    const y = translateY.value;
    const x = translateX.value;

    const normalizedSkewY = Math.floor(y / skewYThreshold) * skewYThreshold;
    const normalizedSkewX = Math.floor(x / skewXThreshold) * skewXThreshold;
    const normalizedRotateZ =
      Math.floor((y + x) / rotateZThreshold) * rotateZThreshold;

    const yNorm = normalizedSkewY / 10;
    const xNorm = normalizedSkewX / 10;

    const newSkewX = Math.sin(yNorm) * 15;
    const newSkewY = Math.cos(xNorm) * 15;
    const newRotateZ = normalizedRotateZ;

    if (newSkewX !== prevSkewX.value) prevSkewX.value = newSkewX;
    if (newSkewY !== prevSkewY.value) prevSkewY.value = newSkewY;
    if (newRotateZ !== prevRotateZ.value) prevRotateZ.value = newRotateZ;

    return {
      transform: [
        { translateY: y },
        { translateX: x },
        { skewX: `${prevSkewX.value}deg` },
        { rotateZ: `${prevRotateZ.value}deg` },
        { skewY: `${prevSkewY.value}deg` },
        {
          scale: isPlaying ? 1 : withTiming(0, { duration: 500 }),
        },
      ],
    };
  });

  const fallingAnimation = useCallback(() => {
    if (animationRef.current) return;
    animationRef.current = true;

    // Falling down
    translateY.value = withDelay(
      Math.random() * duration,
      withTiming(height + 100, {
        duration,
        easing: Easing.linear,
      })
    );

    // Random left right movement
    translateX.value = withDelay(
      Math.random() * duration,
      withSequence(
        ...randomPositions.map((pos) =>
          withTiming(pos, {
            duration: duration / randomPositions.length,
          })
        )
      )
    );
  }, [duration, randomPositions, translateX, translateY]);

  const resetAnimation = useCallback(() => {
    animationRef.current = false;
    translateY.value = -100;
    translateX.value = startXPosition;
    prevSkewX.value = 0;
    prevSkewY.value = 0;
    prevRotateZ.value = 0;
  }, [
    startXPosition,
    translateX,
    translateY,
    prevSkewX,
    prevSkewY,
    prevRotateZ,
  ]);

  useEffect(() => {
    if (isPlaying) {
      fallingAnimation();
    } else {
      resetAnimation();
    }
  }, [isPlaying, fallingAnimation, resetAnimation]);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: color,
          left: startXPosition,
          ...particleDimensions,
        },
        particleStyle,
        styles.confettiFlake,
        animatedStyle,
      ]}
    />
  );
};

export default Confetti;

const styles = StyleSheet.create({
  confettiFlake: {
    position: 'absolute',
    top: 0,
    zIndex: 1000,
  },
});
