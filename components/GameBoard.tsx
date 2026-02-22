import type { CardProps } from "@/components/Card";
import Card from "@/components/Card";
import { useEffect, useState } from "react";
import { FlatList, ListRenderItem, ListRenderItemInfo, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  gameBoard: {
    flex: 1,
    backgroundColor: 'lightbrown',
    borderStyle: 'solid'
  }
});

const cardColors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
let isPaused: boolean = false;
let pauseTimeoutId: number = 0;

export default function GameBoard() {
  const [cardDeck, updateCardDeck] = useState(createCardDeck);

  function createCardDeck() {
    const newCardDeck: CardProps[] = [];

    cardColors.forEach((color) => {
      newCardDeck.push({id: newCardDeck.length, color: color, isFlipped: false, selectCardCallback: selectCard});
      newCardDeck.push({id: newCardDeck.length, color: color, isFlipped: false, selectCardCallback: selectCard});
    });

    return newCardDeck.toSorted(() => Math.random() - 0.5);
  };

  function selectCard(cardId: number) {
    if(isPaused)
      return;

    flipCards([cardId]);
    isPaused = true;

    pauseTimeoutId = setTimeout(() => {
      flipCards([cardId]);
      isPaused = false;
    }, 2000);
  }

  function flipCards(cardIds: number[]) {
    updateCardDeck(oldCardDeck => 
      oldCardDeck.map(card => {
        if(cardIds.includes(card.id))
          return {...card, isFlipped: !card.isFlipped};
        else
          return card;
      })
    );
  }

  useEffect(() => {
    return () => clearTimeout(pauseTimeoutId);
  }, []);

  const cardRenderItem: ListRenderItem<CardProps> = ({item: card}: ListRenderItemInfo<CardProps>) => (
    <Card {...card} />
  );

  return (
    <View style={styles.gameBoard}>
      <FlatList
        data={cardDeck}
        renderItem={cardRenderItem}
        keyExtractor={(card: CardProps) => String(card.id)}
        numColumns={3}
      />
    </View>
  );

/*
  return (
    <View style={styles.gameBoard}>
      {cardDeck.map(card => (
        <Card key={card.id} {...card} />
      ))}
    </View>
  );
*/
}