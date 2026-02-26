import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 2,
    margin: 5
  }
});

export type CardProps = {
  id: number;
  color: any;
  isFlipped: boolean;
  isSelected: boolean;
  onCardPressCallback: (cardId: number) => void;
};

export default function Card(props: CardProps) {

  const color = props.isFlipped ? props.color : 'white';
  const borderColor = props.isSelected ? 'aqua' : 'white';
  const onPress = !props.isFlipped ? onPressHandler : undefined;

  function onPressHandler() {
    props.onCardPressCallback(props.id);
  }

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.card, {backgroundColor: color}, {borderColor: borderColor}]}>
        <Text>Card</Text>
      </View>
    </Pressable>
  );
}