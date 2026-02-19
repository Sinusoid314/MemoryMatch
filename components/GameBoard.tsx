import Card from "@/components/Card";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  gameBoard: {
    backgroundColor: 'lightbrown',
    borderStyle: 'solid'
  }
});

type CardData = {
  id: number;
  color: any;
  isFlipped: boolean;
};

const cardColors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];

const createCardDeck = () => {
  const newCardDeck: CardData[] = [];

  cardColors.forEach((color) => {
    newCardDeck.push({id: newCardDeck.length, color: color, isFlipped: false});
    newCardDeck.push({id: newCardDeck.length, color: color, isFlipped: false});
  });

  return newCardDeck.sort(() => Math.random() - 0.5);
};

export default function GameBoard() {
  const [cardDeck, updateCardDeck] = useState(createCardDeck);

  const selectCard = (cardId: number) => {
    updateCardDeck(
      cardDeck.map(card => {
        if(card.id === cardId) 
          return { ...card, isFlipped: !card.isFlipped};
        else
          return card;
      })
    );
  }

  return (
    <View style={styles.gameBoard}>
      {cardDeck.map((card) => (
        <Card
          id={card.id}
          color={card.color}
          isFlipped={card.isFlipped}
          selectCardCallback={selectCard}
        />
      ))}
    </View>
  );
}