import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'papayawhip',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: 'darkblue'
  }
});

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, world!</Text>
    </View>
  );
}
