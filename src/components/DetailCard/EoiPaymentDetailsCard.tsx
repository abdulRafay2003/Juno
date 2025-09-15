import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, TextStyle} from 'react-native';
import CustomText from '../CustomText';
import {Colors, FontType, Metrix} from '@/config';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import moment from 'moment';
import {DateModifier, formatPricing} from '@/utils/business.helper';

export type LeadsCardProps = {
  style?: any;
  details: any;
  title?: string;
  customStyles?: StyleProp<ViewStyle>;
  customFontStyles?: StyleProp<TextStyle>;
  valueBold?: boolean;
};

const EoiPaymentDetailsCard: React.FC<LeadsCardProps> = ({
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
          customStyle={[styles.titleText]}>
          Total EOI Amount (AED)
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
          Mode of Payment
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          numberOfLines={2}
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.mode || '-'}
        </CustomText.LargeSemiBoldText>
      </View>

      {(details?.mode == 'Cheque' || details?.mode == 'Bank Transfer') && (
        <View style={styles.listContainer}>
          <CustomText.RegularText
            numberOfLines={2}
            customStyle={styles.titleText}>
            Bank Name
          </CustomText.RegularText>
          <CustomText.LargeSemiBoldText
            numberOfLines={2}
            customStyle={[styles.valueText, customFontStyles]}>
            {details?.bank_name || '-'}
          </CustomText.LargeSemiBoldText>
        </View>
      )}
      {details?.mode == 'Cheque' && (
        <View style={styles.listContainer}>
          <CustomText.RegularText
            numberOfLines={2}
            customStyle={styles.titleText}>
            Cheque Number
          </CustomText.RegularText>
          <CustomText.LargeSemiBoldText
            numberOfLines={2}
            customStyle={[styles.valueText, customFontStyles]}>
            {details?.cheque_number || '-'}
          </CustomText.LargeSemiBoldText>
        </View>
      )}

      {details?.mode == 'Cheque' && (
        <View style={styles.listContainer}>
          <CustomText.RegularText
            numberOfLines={2}
            customStyle={styles.titleText}>
            Cheque Date
          </CustomText.RegularText>
          <CustomText.LargeSemiBoldText
            numberOfLines={2}
            customStyle={[styles.valueText, customFontStyles]}>
            {DateModifier(details?.cheque_date)}
          </CustomText.LargeSemiBoldText>
        </View>
      )}
      {details?.mode == 'Cheque' && (
        <View style={styles.listContainer}>
          <CustomText.RegularText
            numberOfLines={2}
            customStyle={styles.titleText}>
            Third Party Cheque
          </CustomText.RegularText>
          <CustomText.LargeSemiBoldText
            numberOfLines={2}
            customStyle={[styles.valueText, customFontStyles]}>
            {details?.third_party_cheque}
          </CustomText.LargeSemiBoldText>
        </View>
      )}

      {details?.mode == 'Cash' && (
        <View style={styles.listContainer}>
          <CustomText.RegularText
            numberOfLines={2}
            customStyle={styles.titleText}>
            Source of Fund
          </CustomText.RegularText>
          <CustomText.LargeSemiBoldText
            numberOfLines={2}
            customStyle={[styles.valueText, customFontStyles]}>
            {details?.source_of_fund || '-'}
          </CustomText.LargeSemiBoldText>
        </View>
      )}
      {details?.mode == 'Cash' && (
        <View style={styles.listContainer}>
          <CustomText.RegularText
            numberOfLines={2}
            customStyle={styles.titleText}>
            Source of Wealth
          </CustomText.RegularText>
          <CustomText.LargeSemiBoldText
            numberOfLines={2}
            customStyle={[styles.valueText, customFontStyles]}>
            {details?.source_of_wealth || '-'}
          </CustomText.LargeSemiBoldText>
        </View>
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

export default EoiPaymentDetailsCard;
