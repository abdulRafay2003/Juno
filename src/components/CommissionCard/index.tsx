import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
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

import {set} from 'react-hook-form';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';

export type CommissionCardProps = {
  item?: any;
  style?: any;
  selected?: any;
  onPress?: () => void;
  onInvoicePress?: () => void;
};

const CommissionCard: React.FC<CommissionCardProps> = ({
  item,
  style,
  selected,
  onInvoicePress,
  onPress,
}) => {
  const statusBadges = useSelector(
    (state: RootState) => state?.user?.statusBadges?.commission,
  );

  const statusColors = getStatusColorsFromItem(item?.status, statusBadges);

  const statusStyles = {
    borderColor: statusColors?.primary_hex,
    color: statusColors?.primary_hex,
    backgroundColor: statusColors?.secondary_hex,
  };

  const commissionDetails1 = [
    {
      label: 'Com. No',
      value: item?.commission_num,
    },
    {
      label: 'Unit Name',
      value: item?.project?.unit?.name,
    },
  ];

  const commissionDetails2 = [
    {
      label: 'Unit Price',
      value: formatPricing(item?.project?.unit?.price, ''),
    },
    {
      label: 'Commission%',
      value: item?.commission?.percentage + '%',
    },
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={ACTIVE_OPACITY}
      style={[styles.card, style]}>
      <View style={styles.row}>
        <View style={{flex: 1}}>
          <CustomText.LargeSemiBoldText
            numberOfLines={1}
            customStyle={styles.customerName}>
            {item?.project?.customer_name}
          </CustomText.LargeSemiBoldText>
          <CustomText.RegularText isSecondaryColor customStyle={styles.agency}>
            {item?.project?.name}
          </CustomText.RegularText>
        </View>
        <StatusBadge status={item?.status} statusStyles={statusStyles} />
      </View>
      <View style={styles.infoRow}>
        {commissionDetails1?.map((item, index) => {
          return (
            <View style={styles.infoItem} key={index?.toString()}>
              <CustomText.RegularText
                isSecondaryColor
                customStyle={styles.label}>
                {item?.label}
              </CustomText.RegularText>
              <CustomText.MediumText
                customStyle={styles.value}
                numberOfLines={2}>
                {item?.value}
              </CustomText.MediumText>
            </View>
          );
        })}
      </View>
      <View style={styles.infoRow}>
        {commissionDetails2?.map((item, index) => {
          return (
            <View style={styles.infoItem} key={index?.toString()}>
              <CustomText.RegularText
                isSecondaryColor
                customStyle={styles.label}>
                {item?.label}
              </CustomText.RegularText>
              <CustomText.MediumText
                customStyle={styles.value}
                numberOfLines={2}>
                {item?.value}
              </CustomText.MediumText>
            </View>
          );
        })}
      </View>
      <View style={styles.amountRow}>
        <CustomText.LargeSemiBoldText customStyle={styles.amount}>
          {formatPricing(item?.commission?.amount)}
        </CustomText.LargeSemiBoldText>
        <View style={styles.bottomLeftContainer}>
          {(item?.documents.length > 0 && !item?.can_upload_invoice) ||
          item?.can_upload_invoice ? (
            <TouchableOpacity
              disabled={selected === item?.id}
              activeOpacity={ACTIVE_OPACITY}
              onPress={onInvoicePress}
              style={styles.badge}>
              {selected === item?.id ? (
                <ActivityIndicator size="small" color={Colors.Black} />
              ) : (
                <CustomText.MediumText
                  customStyle={{fontSize: FontType.FontExtraSmall}}>
                  {item?.can_upload_invoice
                    ? 'Upload Invoice'
                    : 'Download Invoice'}
                </CustomText.MediumText>
              )}
            </TouchableOpacity>
          ) : null}
          {/* its been removed form the desing, but iam keeping it here in case design reverts back */}
          {/* <Image
            source={Images.Arrow}
            resizeMode="contain"
            style={styles.arrow}
          /> */}
        </View>
      </View>
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
    alignItems: 'flex-start',
    marginBottom: Metrix.VerticalSize(5),
  },
  customerName: {marginVertical: Metrix.HorizontalSize(0), width: '95%'},
  agency: {
    marginVertical: Metrix.HorizontalSize(0),
    fontSize: FontType.FontSmall,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: Metrix.VerticalSize(5),
  },
  infoItem: {
    paddingRight: Metrix.HorizontalSize(20),
    width: '50%',
  },
  label: {
    marginVertical: Metrix.VerticalSize(0),
    fontSize: FontType.FontExtraSmall,
  },
  value: {
    fontSize: FontType.FontSmall,
  },
  amountRow: {
    borderTopWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    marginTop: Metrix.VerticalSize(10),
    paddingTop: Metrix.VerticalSize(12),
    paddingBottom: Metrix.VerticalSize(5),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  amount: {
    fontSize: FontType.FontMedium,
  },
  badge: {
    borderWidth: 1,
    borderRadius: Metrix.RoundRadius,
    paddingHorizontal: Metrix.HorizontalSize(12),
    paddingVertical: Metrix.VerticalSize(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.Black,
    backgroundColor: Colors.White,
    marginRight: Metrix.HorizontalSize(10),
    width: Metrix.HorizontalSize(120),
  },
  arrow: {
    width: Metrix.HorizontalSize(12),
    height: Metrix.VerticalSize(12),
    transform: [{rotate: '180deg'}],
  },
  bottomLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CommissionCard;
