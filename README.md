# react-native-reanimated-confetti

A confetti animation build using [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/).

## Installation

`npm install react-native-reanimated-confetti`

## Usage

```jsx
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useConfetti } from "react-native-reanimated-confetti";

export default function App() {
  const { RenderConfetti, startconfetti } = useConfetti();
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <RenderConfetti />
      <TouchableOpacity onPress={startconfetti}>
        <Text style={styles.text}>press me!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: { color: "#000", fontSize: 16 },
});
```

https://github.com/user-attachments/assets/e0a17369-a872-41cd-9f38-ce20cc14df58

## API

### `useConfetti(options?)`

| Option            | Type     | Default    | Description                  |
| ----------------- | -------- | ---------- | ---------------------------- |
| `particlesAmount` | number   | 200        | Number of confetti particles |
| `colors`          | string[] | See source | Array of confetti colors     |
| `duration`        | number   | 2000       | Animation duration (ms)      |

## Customization

You can pass options to `useConfetti` to customize the animation.

```jsx
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useConfetti } from "./modules";

export default function App() {
  const { RenderConfetti, startconfetti } = useConfetti({
    duration: 3000,
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
    particlesAmount: 300,
  });
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <RenderConfetti
        particleStyle={{
          width: 5,
        }}
      />
      <TouchableOpacity onPress={startconfetti}>
        <Text style={styles.text}>press me!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: { color: "#000", fontSize: 16 },
});
```

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---
