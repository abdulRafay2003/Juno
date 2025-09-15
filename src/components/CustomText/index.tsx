import React, {ReactNode} from 'react';
import {
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
  TextProps,
  I18nManager,
} from 'react-native';
import {Colors, FontType, Metrix} from '@/config/index';
import {FONT_FAMILY} from '@/config';

type CustomTextProps = TextProps & {
  children: ReactNode;
  customStyle?: StyleProp<TextStyle>;
  isSecondaryColor?: boolean;
  isWhiteColor?: boolean;
  numberOfLines?: number;
};

const ExtraLargeBoldText = ({
  children,
  customStyle,
  isSecondaryColor,
  isWhiteColor,
  numberOfLines = 1,
  ...rest
}: CustomTextProps) => {
  return (
    <Text
      allowFontScaling={false}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      style={[
        styles.ExtraLargeBoldText,
        {
          color: isSecondaryColor
            ? Colors.Grey
            : isWhiteColor
              ? Colors.White
              : Colors.LightBlack,
        },
        customStyle,
      ]}>
      {typeof children === 'string' && children.length === 0 ? '-' : children}
    </Text>
  );
};

const LargeBoldText = ({
  children,
  customStyle,
  isSecondaryColor,
  isWhiteColor,
  numberOfLines,
  ...rest
}: CustomTextProps) => {
  return (
    <Text
      allowFontScaling={false}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      style={[
        styles.LargeBoldText,
        {
          color: isSecondaryColor
            ? Colors.Grey
            : isWhiteColor
              ? Colors.White
              : Colors.LightBlack,
        },
        ,
        customStyle,
      ]}
      {...rest}>
      {typeof children === 'string' && children.length === 0 ? '-' : children}
    </Text>
  );
};

const LargeSemiBoldText = ({
  children,
  customStyle,
  isSecondaryColor,
  isWhiteColor,
  numberOfLines,
  ...rest
}: CustomTextProps) => {
  return (
    <Text
      allowFontScaling={false}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      style={[
        styles.LargeSemiBoldText,
        {
          color: isSecondaryColor
            ? Colors.Grey
            : isWhiteColor
              ? Colors.White
              : Colors.LightBlack,
        },
        ,
        customStyle,
      ]}
      {...rest}>
      {typeof children === 'string' && children.length === 0 ? '-' : children}
    </Text>
  );
};

const MediumText = ({
  children,
  customStyle,
  isSecondaryColor,
  isWhiteColor,
  numberOfLines,
  ...rest
}: CustomTextProps) => {
  return (
    <Text
      allowFontScaling={false}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      style={[
        styles.MediumText,
        {
          color: isSecondaryColor
            ? Colors.Grey
            : isWhiteColor
              ? Colors.White
              : Colors.LightBlack,
        },
        ,
        customStyle,
      ]}
      {...rest}>
      {typeof children === 'string' && children.length === 0 ? '-' : children}
    </Text>
  );
};

const RegularText = ({
  children,
  customStyle,
  isSecondaryColor,
  isWhiteColor,
  numberOfLines,
  ...rest
}: CustomTextProps) => {
  return (
    <Text
      allowFontScaling={false}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      style={[
        styles.RegularText,
        {
          color: isSecondaryColor
            ? Colors.Grey
            : isWhiteColor
              ? Colors.White
              : Colors.LightBlack,
        },
        ,
        customStyle,
      ]}
      {...rest}>
      {typeof children === 'string' && children.length === 0 ? '-' : children}
    </Text>
  );
};

export default {
  ExtraLargeBoldText,
  LargeBoldText,
  LargeSemiBoldText,
  MediumText,
  RegularText,
};

const styles = StyleSheet.create({
  ExtraLargeBoldText: {
    fontFamily: FONT_FAMILY.InterBold,
    fontSize: FontType.FontSuperLarge,
    marginVertical: Metrix.VerticalSize(3),
  },
  LargeBoldText: {
    fontFamily: FONT_FAMILY.InterBold,
    fontSize: FontType.FontExtraLarge,
    marginVertical: Metrix.VerticalSize(3),
  },
  LargeSemiBoldText: {
    fontFamily: FONT_FAMILY.InterSemiBold,
    fontSize: FontType.FontLarge,
    marginVertical: Metrix.VerticalSize(3),
  },
  MediumText: {
    fontFamily: FONT_FAMILY.InterMedium,
    fontSize: FontType.FontMedium,
    marginVertical: Metrix.VerticalSize(3),
  },
  RegularText: {
    fontFamily: FONT_FAMILY.InterRegular,
    fontSize: FontType.FontRegular,
    marginVertical: Metrix.VerticalSize(3),
  },
});
