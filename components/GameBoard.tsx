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
const selectionsPerTry = 2;
const pauseDuration = 1500;
let isPaused = false;
let pauseTimeoutId: number = 0;

export default function GameBoard() {
  const [cardDeck, updateCardDeck] = useState(createCardDeck);
  const [selectedCardIds, setSelectedCardIds] = useState([]);
  //const [isPaused, setIsPaused] = useState(false);

  function createCardDeck() {
    const newCardDeck: CardProps[] = [];

    cardColors.forEach((color) => {
      for(let n = 0; n < selectionsPerTry; n++)
        newCardDeck.push({id: newCardDeck.length, color: color, isFlipped: false, selectCardCallback: selectCard});
    });

    return newCardDeck.toSorted(() => Math.random() - 0.5);
  };

  function selectCard(cardId: number) {
    if(isPaused)
      return;

    flipCards([cardId]);
    isPaused = true;
    //setIsPaused((prevIsPaused) => !prevIsPaused);

    pauseTimeoutId = setTimeout(() => {
      flipCards([cardId]);
      isPaused = false;
      //setIsPaused((prevIsPaused) => !prevIsPaused);
    }, pauseDuration);
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