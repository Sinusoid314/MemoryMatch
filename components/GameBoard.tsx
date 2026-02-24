import type { CardProps } from "@/components/Card";
import Card from "@/components/Card";
import { useEffect, useRef, useState } from "react";
import { FlatList, ListRenderItem, ListRenderItemInfo, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  gameBoard: {
    flex: 1,
    backgroundColor: 'darkbrown',
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
  const gameStateRef = useRef(gameState);
  const [cardDeck, updateCardDeck] = useState(createCardDeck);
  const selectedCardIdsRef = useRef<number[]>([]);
  const timeoutIdRef = useRef(0);

  useEffect(() => {
    console.log("STATE =    " + gameState);
    console.log("STATEREF = " + gameStateRef.current);

    gameStateRef.current = gameState;

    if(gameState === GAME_STATE_TRY_FAIL || gameState === GAME_STATE_TRY_SUCCESS)
      timeoutIdRef.current = setTimeout(onTryDone, timeoutDuration);
  }, [gameState]);

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

    if(cardDeck.find((card) => card.id === cardId)?.isFlipped)
      return;

    if(selectedCardIdsRef.current.length < selectionsPerTry)
    {
      flipCards([cardId]);
      selectedCardIdsRef.current.push(cardId);
    }

    if(selectedCardIdsRef.current.length < selectionsPerTry)
      return;

    compareSelectedCards();

    //timeoutIdRef.current = setTimeout(onTryDone, timeoutDuration);
  }

  function compareSelectedCards()
  {
    const cardsMatch = cardDeck.filter((card) => {
      if(selectedCardIdsRef.current.includes(card.id))
        return true;
      else
        return false;
    }).every((card, cardIndex, selectedCards) => {
      return card.color === selectedCards[0].color;
    });

    if(cardsMatch)
      setGameState(GAME_STATE_TRY_SUCCESS);
    else
      setGameState(GAME_STATE_TRY_FAIL);
  }

  function onTryDone()
  {
    if(gameStateRef.current === GAME_STATE_TRY_FAIL) {
      console.log("TRY FAIL");
      flipCards(selectedCardIdsRef.current);
    }

    selectedCardIdsRef.current = [];
    timeoutIdRef.current = 0;
    
    setGameState(GAME_STATE_PLAYING);
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

  const color = (() => {
    switch(gameStateRef.current)
    {
      case GAME_STATE_PLAYING:
        return 'tan';
      case GAME_STATE_DONE:
        return 'lightgray';
      case GAME_STATE_TRY_SUCCESS:
        return 'green';
      case GAME_STATE_TRY_FAIL:
        return 'red';
    }
  })();

  const cardRenderItem: ListRenderItem<CardProps> = ({item: card}: ListRenderItemInfo<CardProps>) => (
    <Card {...card} />
  );

  return (
    <View style={[
      styles.gameBoard, 
      {backgroundColor: color}
    ]}>
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