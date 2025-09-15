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
  loading?: boolean;
  customFontStyles?: StyleProp<TextStyle>;
  valueBold?: boolean;
};

const LeadDetailCard: React.FC<LeadsCardProps> = ({
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
          Title
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.salutation || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText customStyle={styles.titleText}>
          First Name
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.first_name || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText customStyle={styles.titleText}>
          Last Name
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.last_name || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText customStyle={styles.titleText}>
          Gender
        </CustomText.RegularText>

        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.gender || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText customStyle={styles.titleText}>
          Date of Birth
        </CustomText.RegularText>

        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {DateModifier(details?.date_of_birth)}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText customStyle={styles.titleText}>
          Mobile Number
        </CustomText.RegularText>

        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.mobile_number || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText customStyle={styles.titleText}>
          Email
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.email || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText customStyle={styles.titleText}>
          Nationality
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.nationality || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText customStyle={styles.titleText}>
          Sales Manager
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.sales_manager || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText customStyle={styles.titleText}>
          Preferred Language
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.preferred_language || '-'}
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.listContainer}>
        <CustomText.RegularText customStyle={[styles.titleText]}>
          Residence
        </CustomText.RegularText>
        <CustomText.LargeSemiBoldText
          customStyle={[styles.valueText, customFontStyles]}>
          {details?.country_of_residence || '-'}
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

export default LeadDetailCard;
