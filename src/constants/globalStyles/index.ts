import {Colors, FontType, Metrix} from '@/config';
import {StyleSheet, Platform} from 'react-native';

export const globalStyles = StyleSheet.create({
  keyboardContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    ...(Platform.OS === 'ios' ? {flex: 1} : {height: '100%'}),
  },
  standardMarginTop: {
    marginTop: Metrix.VerticalSize(10),
  },
  cardContainer: {
    borderWidth: 1,
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    borderColor: Colors.TextInputBorderColor,
    paddingVertical: Metrix.VerticalSize(20),
    paddingHorizontal: Metrix.HorizontalSize(15),
    marginTop: Metrix.VerticalSize(15),
  },
  isOptional: {
    fontSize: FontType.FontSmall,
    color: Colors.PieChartGray2,
  },
  buttonSpacing: {
    marginBottom:
      Platform.OS == 'android'
        ? Metrix.VerticalSize(30)
        : Metrix.VerticalSize(0),
  },
});
