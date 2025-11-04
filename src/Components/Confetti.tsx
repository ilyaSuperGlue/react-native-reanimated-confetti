import {
  Dimensions,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useCallback, useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { height } = Dimensions.get('window');

const maximuxXOffset = 30;

interface ConfettiProps {
  color?: string;
  startXPosition: number;
  isPlaying: boolean;
  duration?: number;
  particleStyle?: StyleProp<ViewStyle>;
}
const Confetti = ({
  color,
  startXPosition,
  isPlaying,
  duration = 2000,
  particleStyle,
}: ConfettiProps) => {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(startXPosition);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      {
        // give a wavy effect on X axis
        skewX: `${Math.sin(translateY.value / 10) * 15}deg`,
      },
      {
        // give a rotation effect
        rotateZ: `${translateY.value + translateX.value}deg`,
      },
      {
        // give a wavy effect on Y axis
        skewY: `${Math.cos(translateY.value / 10) * 15}deg`,
      },
      {
        // hide particles when not playing
        scale: isPlaying ? 1 : 0,
      },
    ],
  }));

  const randomize = useCallback((width: number): number[] => {
    const positions = [];
    for (let i = 0; i < 6; i++) {
      const randomOffset =
        Math.random() * maximuxXOffset * (Math.random() < 0.5 ? -1 : 1);
      let newPosition = width + randomOffset;
      if (newPosition < 0) newPosition = 0;
      if (newPosition > Dimensions.get('window').width)
        newPosition = Dimensions.get('window').width;
      positions.push(newPosition);
    }
    return positions;
  }, []);

  const fallingAnimation = useCallback(() => {
    // Falling down
    translateY.value = withDelay(
      Math.random() * duration,
      withTiming(height + 100, {
        duration,
        easing: Easing.linear,
      })
    );

    //random left right movement
    const randomX = randomize(startXPosition);
    translateX.value = withDelay(
      Math.random() * duration,
      withSequence(
        ...randomX.map((pos) =>
          withTiming(pos, {
            duration: duration / randomX.length,
          })
        )
      )
    );
  }, [duration, randomize, startXPosition, translateX, translateY]);

  useEffect(() => {
    if (isPlaying) {
      fallingAnimation();
    } else {
      translateY.value = 0;
      translateX.value = 0;
    }
  }, [isPlaying, fallingAnimation, translateX, translateY]);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: color,
          left: startXPosition,
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
    width: Math.random() * 10 + 10,
    aspectRatio: Math.random() * 1 + 1,
    position: 'absolute',
    top: 0,
    zIndex: 1000,
  },
});
