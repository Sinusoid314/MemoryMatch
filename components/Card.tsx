import React from "react";
import { Image, Pressable, StyleSheet } from "react-native";


const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    margin: 1
  },
  cardImage: {
    flex: 1,
    width: '100%'
  }
});


const cardBackImage: number = require('@/assets/images/card-back.png');
export const cardFaceImages: number[] = [
  require('@/assets/images/star.png'),
  require('@/assets/images/square.png'),
  require('@/assets/images/circle.png'),
  require('@/assets/images/triangle.png'),
  require('@/assets/images/diamond.png'),
  require('@/assets/images/heart.png')
];


export type CardProps = {
  id: number;
  image: any;
  isFlipped: boolean;
  isSelected: boolean;
  onCardPressCallback: (cardId: number) => void;
};


export default function Card(props: CardProps) {

  const image = props.isFlipped ? props.image : cardBackImage;
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
      <Image source={image} style={styles.cardImage}/>
    </Pressable>
  );
}
