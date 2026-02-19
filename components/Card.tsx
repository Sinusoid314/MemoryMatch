import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white'

  }
});

export default function Card(props: any) {

  const handlePress = () => {
    props.selectCard(props.index);
  };

  styles.card.backgroundColor = props.isFlipped ? props.color : 'white';

  return (
    <View style={styles.card}>
      <Pressable onPress={handlePress}></Pressable>
    </View>
  );
}