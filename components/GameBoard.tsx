import type { CardProps } from "@/components/Card";
import Card, { cardFaceImages } from "@/components/Card";
import Header from "@/components/Header";
import { useEffect, useRef, useState } from "react";
import { FlatList, Image, ListRenderItem, ListRenderItemInfo, StyleSheet, View } from "react-native";


const successImage: number = require('@/assets/images/success.png');
const failImage: number = require('@/assets/images/fail.png');
const maxSelections = 2;
const timeoutDuration = 700;
const RESULT_PENDING = "pending";
const RESULT_SUCCESS = "success";
const RESULT_FAIL = "fail";
const cardListColumns = getClosestSquareGridDimensions(cardFaceImages.length * maxSelections).columns;


export default function GameBoard() {
  const [cardDeck, updateCardDeck] = useState(createCardDeck);
  const [result, setResult] = useState(RESULT_PENDING);
  const [tryCount, setTryCount] = useState(0);
  const selectedCardIdsRef = useRef<number[]>([]);
  const timeoutIdRef = useRef(0);
  let cardListRenderItem: ListRenderItem<CardProps>;
  let gameBoardColor: any;
  let resultImagePopup: any;


  //Component unmount cleanup
  useEffect(() => {
    return () => clearTimeout(timeoutIdRef.current);
  }, []);


  //When 'result' changes to SUCCESS or FAIL, end the current try
  //by deselecting the selected cards and, if the try failed,
  //flipping them face-down again.
  useEffect(() => {
    if(result === RESULT_PENDING)
      return;

    timeoutIdRef.current = setTimeout(() => {
      if(result === RESULT_FAIL) 
        flipCards(selectedCardIdsRef.current);

      deselectCards(selectedCardIdsRef.current);
      timeoutIdRef.current = 0;
      setResult(RESULT_PENDING);
      setTryCount(prevTryCount => prevTryCount + 1);
    }, timeoutDuration);
  }, [result]);


/*
  useEffect(() => {
    let gameOver = cardDeck.every((card) => card.isFlipped);
  }, [tryCount]);
*/


  //Generate and return a new, shuffled card deck
  function createCardDeck() {
    const newCardDeck: CardProps[] = [];

    cardFaceImages.forEach((image) => {
      for(let n = 0; n < maxSelections; n++)
        newCardDeck.push({id: newCardDeck.length, image: image, isFlipped: false, isSelected: false, onCardPressCallback: onCardPress});
    });

    return [...newCardDeck].sort(() => Math.random() - 0.5);
  }


  //Start a new game by resetting the game state to initial values
  function onNewGameButtonPress() {
    if(selectedCardIdsRef.current.length === maxSelections)
      return;

    updateCardDeck(createCardDeck());
    setResult(RESULT_PENDING);
    setTryCount(0);
    selectedCardIdsRef.current = [];
    timeoutIdRef.current = 0;
  }


  //If the number of selected cards is already at maxSelections, do nothing.
  //Otherwise, flip and select the user-pressed card. If the number of selected
  //cards has reached maxSelections after doing this, compare the selected cards.
  function onCardPress(cardId: number) {
    if(selectedCardIdsRef.current.length === maxSelections)
      return;

    flipCards([cardId]);
    selectCard(cardId, selectedCardIdsRef.current);
   
    if(selectedCardIdsRef.current.length < maxSelections)
      return;

    compareSelectedCards(selectedCardIdsRef.current);
  }


  //Compare the face images of the selected cards. If they match,
  //change 'result' state to SUCCESS; otherwise change it to FAIL.
  function compareSelectedCards(selectedCardIds: number[]) {
    const cardsMatch = cardDeck.filter((card) => {
      if(selectedCardIds.includes(card.id))
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


  //Invert the isFlipped property of the cards referenced by the given card IDs.
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


  //Add the given card ID to the given selected-card-ID array,
  //and set the card's isSelected property to true.
  function selectCard(cardId: number, selectedCardIds: number[]) {
    selectedCardIds.push(cardId);
    updateCardDeck(oldCardDeck => 
      oldCardDeck.map(card => {
        if(cardId === card.id)
          return {...card, isSelected: true};
        else
          return card;
      })
    );
  }


  //Set the isSelected property of all the cards referenced in the given
  //selected-card-ID array to false, and clear the selected-card-ID array.
  function deselectCards(selectedCardIds: number[]) {
    updateCardDeck(oldCardDeck =>
      oldCardDeck.map(card => {
          return {...card, isSelected: false};
      })
    );
    while(selectedCardIds.length > 0) selectedCardIds.pop();
  }


  gameBoardColor = (result === RESULT_SUCCESS) ? "palegreen" : (result === RESULT_FAIL) ? "salmon" : "tan";

  cardListRenderItem = ({item: card}: ListRenderItemInfo<CardProps>) => (
    <View style={styles.cardListItem}> 
      <Card {...card} />
    </View>
  );

  resultImagePopup = ((result === RESULT_SUCCESS) ? (<Image source={successImage} style={{position: 'absolute'}} />)
                                      : (result === RESULT_FAIL)
                                      ? (<Image source={failImage} style={{position: 'absolute'}} />)
                                      : (undefined));
 
  return (
      <View style={[styles.gameBoard, {backgroundColor: gameBoardColor}]}>
        <Header
          tryCount={tryCount}
          onNewGamePressCallback={onNewGameButtonPress}
        />
        <FlatList
          contentContainerStyle={styles.cardList}
          numColumns={cardListColumns}
          renderItem={cardListRenderItem}
          data={cardDeck}
          keyExtractor={(card: CardProps) => String(card.id)}
        />
        {resultImagePopup}
      </View>
  );
}


const styles = StyleSheet.create({
  gameBoard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBlock: 10
  },
  cardList: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 0,
    paddingRight: 0
  },
  cardListItem: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});


//Given the total number of items in a grid, returns {columns,rows} dimensions
//for the grid that are, or are closest to, a perfect square.
function getClosestSquareGridDimensions(gridItemCount: number) {
  let factorPairs: any[] = [];
  
  for(let i = 1; (i * i) <= gridItemCount; i++) {
    if((gridItemCount % i) === 0) {
      factorPairs.push({columns: i, rows: gridItemCount / i});
    }
  }

  return factorPairs[factorPairs.length - 1];
}
