import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  card: {
    borderStyle: 'solid'
  }
});

type CardProps = {
  id: number;
  color: any;
  isFlipped: boolean;
  selectCardCallback: (cardId: number) => void;
};

export default function Card(props: CardProps) {

  const color = props.isFlipped ? props.color : 'white';

  const onPressHandler = () => {
    props.selectCardCallback(props.id);
  };

  return (
    <View style={[styles.card, {backgroundColor: color}]}>
      <Pressable onPress={onPressHandler}>
        Card
      </Pressable>
    </View>
  );
}