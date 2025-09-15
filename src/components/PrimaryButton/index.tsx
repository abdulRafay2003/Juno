import React, {FC} from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  Image,
  View,
  TextStyle,
} from 'react-native';
import {Metrix, FontType, Colors, Images} from '../../config';
import CustomText from '../CustomText';
import {ACTIVE_OPACITY} from '@/constants/globalConst';

export type PrimaryButtonProps = TouchableOpacityProps & {
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
  width?: any;
  color?: string;
  textColor?: string;
  customStyles?: StyleProp<ViewStyle>;
  fontSize?: any;
  isRightIcon?: boolean;
  rightIcon?: () => React.ReactNode;
  titleIcon?: () => React.ReactNode;
  customTextStyle?: StyleProp<TextStyle>;
  tintColor?: any;
};

export const PrimaryButton: FC<PrimaryButtonProps> = ({
  title,
  onPress,
  isLoading,
  disabled,
  width = '100%',
  color = Colors.LightBlack,
  textColor = Colors.White,
  customStyles,
  fontSize = FontType.FontMedium,
  isRightIcon = false,
  rightIcon = () => <Images.FullArrowSVG color={tintColor || Colors.White} />,
  titleIcon,
  customTextStyle,
  tintColor = Colors.White,
  ...rest
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={ACTIVE_OPACITY}
      style={[
        styles.buttonContainer,
        {
          backgroundColor: disabled ? Colors.Grey : color,
          width: width,
        },
        customStyles,
      ]}
      disabled={disabled || isLoading}
      {...rest}>
      <View style={styles.rightContainer}></View>
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.titleContainer}>
          {titleIcon && titleIcon()}

          <CustomText.MediumText
            customStyle={[{color: textColor}, customTextStyle]}>
            {title}
          </CustomText.MediumText>
        </View>
      )}
      {isRightIcon ? (
        <View style={styles.rightContainer}>{rightIcon && rightIcon()}</View>
      ) : (
        <View style={styles.rightContainer}></View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Metrix.HorizontalSize(5),
  },
  buttonContainer: {
    height: Metrix.VerticalSize(42),
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: Metrix.VerticalSize(100),
    marginVertical: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(17),
    flexDirection: 'row',
  },
  rightContainer: {
    width: '10%',
    alignItems: 'flex-end',
  },
  iconStyle: {
    width: Metrix.HorizontalSize(18),
    height: Metrix.VerticalSize(18),
  },
});
