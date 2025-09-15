import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, TextStyle} from 'react-native';
import CustomText from '../CustomText';
import {Colors, FontType, Metrix} from '@/config';

export type LeadsCardProps = {
  style?: any;
  details: any;
  customStyles?: StyleProp<ViewStyle>;
  customFontStyles?: StyleProp<TextStyle>;
  valueBold?: boolean;
};

const BuyerTypeCard: React.FC<LeadsCardProps> = ({
  customStyles,
  customFontStyles,
  details,
}) => {
  return (
    <View style={[styles.card, customStyles]}>
      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={styles.titleText}>
          Buyer Type
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          numberOfLines={2}
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.buyer?.type || '-'}
        </CustomText.LargeSemiBoldText>
      </View>

      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={styles.titleText}>
          EOI No.
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          numberOfLines={2}
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.eoi_num || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    paddingHorizontal: Metrix.VerticalSize(14),
    paddingVertical: Metrix.VerticalSize(20),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    marginBottom: Metrix.VerticalSize(10),
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(2),
  },
  titleText: {
    fontSize: FontType.FontRegular,
  },
  valueText: {
    fontSize: FontType.FontMedium,
  },
  //skeleton styles
  skeletonDetailCard: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    paddingHorizontal: Metrix.VerticalSize(14),
    paddingVertical: Metrix.VerticalSize(20),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    marginVertical: Metrix.VerticalSize(6),
  },
  skeletonHeading: {
    width: Metrix.HorizontalSize(180),
    height: Metrix.VerticalSize(22),
    marginBottom: Metrix.VerticalSize(10),
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Metrix.VerticalSize(15),
  },
  skeletonLeftText: {
    width: Metrix.HorizontalSize(130),
    height: Metrix.VerticalSize(18),
  },
  skeletonRightText: {
    width: Metrix.HorizontalSize(90),
    height: Metrix.VerticalSize(18),
  },
});

export default BuyerTypeCard;
