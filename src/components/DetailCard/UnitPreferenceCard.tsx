import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, TextStyle} from 'react-native';
import CustomText from '../CustomText';
import {Colors, FontType, Metrix} from '@/config';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import moment from 'moment';
import {formatPricing} from '@/utils/business.helper';

export type LeadsCardProps = {
  style?: any;
  details: any;
  title?: string;
  customStyles?: StyleProp<ViewStyle>;
  customFontStyles?: StyleProp<TextStyle>;
  valueBold?: boolean;
};

const UnitPreferenceCard: React.FC<LeadsCardProps> = ({
  title,
  customStyles,
  customFontStyles,
  details,
}) => {
  return (
    <View style={[styles.card, customStyles]}>
      {title && (
        <CustomText.LargeSemiBoldText
          customStyle={{
            marginVertical: Metrix.HorizontalSize(0),
            fontSize: FontType.FontMedium,
          }}>
          {title}
        </CustomText.LargeSemiBoldText>
      )}
      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={styles.titleText}>
          Unit Preference
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          numberOfLines={2}
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.unit_preference || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={styles.titleText}>
          No of Units
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          numberOfLines={2}
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.number_of_units || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={styles.titleText}>
          EOI Amount (AED)
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          numberOfLines={2}
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.amount != null ? formatPricing(details?.amount) : '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={styles.titleText}>
          Remarks
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          numberOfLines={2}
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.remarks || '-'}
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
    marginVertical: Metrix.VerticalSize(6),
  },
  listContainer: {
    justifyContent: 'space-between',
    marginTop: Metrix.VerticalSize(15),
    paddingHorizontal: Metrix.HorizontalSize(2),
  },
  titleText: {
    fontSize: FontType.FontRegular,
    marginBottom: Metrix.VerticalSize(5),
  },
  valueText: {
    fontSize: FontType.FontRegular,
    marginVertical: Metrix.VerticalSize(0),
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

export default UnitPreferenceCard;
