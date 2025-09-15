import {ImageProps, StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import Lottie from 'lottie-react-native';
import {Metrix} from '../../config';

type LottieAnimatedProps = {
  src?: ImageProps['source'];
  customStyle?: ViewStyle;
  speed?: number;
};

export const LottieAnimated: React.FC<LottieAnimatedProps> = ({
  src,
  customStyle,
  speed = 0.9,
}) => {
  return (
    <Lottie
      source={src ? src : require('@/assets/animations/success.json')}
      style={[styles.lottie, customStyle]}
      resizeMode="cover"
      speed={speed}
      autoPlay
      loop
    />
  );
};

const styles = StyleSheet.create({
  lottie: {
    width: Metrix.HorizontalSize(60),
    height: Metrix.VerticalSize(60),
  },
});
