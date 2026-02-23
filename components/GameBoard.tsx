import type { CardProps } from "@/components/Card";
import Card from "@/components/Card";
import { useEffect, useRef, useState } from "react";
import { FlatList, ListRenderItem, ListRenderItemInfo, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  gameBoard: {
    flex: 1,
    borderStyle: 'solid'
  }
});

const cardColors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
const selectionsPerTry = 2;
const timeoutDuration = 1500;
const GAME_STATE_PLAYING = 1;
const GAME_STATE_DONE = 2;
const GAME_STATE_TRY_SUCCESS = 3;
const GAME_STATE_TRY_FAIL = 4;

export default function GameBoard() {
  const [gameState, setGameState] = useState(GAME_STATE_PLAYING);
  const [cardDeck, updateCardDeck] = useState(createCardDeck);
  const selectedCardIdsRef = useRef<number[]>([]);
  const timeoutIdRef = useRef(0);

  function createCardDeck() {
    const newCardDeck: CardProps[] = [];

    cardColors.forEach((color) => {
      for(let n = 0; n < selectionsPerTry; n++)
        newCardDeck.push({id: newCardDeck.length, color: color, isFlipped: false, selectCardCallback: selectCard});
    });

    return newCardDeck.toSorted(() => Math.random() - 0.5);
  }

  function selectCard(cardId: number) {
    if(timeoutIdRef.current > 0)
      return;

    if(selectedCardIdsRef.current.includes(cardId))
      return;

    if(selectedCardIdsRef.current.length < selectionsPerTry)
    {
      flipCards([cardId]);
      selectedCardIdsRef.current.push(cardId);
    }

    if(selectedCardIdsRef.current.length < selectionsPerTry)
      return;

    timeoutIdRef.current = setTimeout(() => {
      flipCards(selectedCardIdsRef.current);
      selectedCardIdsRef.current = [];
      timeoutIdRef.current = 0;
    }, timeoutDuration);
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
    return () => clearTimeout(timeoutIdRef.current);
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