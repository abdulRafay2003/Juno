import React, {FC} from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  View,
  Image,
  TextStyle,
} from 'react-native';
import {Metrix, FontType, Colors} from '../../config';
import CustomText from '../CustomText';
import {ACTIVE_OPACITY} from '@/constants/globalConst';

export type SecondaryButtonProps = TouchableOpacityProps & {
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
  width?: number | string;
  color?: string;
  textColor?: string;
  customStyles?: StyleProp<ViewStyle>;
  fontSize?: any;
  leftIcon?: () => React.ReactNode;
  titleIcon?: () => React.ReactNode;
  customBtnTextStyle?: StyleProp<TextStyle>;
  textBold?: boolean;
};

export const SecondaryButton: FC<SecondaryButtonProps> = ({
  title,
  onPress,
  isLoading,
  disabled,
  width = '100%',
  color = Colors.White,
  textColor = Colors.LightBlack,
  customStyles,
  fontSize = FontType.FontMedium,
  leftIcon,
  titleIcon,
  customBtnTextStyle,
  textBold,
  ...rest
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={ACTIVE_OPACITY}
      style={[styles.buttonContainer, customStyles]}
      disabled={disabled || isLoading}
      {...rest}>
      {leftIcon && leftIcon()}
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.titleContainer}>
          {titleIcon && titleIcon()}
          {textBold ? (
            <CustomText.MediumText
              customStyle={[customBtnTextStyle, {color: textColor}]}>
              {title}
            </CustomText.MediumText>
          ) : (
            <CustomText.RegularText
              customStyle={[customBtnTextStyle, {color: textColor}]}>
              {title}
            </CustomText.RegularText>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: Metrix.VerticalSize(42),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: Metrix.VerticalSize(100),
    marginVertical: Metrix.VerticalSize(10),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    backgroundColor: Colors.White,
    width: '100%',
  },
  iconStyle: {
    width: Metrix.HorizontalSize(16),
    height: Metrix.VerticalSize(16),
    marginRight: Metrix.HorizontalSize(10),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Metrix.HorizontalSize(10),
  },
  titleImg: {
    width: Metrix.HorizontalSize(15),
    height: Metrix.VerticalSize(15),
    resizeMode: 'contain',
  },
});
