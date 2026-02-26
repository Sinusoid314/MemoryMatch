import type { CardProps } from "@/components/Card";
import Card from "@/components/Card";
import { useEffect, useRef, useState } from "react";
import { FlatList, ListRenderItem, ListRenderItemInfo, StyleSheet, View } from "react-native";


const styles = StyleSheet.create({
  gameBoard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderStyle: 'solid',
  },
  cardList: {
    flex: 1,
  },
  cardListContent: {
    flexGrow: 1
  },
  cardListColumnWrapper: {
  }
});


const cardColors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
const maxSelections = 2;
const timeoutDuration = 1500;
const RESULT_PENDING = "pending";
const RESULT_SUCCESS = "success";
const RESULT_FAIL = "fail";


export default function GameBoard() {
  const [cardDeck, updateCardDeck] = useState(createCardDeck);
  const [result, setResult] = useState(RESULT_PENDING);
  const selectedCardIdsRef = useRef<number[]>([]);
  const timeoutIdRef = useRef(0);
  let gameBoardColor: any;
  let cardRenderItem: ListRenderItem<CardProps>;


  useEffect(() => {
    return () => clearTimeout(timeoutIdRef.current);
  }, []);


  useEffect(() => {
    if(result === RESULT_PENDING)
      return;

    timeoutIdRef.current = setTimeout(() => {
      if(result === RESULT_FAIL) 
        flipCards(selectedCardIdsRef.current);

      deselectCards(selectedCardIdsRef.current);
      timeoutIdRef.current = 0;
      setResult(RESULT_PENDING);
    }, timeoutDuration);
  }, [result]);


  function createCardDeck() {
    const newCardDeck: CardProps[] = [];

    cardColors.forEach((color) => {
      for(let n = 0; n < maxSelections; n++)
        newCardDeck.push({id: newCardDeck.length, color: color, isFlipped: false, isSelected: false, onCardPressCallback: onCardPress});
    });

    return [...newCardDeck].sort(() => Math.random() - 0.5);
  }


  function onCardPress(cardId: number) {
    if(selectedCardIdsRef.current.length === maxSelections)
      return;

    flipCards([cardId]);
    selectCard(cardId, selectedCardIdsRef.current);
   
    if(selectedCardIdsRef.current.length < maxSelections)
      return;

    compareSelectedCards(selectedCardIdsRef.current);
  }


  function compareSelectedCards(cardIds: number[]) {
    const cardsMatch = cardDeck.filter((card) => {
      if(cardIds.includes(card.id))
        return true;
      else
        return false;
    }).every((card, cardIndex, selectedCards) => {
      return card.color === selectedCards[0].color;
    });

    if(cardsMatch)
      setResult(RESULT_SUCCESS);
    else
      setResult(RESULT_FAIL);
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


  function selectCard(cardId: number, cardIds: number[]) {
    cardIds.push(cardId);
    updateCardDeck(oldCardDeck => 
      oldCardDeck.map(card => {
        if(cardId === card.id)
          return {...card, isSelected: true};
        else
          return card;
      })
    );
  }


  function deselectCards(cardIds: number[]) {
    updateCardDeck(oldCardDeck =>
      oldCardDeck.map(card => {
          return {...card, isSelected: false};
      })
    );
    while(cardIds.length > 0) cardIds.pop();
  }


  gameBoardColor = (result===RESULT_SUCCESS) ? 'palegreen' : ((result===RESULT_FAIL) ? 'salmon' : 'tan');

  cardRenderItem = ({item: card}: ListRenderItemInfo<CardProps>) => (
    <Card {...card} />
  );
 
  return (
    <View style={[styles.gameBoard, {backgroundColor: gameBoardColor}]}>
      <FlatList
        style={styles.cardList}
        contentContainerStyle={styles.cardListContent}
        columnWrapperStyle={styles.cardListColumnWrapper}
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