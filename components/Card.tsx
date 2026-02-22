import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderStyle: 'solid',
    margin: 5
  }
});

export type CardProps = {
  id: number;
  color: any;
  isFlipped: boolean;
  selectCardCallback: (cardId: number) => void;
};

export default function Card(props: CardProps) {

  const color = props.isFlipped ? props.color : 'white';

  function onPressHandler() {
    props.selectCardCallback(props.id);
  };

  return (
    <View style={[styles.card, {backgroundColor: color}]}>
      <Pressable onPress={onPressHandler}>
        <Text>{props.id}</Text>
        <Text>{String(props.isFlipped)}</Text>
      </Pressable>
    </View>
  );
}