import React, {FC} from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  View,
  TextStyle,
} from 'react-native';
import {Metrix, FontType, Colors} from '../../config';
import CustomText from '../CustomText';
import {ACTIVE_OPACITY} from '@/constants/globalConst';

export type BottomTextProps = TouchableOpacityProps & {
  firstText?: string;
  firstTextCustomStyle?: TextStyle;
  secondText?: string;
  secondTextCustomStyle?: TextStyle;
  secondTextOnPress?: () => void;
};

export const BottomText: FC<BottomTextProps> = ({
  firstText,
  firstTextCustomStyle,
  secondText,
  secondTextCustomStyle,
  secondTextOnPress,
}) => {
  return (
    <View>
      <CustomText.RegularText
        isWhiteColor
        customStyle={[styles.signupSection, firstTextCustomStyle]}>
        {firstText}
        {'\n'}
        <CustomText.RegularText
          customStyle={[styles.signupText, secondTextCustomStyle]}
          onPress={secondTextOnPress}>
          {' '}
          {secondText}
        </CustomText.RegularText>
      </CustomText.RegularText>
    </View>
  );
};

const styles = StyleSheet.create({
  signupSection: {
    textAlign: 'center',
  },
  signupText: {
    textDecorationLine: 'underline',
    lineHeight: Metrix.VerticalSize(18),
  },
});
