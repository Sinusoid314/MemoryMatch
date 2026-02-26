import React from "react";
import { Image, Pressable, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    margin: 5
  },
  cardImage: {
  }
});

export type CardProps = {
  id: number;
  image: any;
  isFlipped: boolean;
  isSelected: boolean;
  onCardPressCallback: (cardId: number) => void;
};

export default function Card(props: CardProps) {

  const image = props.isFlipped ? props.image : require('@/assets/images/card-back.png');
  const borderColor = props.isSelected ? 'aqua' : 'white';
  //const onPress = !props.isFlipped ? onPressHandler : undefined;

  function onPressHandler() {
    props.onCardPressCallback(props.id);
  }

  return (
    <Pressable
      onPress={onPressHandler}
      disabled={props.isFlipped}
      style={[styles.card, {borderColor: borderColor}]}
    >
      <Image source={image} style={styles.card}/>
    </Pressable>
  );
}