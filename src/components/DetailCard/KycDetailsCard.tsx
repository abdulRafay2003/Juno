import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, TextStyle} from 'react-native';
import CustomText from '../CustomText';
import {Colors, FontType, Metrix} from '@/config';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import moment from 'moment';
import {DateModifier} from '@/utils/business.helper';

export type LeadsCardProps = {
  style?: any;
  details: any;
  title?: string;
  customStyles?: StyleProp<ViewStyle>;
  customFontStyles?: StyleProp<TextStyle>;
  valueBold?: boolean;
  type: string;
};

const KycDetailsCard: React.FC<LeadsCardProps> = ({
  title,
  customStyles,
  customFontStyles,
  details,
  type,
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
      {type == 'Corporate' ? (
        <>
          <View style={styles.listContainer}>
            <CustomText.RegularText
              numberOfLines={2}
              customStyle={styles.titleText}>
              Company Registration Date
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText
              customStyle={[styles.valueText, customFontStyles]}>
              {DateModifier(details?.registration?.date)}
            </CustomText.LargeSemiBoldText>
          </View>
          <View style={styles.listContainer}>
            <CustomText.RegularText
              numberOfLines={2}
              customStyle={styles.titleText}>
              Company Registration Number
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText
              customStyle={[styles.valueText, customFontStyles]}>
              {details?.registration?.number || '-'}
            </CustomText.LargeSemiBoldText>
          </View>
          <View style={styles.listContainer}>
            <CustomText.RegularText
              numberOfLines={2}
              customStyle={styles.titleText}>
              Company Registration Place
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText
              customStyle={[styles.valueText, customFontStyles]}>
              {details?.registration?.place || '-'}
            </CustomText.LargeSemiBoldText>
          </View>
          <View style={styles.listContainer}>
            <CustomText.RegularText
              numberOfLines={2}
              customStyle={styles.titleText}>
              Trade License Number
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText
              customStyle={[styles.valueText, customFontStyles]}>
              {details?.trade_license?.number || '-'}
            </CustomText.LargeSemiBoldText>
          </View>
          <View style={styles.listContainer}>
            <CustomText.RegularText
              numberOfLines={2}
              customStyle={styles.titleText}>
              Trade License Expiry
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText
              customStyle={[styles.valueText, customFontStyles]}>
              {DateModifier(details?.trade_license?.expiry_date)}
            </CustomText.LargeSemiBoldText>
          </View>
        </>
      ) : (
        <>
          <View style={styles.listContainer}>
            <CustomText.RegularText
              numberOfLines={2}
              customStyle={styles.titleText}>
              Passport Number
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText
              customStyle={[styles.valueText, customFontStyles]}>
              {details?.passport_number || '-'}
            </CustomText.LargeSemiBoldText>
          </View>
          <View style={styles.listContainer}>
            <CustomText.RegularText
              numberOfLines={2}
              customStyle={styles.titleText}>
              Passport Expiry Date
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText
              customStyle={[styles.valueText, customFontStyles]}>
              {DateModifier(details?.passport_expiry_date)}
            </CustomText.LargeSemiBoldText>
          </View>
          <View style={styles.listContainer}>
            <CustomText.RegularText
              numberOfLines={2}
              customStyle={[styles.titleText]}>
              National ID No.
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText
              customStyle={[styles.valueText, customFontStyles]}>
              {details?.national_id || '-'}
            </CustomText.LargeSemiBoldText>
          </View>
          <View style={styles.listContainer}>
            <CustomText.RegularText
              numberOfLines={2}
              customStyle={styles.titleText}>
              National ID Expiry Date
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText
              customStyle={[styles.valueText, customFontStyles]}>
              {DateModifier(details?.national_id_expiry_date)}
            </CustomText.LargeSemiBoldText>
          </View>
          <View style={styles.listContainer}>
            <CustomText.RegularText
              numberOfLines={2}
              customStyle={styles.titleText}>
              Address
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText
              customStyle={[styles.valueText, customFontStyles]}>
              {details?.address || '-'}
            </CustomText.LargeSemiBoldText>
          </View>
          <View style={styles.listContainer}>
            <CustomText.RegularText
              numberOfLines={2}
              customStyle={styles.titleText}>
              City
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText
              customStyle={[styles.valueText, customFontStyles]}>
              {details?.city || '-'}
            </CustomText.LargeSemiBoldText>
          </View>
          <View style={styles.listContainer}>
            <CustomText.RegularText customStyle={styles.titleText}>
              Postal Code
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText
              customStyle={[styles.valueText, customFontStyles]}>
              {details?.postal_code || '-'}
            </CustomText.LargeSemiBoldText>
          </View>
        </>
      )}
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

export default KycDetailsCard;
