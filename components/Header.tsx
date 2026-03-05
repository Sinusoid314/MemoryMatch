import { Pressable, StyleSheet, Text, View } from "react-native";


type HeaderProps = {
  tryCount: number;
  onNewGamePressCallback: () => void;
};


export default function Header(props: HeaderProps) {
  return (
    <View style={[styles.header, styles.buttonFace, styles.buttonFaceReleased]}>
        <Text style={[styles.buttonFace, styles.buttonFacePressed]}>
          <Text style={styles.text}>Tries: {props.tryCount}</Text>
        </Text>
        <Pressable
          onPress={() => props.onNewGamePressCallback()}
          style={({pressed}) => [styles.buttonFace, (pressed ? styles.buttonFacePressed : styles.buttonFaceReleased)]}
        >
          <Text style={styles.text}>New Game</Text>
        </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  buttonFace: {
    backgroundColor: "lightgray",
    padding: 6
  },
  buttonFaceReleased: {
    borderBottomColor: 'gray', borderBottomWidth: 1,
    borderRightColor: 'gray', borderRightWidth: 1,
    borderTopColor: 'white', borderTopWidth: 1,
    borderLeftColor: 'white', borderLeftWidth: 1
  },
  buttonFacePressed: {
    borderBottomColor: 'white', borderBottomWidth: 1,
    borderRightColor: 'white', borderRightWidth: 1,
    borderTopColor: 'gray', borderTopWidth: 1,
    borderLeftColor: 'gray', borderLeftWidth: 1
  },
  text: {
    fontFamily: 'monospace',
    fontSize: 16
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBlock: 5,
    paddingInline: '10%'
  }
});