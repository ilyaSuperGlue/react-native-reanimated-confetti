import { StyleProp, ViewStyle } from "react-native";

/**
 * Props for the Confetti hook
 * @interface ConfettiProps
 * @property {number} [duration] - duration of the confetti animation in milliseconds (default: 2000)
 * @property {string[]} [colors] - array of colors for the confetti particles (default: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'])
 * @property {number} [particlesAmount] - number of confetti particles to be rendered (default: 200)
 */
export interface ConfettiProps {
  duration?: number;
  colors?: string[];
  particlesAmount?: number;
}
