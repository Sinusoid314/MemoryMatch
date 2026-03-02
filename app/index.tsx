import GameBoard from "@/components/GameBoard";
import { StyleSheet, View } from "react-native";


export default function Index() {
  return (
    <View style={styles.container}>
      <GameBoard/>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
