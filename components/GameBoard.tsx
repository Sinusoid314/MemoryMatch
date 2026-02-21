import type { CardProps } from "@/components/Card";
import Card from "@/components/Card";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  gameBoard: {
    backgroundColor: 'lightbrown',
    borderStyle: 'solid'
  }
});

const cardColors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];

export default function GameBoard() {
  const [cardDeck, updateCardDeck] = useState(createCardDeck);

  function createCardDeck() {
    const newCardDeck: CardProps[] = [];

    cardColors.forEach((color) => {
      newCardDeck.push({id: newCardDeck.length, color: color, isFlipped: false, selectCardCallback: selectCard});
      newCardDeck.push({id: newCardDeck.length, color: color, isFlipped: false, selectCardCallback: selectCard});
    });

    return newCardDeck.sort(() => Math.random() - 0.5);
  };

  function selectCard(cardId: number) {
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
        <Card {...card} />
      ))}
    </View>
  );
}