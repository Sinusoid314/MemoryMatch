import { Button, StyleSheet, Text, View } from "react-native";


type HeaderProps = {
  tryCount: number;
  onNewGamePressCallback: () => void;
};


export default function Header(props: HeaderProps) {
  return (
    <View style={styles.header}>
        <Text style={styles.tryCount}>Tries: {props.tryCount}</Text>
        <Button
          title="New Game"
          onPress={() => props.onNewGamePressCallback()}
        />
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingInline: 5, 
    backgroundColor: "lightgray"
  },
  tryCount: {

  }
});