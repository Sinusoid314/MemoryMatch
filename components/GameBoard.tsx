import type { CardProps } from "@/components/Card";
import Card, { cardFaceImages } from "@/components/Card";
import { useEffect, useRef, useState } from "react";
import { FlatList, ListRenderItem, ListRenderItemInfo, StyleSheet, View, useWindowDimensions } from "react-native";


const maxSelections = 2;
const timeoutDuration = 1500;
const RESULT_PENDING = "pending";
const RESULT_SUCCESS = "success";
const RESULT_FAIL = "fail";
const cardListColumns = 3;


export default function GameBoard() {
  const [cardDeck, updateCardDeck] = useState(createCardDeck);
  const [result, setResult] = useState(RESULT_PENDING);
  const selectedCardIdsRef = useRef<number[]>([]);
  const timeoutIdRef = useRef(0);
  const screenWidth = useWindowDimensions().width;
  //const cardRenderItemSize = screenWidth / cardListColumns;
  let cardRenderItem: ListRenderItem<CardProps>;
  let gameBoardColor: any;


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

    cardFaceImages.forEach((image) => {
      for(let n = 0; n < maxSelections; n++)
        newCardDeck.push({id: newCardDeck.length, image: image, isFlipped: false, isSelected: false, onCardPressCallback: onCardPress});
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
      return card.image === selectedCards[0].image;
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
    //style={{width: cardRenderItemSize, height: cardRenderItemSize}}>
    <View> 
      <Card {...card} />
    </View>
  );
 
  return (
    <View style={[styles.gameBoard, {backgroundColor: gameBoardColor}]}>
      <FlatList
        style={styles.cardList}
        contentContainerStyle={styles.cardListContent}
        numColumns={3}
        renderItem={cardRenderItem}
        data={cardDeck}
        keyExtractor={(card: CardProps) => String(card.id)}
      />
    </View>
  );
}


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
    width: "100%",
    backgroundColor: "red"
  },
  cardListContent: {
    flex: 1,
    width: "100%",
    backgroundColor: "blue"
  }
});
