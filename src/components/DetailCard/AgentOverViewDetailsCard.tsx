import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, TextStyle} from 'react-native';
import CustomText from '../CustomText';
import {Colors, FontType, Metrix} from '@/config';
import {DateModifier} from '@/utils/business.helper';

export type LeadsCardProps = {
  style?: any;
  details: any;
  title?: string;
  customStyles?: StyleProp<ViewStyle>;
  loading?: boolean;
  customFontStyles?: StyleProp<TextStyle>;
  valueBold?: boolean;
};

const AgentOverViewDetailsCard: React.FC<LeadsCardProps> = ({
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
          First Name
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.first_name || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={styles.titleText}>
          Last Name
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.last_name || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={styles.titleText}>
          Nationality
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.nationality || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={styles.titleText}>
          Mobile Number
        </CustomText.RegularText>

        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.mobile_number || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={styles.titleText}>
          Email
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.email || '-'}
        </CustomText.LargeSemiBoldText>
      </View>

      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={styles.titleText}>
          Emirates ID No.
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.emirates?.number || '-'}
        </CustomText.LargeSemiBoldText>
      </View>

      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={[styles.titleText]}>
          Emirates ID Expiry Date
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {DateModifier(details?.emirates?.expiry_date)}
        </CustomText.LargeSemiBoldText>
      </View>

      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={styles.titleText}>
          ID Issue Place
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.emirates?.issue_place || '-'}
        </CustomText.LargeSemiBoldText>
      </View>

      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={styles.titleText}>
          Passport Number
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.passport?.number || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={styles.titleText}>
          Passport Issue Place
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.passport?.issue_place || '-'}
        </CustomText.LargeSemiBoldText>
      </View>

      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={[styles.titleText]}>
          Passport Expiry Date
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {DateModifier(details?.passport?.expiry_date)}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={styles.titleText}>
          Designation
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.designation || '-'}
        </CustomText.LargeSemiBoldText>
      </View>

      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={styles.titleText}>
          Role
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.role || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={styles.titleText}>
          Broker RERA Number
        </CustomText.RegularText>

        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.rera?.number || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText
          numberOfLines={2}
          customStyle={[styles.titleText]}>
          RERA Registration Expiry Date
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {DateModifier(details?.rera?.expiry_date)}
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

export default AgentOverViewDetailsCard;
