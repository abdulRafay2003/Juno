import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, TextStyle} from 'react-native';
import CustomText from '../CustomText';
import {Colors, FontType, Metrix} from '@/config';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import moment from 'moment';

export type LeadsCardProps = {
  style?: any;
  details: any;
  title?: string;
  customStyles?: StyleProp<ViewStyle>;
  loading?: boolean;
  customFontStyles?: StyleProp<TextStyle>;
  valueBold?: boolean;
};

const InterestDetailsCard: React.FC<LeadsCardProps> = ({
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
        <CustomText.RegularText customStyle={styles.titleText}>
          Property Type
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.type || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText customStyle={styles.titleText}>
          Project
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.name || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText customStyle={styles.titleText}>
          Campaign
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.campaign || '-'}
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

export default InterestDetailsCard;
