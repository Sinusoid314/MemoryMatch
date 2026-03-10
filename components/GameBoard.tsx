import type { CardProps } from "@/components/Card";
import Card, { cardFaceImages } from "@/components/Card";
import Header from "@/components/Header";
import { useEffect, useRef, useState } from "react";
import { FlatList, Image, ListRenderItem, ListRenderItemInfo, StyleSheet, Text, View } from "react-native";


const successImage: number = require('@/assets/images/success.png');
const failImage: number = require('@/assets/images/fail.png');
const maxSelections = 2;
const resultDisplayDuration = 700;
const RESULT_PENDING = "pending";
const RESULT_SUCCESS = "success";
const RESULT_FAIL = "fail";
const cardGridColumns = getClosestSquareGridDimensions(cardFaceImages.length * maxSelections).columns;


export default function GameBoard() {
  const [cardDeck, updateCardDeck] = useState(createCardDeck);
  const [result, setResult] = useState(RESULT_PENDING);
  const [tryCount, setTryCount] = useState(0);
   const [gameDuration, setGameDuration] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const selectedCardIdsRef = useRef<number[]>([]);
  const resultDisplayTimerRef = useRef(0);
  const gameDurationTimerRef = useRef(0);

  let cardGridRenderItem: ListRenderItem<CardProps>;
  let gameBoardColor: any;
  let resultImagePopup: any;
  let gameOverPopup: any;


  //Component unmount cleanup
  useEffect(() => {
    return () => {
      clearTimeout(resultDisplayTimerRef.current);
      clearInterval(gameDurationTimerRef.current);
    }
  }, []);


  //When 'result' changes to SUCCESS or FAIL, end the current try
  //by deselecting the selected cards and, if the try failed,
  //flipping them face-down again.
  useEffect(() => {
    if(result === RESULT_PENDING)
      return;

    resultDisplayTimerRef.current = setTimeout(() => {
      if(result === RESULT_FAIL) 
        flipCards(selectedCardIdsRef.current);

      deselectCards(selectedCardIdsRef.current);
      setResult(RESULT_PENDING);
      setTryCount(prevTryCount => prevTryCount + 1);

      if(cardDeck.every((card) => card.isFlipped)) {
        clearInterval(gameDurationTimerRef.current);
        gameDurationTimerRef.current = 0;
        setGameOver(true);
      }

      resultDisplayTimerRef.current = 0;
    }, resultDisplayDuration);
  }, [result]);


  //Generate and return a new, shuffled card deck
  function createCardDeck() {
    const newCardDeck: CardProps[] = [];

    cardFaceImages.forEach((image) => {
      for(let n = 0; n < maxSelections; n++)
        newCardDeck.push({
          id: newCardDeck.length,
          image: image,
          isFlipped: false,
          isSelected: false,
          onCardPressCallback: onCardPress
        });
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
    setGameDuration(0);
    setGameOver(false);
    selectedCardIdsRef.current = [];

    clearTimeout(resultDisplayTimerRef.current);
    resultDisplayTimerRef.current = 0;

    clearInterval(gameDurationTimerRef.current);
    gameDurationTimerRef.current = 0;
  }


  //If the number of selected cards is already at maxSelections, do nothing.
  //Otherwise, start the game timer if this is the first card pressed, then
  //flip and select the user-pressed card. If the number of selected cards has
  //reached maxSelections after doing this, compare the selected cards.
  function onCardPress(cardId: number) {
    if(selectedCardIdsRef.current.length === maxSelections)
      return;

    if(!cardDeck.every((card) => card.isFlipped) && (gameDurationTimerRef.current === 0)) {
      gameDurationTimerRef.current = setInterval(() => {
        setGameDuration(prevGameDuration => prevGameDuration + 1);
      }, 1000);
    }

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

  cardGridRenderItem = ({item: card}: ListRenderItemInfo<CardProps>) => (
    <View style={styles.cardGridItem}> 
      <Card {...card} onCardPressCallback={onCardPress} />
    </View>
  );

  resultImagePopup = ((result === RESULT_SUCCESS) ? (<Image source={successImage} style={styles.result} />)
                                      : (result === RESULT_FAIL)
                                      ? (<Image source={failImage} style={styles.result} />)
                                      : (undefined));
 
  gameOverPopup = (gameOver ? (<Text style={styles.gameOver}>Game Over</Text>)
                            : (undefined));

  return (
      <View style={[styles.gameBoard, {backgroundColor: gameBoardColor}]}>
        <Header
          tryCount={tryCount}
          gameDuration={gameDuration}
          onNewGamePressCallback={onNewGameButtonPress}
        />
        <FlatList
          contentContainerStyle={styles.cardGrid}
          numColumns={cardGridColumns}
          renderItem={cardGridRenderItem}
          data={cardDeck}
          keyExtractor={(card: CardProps) => card.id.toString()}
        />
        {resultImagePopup}
        {gameOverPopup}
      </View>
  );
}


const styles = StyleSheet.create({
  gameBoard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBlock: 25
  },
  cardGrid: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardGridItem: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  result: {
    position: 'absolute',
    opacity: 0.9,
  },
  gameOver: {
    position: 'absolute', 
    fontSize: 36,
    backgroundColor: 'palegreen',
    padding: 6,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    opacity: 0.8,
    borderRadius: 10,
    textShadowColor: 'white',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 2
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
