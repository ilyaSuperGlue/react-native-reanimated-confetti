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
