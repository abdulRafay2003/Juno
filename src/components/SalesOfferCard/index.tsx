import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import CustomText from '../CustomText';
import {Colors, FontType, Images, Metrix, NavigationService} from '@/config';
import StatusBadge from '../StatusBadge';
import {ACTIVE_OPACITY} from '@/constants/globalConst';
import {RouteNames} from '@/config/routes';
import {
  downloadInvoice,
  formatPricing,
  getStatusColorsFromItem,
} from '@/utils/business.helper';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import moment from 'moment';

export type SalesOfferCardProps = {
  style?: any;
  item?: any; // Optional, if you want to pass the entire item object
  onPress?: () => void;
  onDownloadPress: () => void;
  selected: any;
};

const salesOfferOptions = [
  {
    title: 'Send Offer',
    icon: () => (
      <Images.SendSVG
        width={Metrix.HorizontalSize(15)}
        height={Metrix.VerticalSize(15)}
        marginRight={Metrix.HorizontalSize(8)}
      />
    ),
  },
  {
    title: 'Download Offer',
    icon: () => (
      <Images.DownloadSVG
        width={Metrix.HorizontalSize(15)}
        height={Metrix.VerticalSize(15)}
        marginRight={Metrix.HorizontalSize(8)}
      />
    ),
  },
];
const SalesOfferCard: React.FC<SalesOfferCardProps> = ({
  style,
  item,
  onPress,
  onDownloadPress = () => {}, // Default to empty function if not provided
  selected,
}) => {
  const statusBadges = useSelector(
    (state: RootState) => state?.user?.statusBadges?.sale_offer,
  );
  const statusColors = getStatusColorsFromItem(item?.status, statusBadges);
  const statusStyles = {
    borderColor: statusColors?.primary_hex,
    color: statusColors?.primary_hex,
    backgroundColor: statusColors?.secondary_hex,
  };
  const leadDetails1 = [
    {
      label: 'S/O No',
      value: item?.saleoffer_num,
    },
    {
      label: 'Unit No',
      value: item?.interested_project?.unit?.name,
    },
  ];
  const leadDetails2 = [
    {
      label: 'Type',
      value: item?.interested_project?.unit?.type,
    },
    {
      label: 'Created At',
      value: moment(item?.created_at).format('DD-MM-YYYY'),
    },
  ];

  const handleOfferNavigation = (opt: any) => {
    if (opt?.title == 'Download Offer') {
      onDownloadPress();
    } else {
      NavigationService.navigate(RouteNames.HomeRoutes.OfferReady, {
        document: item?.documents[0],
      });
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={ACTIVE_OPACITY}
      style={[styles.card, style]}
      onPress={onPress}>
      <View style={styles.row}>
        <View style={{flex: 1}}>
          <View style={styles.titleContainer}>
            <CustomText.LargeSemiBoldText
              customStyle={{marginVertical: Metrix.HorizontalSize(0)}}>
              {item?.interested_project?.name}
            </CustomText.LargeSemiBoldText>
            <CustomText.LargeSemiBoldText>
              {formatPricing(item?.interested_project?.unit?.price)}
            </CustomText.LargeSemiBoldText>
          </View>
          <View style={[styles.titleContainer]}>
            <CustomText.RegularText
              isSecondaryColor
              customStyle={styles.agency}>
              {item?.interested_project?.building?.name}
            </CustomText.RegularText>
            <StatusBadge status={item?.status} statusStyles={statusStyles} />
          </View>
        </View>
      </View>
      <View style={styles.infoRow}>
        {leadDetails1?.map((item: dataType, index: number) => {
          return (
            <View key={index?.toString()} style={styles.infoTopItem}>
              <CustomText.RegularText
                isSecondaryColor
                customStyle={styles.label}>
                {item?.label}
              </CustomText.RegularText>
              <CustomText.MediumText
                numberOfLines={2}
                customStyle={styles.value}>
                {item?.value}
              </CustomText.MediumText>
            </View>
          );
        })}
      </View>
      <View style={{flexDirection: 'row'}}>
        {leadDetails2?.map((item: dataType, index: number) => {
          return (
            <View key={index?.toString()} style={{width: '50%'}}>
              <CustomText.RegularText
                isSecondaryColor
                customStyle={styles.label}>
                {item?.label}
              </CustomText.RegularText>
              <CustomText.MediumText
                numberOfLines={2}
                customStyle={styles.value}>
                {item?.value}
              </CustomText.MediumText>
            </View>
          );
        })}
      </View>

      {item?.status == 'Document Generated' && (
        <View style={styles.floorPlanContainer}>
          {salesOfferOptions.map((opt, planIndex) => (
            <TouchableOpacity
              key={planIndex}
              disabled={selected ? true : false}
              activeOpacity={ACTIVE_OPACITY}
              style={styles.floorPanBtn}
              onPress={() => handleOfferNavigation(opt)}>
              {selected == item?.id && opt?.title == 'Download Offer' ? (
                <ActivityIndicator size={'small'} color={Colors.Black} />
              ) : (
                <>
                  {opt?.icon()}
                  <CustomText.RegularText
                    customStyle={{fontSize: FontType.FontSmall}}>
                    {opt?.title}
                  </CustomText.RegularText>
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    paddingHorizontal: Metrix.VerticalSize(14),
    paddingVertical: Metrix.VerticalSize(10),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    marginVertical: Metrix.VerticalSize(6),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrix.VerticalSize(5),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  agency: {
    marginVertical: Metrix.HorizontalSize(0),
    fontSize: FontType.FontSmall,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Metrix.VerticalSize(5),
  },
  infoTopItem: {
    width: '50%',
  },
  label: {
    marginVertical: Metrix.VerticalSize(0),
    fontSize: FontType.FontExtraSmall,
  },
  value: {
    fontSize: FontType.FontSmall,
  },
  floorPlanContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Metrix.VerticalSize(10),
    paddingTop: Metrix.VerticalSize(15),
    paddingBottom: Metrix.VerticalSize(5),
    borderTopWidth: 1,
    borderColor: Colors.TextInputBorderColor,
  },
  floorPanBtn: {
    borderWidth: 1,
    paddingVertical: Metrix.VerticalSize(7),
    // paddingHorizontal: Metrix.VerticalSize(10),
    width: '48%',
    borderRadius: Metrix.RoundRadius,
    borderColor: Colors.TextInputBorderColor,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  iconStyle: {
    width: Metrix.HorizontalSize(15),
    height: Metrix.VerticalSize(15),
    marginRight: Metrix.HorizontalSize(8),
  },
});

export default SalesOfferCard;
