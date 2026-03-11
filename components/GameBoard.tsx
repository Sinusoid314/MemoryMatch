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


  //When 'cardDeck' changes and the number of selected cards equals maxSelections, compare the selected cards.
  useEffect(() => {
    if(cardDeck.filter(card => card.isSelected).length === maxSelections)
      compareSelectedCards();
  }, [cardDeck]);


  //When 'result' changes to SUCCESS or FAIL, end the current try by deselecting the
  //selected cards and, if the try failed, flipping them face-down again.
  useEffect(() => {
    if(result === RESULT_PENDING)
      return;

    resultDisplayTimerRef.current = setTimeout(() => {
      if(result === RESULT_FAIL) {
        updateCardDeck(prevCardDeck => prevCardDeck.map(prevCard =>
          prevCard.isSelected ? {...prevCard, isFlipped: false} : prevCard
        ));
      }

      updateCardDeck(prevCardDeck => prevCardDeck.map(prevCard =>
        prevCard.isSelected ? {...prevCard, isSelected: false} : prevCard
      ));

      setResult(RESULT_PENDING);
      setTryCount(prevTryCount => prevTryCount + 1);

      if(cardDeck.every(card => card.isFlipped)) {
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
    if(cardDeck.filter(card => card.isSelected).length === maxSelections)
      return;

    updateCardDeck(createCardDeck());
    setResult(RESULT_PENDING);
    setTryCount(0);
    setGameDuration(0);
    setGameOver(false);

    clearTimeout(resultDisplayTimerRef.current);
    resultDisplayTimerRef.current = 0;

    clearInterval(gameDurationTimerRef.current);
    gameDurationTimerRef.current = 0;
  }


  //If the number of selected cards is already at maxSelections, do nothing.
  //Otherwise, start the game timer if this is the first card pressed, then
  //flip and select the user-pressed card.
  function onCardPress(cardId: number) {
    if(cardDeck.filter(card => card.isSelected).length === maxSelections)
      return;

    if(gameDurationTimerRef.current === 0) {
      gameDurationTimerRef.current = setInterval(() => {
        setGameDuration(prevGameDuration => prevGameDuration + 1);
      }, 1000);
    }

    updateCardDeck(prevCardDeck => prevCardDeck.map(prevCard =>
      (prevCard.id === cardId) ? {...prevCard, isFlipped: true} : prevCard
    ));

    updateCardDeck(prevCardDeck => prevCardDeck.map(prevCard =>
      (prevCard.id === cardId) ? {...prevCard, isSelected: true} : prevCard
    ));
  }


  //Compare the face images of the selected cards. If they match,
  //change 'result' state to SUCCESS; otherwise change it to FAIL.
  function compareSelectedCards() {
    const cardsMatch = cardDeck.filter(card => 
      card.isSelected
    ).every((selectedCard, index, selectedCards) => (
      selectedCard.image === selectedCards[0].image
    ));

    if(cardsMatch)
      setResult(RESULT_SUCCESS);
    else
      setResult(RESULT_FAIL);
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
