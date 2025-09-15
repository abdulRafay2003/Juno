import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from 'react-native';
import CustomText from '../CustomText';
import {Colors, FontType, Metrix, Images} from '@/config';
import StatusBadge from '../StatusBadge';
import {ACTIVE_OPACITY} from '@/constants/globalConst';
import {formatDate, formatPricing} from '@/utils/business.helper';

interface dataType {
  label: string;
  value: string;
}

export type OverviewCardProps = {
  style?: any | null;
  item: any;
};

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const OverviewCard: React.FC<OverviewCardProps> = ({style, item}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {type: LayoutAnimation.Types.easeInEaseOut},
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
    setIsExpanded(!isExpanded);
  };
  // Essential details shown initially (half height)
  const essentialDetails = [
    {
      label: 'Unit No',
      value: item?.detail?.unit_name_or_number || '-',
    },
    {
      label: 'SPA Status',
      value: item?.status?.spa_status || '-',
    },
    {
      label: 'RC Status',
      value: item?.status?.rc_status || '-',
    },
    {
      label: 'Commission Eligibility Status',
      value: item?.commission?.eligible || '-',
    },
    // {
    //   label: 'Bedroom',
    //   value: item?.noOfBedrooms || '-',
    // },
    // {
    //   label: 'Building',
    //   value: item?.buildingName || '-',
    // },
    // {
    //   label: 'Booking',
    //   value: formatDate(item?.bookingDate) || '-',
    // },
  ];

  // Additional details shown when expanded
  const additionalDetails1 = [
    {
      label: 'Downpayment',
      value: `${item?.status?.down_payment_percentage_paid}%` || '-',
    },

    {
      label: 'Bedroom',
      value: item?.details?.number_of_bedrooms || '-',
    },

    {
      label: 'Booking',
      value: formatDate(item?.bookingDate) || '-',
    },
  ];
  const additionalDetails2 = [
    // {
    //   label: 'SPA Status',
    //   value: item?.spaStatus || '-',
    // },
    // {
    //   label: 'RC Status',
    //   value: item?.rcStatus || '-',
    // },
    // {
    //   label: 'Eligibility Status',
    //   value: item?.commissionEligible || '-',
    // },
    // {
    //   label: 'Downpayment',
    //   value: `${item?.status?.down_payment_percentage_paid}%` || '-',
    // },
    // {
    //   label: 'Remarks',
    //   value: item?.commission?.reason_array || '-',
    // },

    // {
    //   label: 'Bedroom',
    //   value: item?.noOfBedrooms || '-',
    // },
    // {
    //   label: 'Building',
    //   value: item?.buildingName || '-',
    // },
    // {
    //   label: 'Booking',
    //   value: formatDate(item?.bookingDate) || '-',
    // },
    {
      label: 'Agent Name',
      value: item?.agent?.first_name + ' ' + item?.agent?.last_name || '-',
    },
  ];

  return (
    <TouchableOpacity
      activeOpacity={ACTIVE_OPACITY}
      style={[styles.card, style]}>
      <View style={styles.row}>
        <View style={styles.horizontalTextContainer}>
          <CustomText.LargeSemiBoldText
            numberOfLines={1}
            customStyle={styles.agencySemiRegular}>
            {item?.customer?.full_name || '-'}

            {/* {`${item?.agentFName} ${item?.agentLName}`} */}
          </CustomText.LargeSemiBoldText>
          <CustomText.RegularText
            isSecondaryColor
            customStyle={styles.sellingPrice}>
            Price (AED)
          </CustomText.RegularText>
        </View>
        <View style={styles.horizontalTextContainer}>
          <CustomText.RegularText isSecondaryColor customStyle={styles.agency}>
            {item?.detail?.project || '-'}
          </CustomText.RegularText>
          <CustomText.LargeSemiBoldText>
            {formatPricing(item?.detail?.price)}
          </CustomText.LargeSemiBoldText>
        </View>
      </View>

      {/* Essential details - always visible */}
      <View style={styles.infoRowColumn}>
        {essentialDetails?.map((detail: dataType, index: number) => {
          return (
            <View key={`essential-${index}`} style={styles.infoItemFullWidth}>
              <CustomText.RegularText
                isSecondaryColor
                customStyle={styles.label}>
                {detail?.label}
              </CustomText.RegularText>
              <CustomText.MediumText
                numberOfLines={2}
                customStyle={styles.value}>
                {detail?.value}
              </CustomText.MediumText>
            </View>
          );
        })}
      </View>

      {/* Additional details - shown when expanded */}
      {isExpanded && (
        <>
          <View style={styles.infoRowColumn}>
            <CustomText.RegularText isSecondaryColor customStyle={styles.label}>
              Reason
            </CustomText.RegularText>
            {item?.commission?.reason_array?.map(
              (detail: any, index: number) => {
                return (
                  <View
                    key={`additional-${index}`}
                    style={styles.reasonItemRow}>
                    {/* <CustomText.RegularText
                    isSecondaryColor
                    customStyle={styles.label}>
                    {detail?.label}
                  </CustomText.RegularText> */}
                    <View style={styles.reasonDot} />
                    <CustomText.MediumText
                      numberOfLines={10}
                      customStyle={styles.value}>
                      {detail}
                    </CustomText.MediumText>
                  </View>
                );
              },
            )}
          </View>
          <View style={styles.infoRowMarginTop}>
            {additionalDetails2?.map((detail: dataType, index: number) => {
              return (
                <View
                  key={`additional-${index}`}
                  style={styles.infoItemFullWidth}>
                  <CustomText.RegularText
                    isSecondaryColor
                    customStyle={styles.label}>
                    {detail?.label}
                  </CustomText.RegularText>
                  <CustomText.MediumText
                    numberOfLines={2}
                    customStyle={styles.value}>
                    {detail?.value}
                  </CustomText.MediumText>
                </View>
              );
            })}
          </View>
          <View style={[styles.infoRow]}>
            {additionalDetails1?.map((detail: dataType, index: number) => {
              return (
                <View
                  key={`additional-${index}`}
                  style={styles.infoItemSmallWidth}>
                  <CustomText.RegularText
                    isSecondaryColor
                    customStyle={styles.label}>
                    {detail?.label}
                  </CustomText.RegularText>
                  <CustomText.MediumText
                    numberOfLines={2}
                    customStyle={styles.value}>
                    {detail?.value}
                  </CustomText.MediumText>
                </View>
              );
            })}
          </View>
        </>
      )}

      {/* Expand/Collapse Button */}
      <TouchableOpacity
        activeOpacity={ACTIVE_OPACITY}
        style={styles.expandButton}
        onPress={toggleExpanded}>
        <View style={styles.buttonContent}>
          <CustomText.RegularText customStyle={styles.expandButtonText}>
            {isExpanded ? 'View Less' : 'View More'}
          </CustomText.RegularText>
          <Image
            source={Images.ArrowChevron}
            resizeMode="contain"
            style={[
              styles.arrowIcon,
              isExpanded ? styles.arrowIconRotated : null,
            ]}
          />
        </View>
        {/* <View style={styles.underline} /> */}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    paddingHorizontal: Metrix.VerticalSize(14),
    paddingVertical: Metrix.VerticalSize(10),
    paddingBottom: Metrix.VerticalSize(15), // Extra bottom padding for button
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    marginVertical: Metrix.VerticalSize(6),
  },
  horizontalTextContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderWidth: 1,
  },
  sellingPrice: {
    marginVertical: Metrix.HorizontalSize(0),
    fontSize: FontType.FontSemiRegular,
  },
  row: {
    marginBottom: Metrix.VerticalSize(5),
  },
  agency: {
    marginVertical: Metrix.HorizontalSize(0),
    fontSize: FontType.FontSmall,
    width: '75%',
  },
  agencySemiRegular: {
    marginVertical: Metrix.HorizontalSize(0),
    fontSize: FontType.FontSemiRegular,
    width: '75%',
  },
  infoRow: {
    flexDirection: 'row',
    // marginTop: Metrix.VerticalSize(5),
  },
  infoRowColumn: {
    flexDirection: 'column',
  },
  infoItem: {
    paddingRight: Metrix.HorizontalSize(12),
    width: '50%',
  },
  infoItemFullWidth: {
    paddingRight: Metrix.HorizontalSize(12),
    width: '100%',
    marginBottom: Metrix.VerticalSize(5),
  },
  reasonItemRow: {
    paddingRight: Metrix.HorizontalSize(12),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrix.VerticalSize(5),
  },
  reasonDot: {
    height: Metrix.VerticalSize(5),
    width: Metrix.HorizontalSize(5),
    backgroundColor: Colors.Black,
    borderRadius: Metrix.VerticalSize(5),
    marginHorizontal: Metrix.HorizontalSize(5),
  },
  infoRowMarginTop: {
    flexDirection: 'row',
    marginTop: Metrix.VerticalSize(5),
  },
  infoItemSmallWidth: {
    paddingRight: Metrix.HorizontalSize(12),
    width: '38%',
    marginBottom: Metrix.VerticalSize(5),
  },
  label: {
    marginVertical: Metrix.VerticalSize(0),
    fontSize: FontType.FontExtraSmall,
  },
  value: {
    fontSize: FontType.FontSmall,
  },
  expandButton: {
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
    paddingVertical: 0,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  expandButtonText: {
    color: Colors.Grey,
    fontSize: FontType.FontExtraSmall,
    fontWeight: '500',
    marginRight: Metrix.HorizontalSize(3),
  },
  arrowIcon: {
    width: Metrix.HorizontalSize(8),
    height: Metrix.VerticalSize(8),
    tintColor: Colors.Grey,
  },
  arrowIconRotated: {
    transform: [{rotate: '180deg'}],
  },
  underline: {
    height: 1,
    backgroundColor: Colors.Grey,
    marginTop: Metrix.VerticalSize(5),
    alignSelf: 'center',
    minWidth: Metrix.HorizontalSize(80), // Minimum width to cover text and arrow
  },
});

export default OverviewCard;
