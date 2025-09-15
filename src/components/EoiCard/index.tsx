import React, {useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import CustomText from '../CustomText';
import {Colors, FontType, Metrix} from '@/config';
import StatusBadge from '../StatusBadge';
import {ACTIVE_OPACITY} from '@/constants/globalConst';
import {formatPricing, getStatusColorsFromItem} from '@/utils/business.helper';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';

export type EOICardProps = {
  item: any; // Ideally define a proper type for item
  style?: any;
  onPress: () => void;
};

type InfoField = {
  label: string;
  value: string | number | undefined;
};

const InfoRow: React.FC<{data: InfoField[]}> = ({data}) => (
  <View style={styles.infoRow}>
    {data.map(({label, value}, idx) => (
      <View key={idx} style={styles.infoItem}>
        <CustomText.RegularText isSecondaryColor customStyle={styles.label}>
          {label}
        </CustomText.RegularText>
        <CustomText.MediumText customStyle={styles.value} numberOfLines={2}>
          {value}
        </CustomText.MediumText>
      </View>
    ))}
  </View>
);

const EOICard: React.FC<EOICardProps> = ({item, style, onPress}) => {
  const statusBadges = useSelector(
    (state: RootState) => state?.user?.statusBadges?.eoi,
  );

  const statusColors = getStatusColorsFromItem(item?.status, statusBadges);

  const statusStyles = {
    borderColor: statusColors?.primary_hex,
    color: statusColors?.primary_hex,
    backgroundColor: statusColors?.secondary_hex,
  };

  const [eoiDetails1, eoiDetails2, eoiDetails3] = useMemo(
    () => [
      [
        {label: 'EOI No', value: item?.eoi_num},
        {label: 'Type', value: item?.buyer?.type},
      ],
      [
        {label: 'Deposit', value: formatPricing(item?.deposit?.amount, '')},
        {label: 'Mode of Payment', value: item?.deposit?.mode},
      ],
      [{label: 'Payment Status', value: item?.payment_status}],
    ],
    [item],
  );

  return (
    <TouchableOpacity
      activeOpacity={ACTIVE_OPACITY}
      onPress={onPress}
      style={[styles.card, style]}>
      {/* Header */}
      <View style={styles.row}>
        <View style={{flex: 1}}>
          <CustomText.LargeSemiBoldText
            numberOfLines={1}
            customStyle={styles.buyerName}>
            {item?.buyer?.name}
          </CustomText.LargeSemiBoldText>
          <CustomText.RegularText isSecondaryColor customStyle={styles.agency}>
            {item?.interested_project?.name}
          </CustomText.RegularText>
        </View>
        <StatusBadge status={item?.status} statusStyles={statusStyles} />
      </View>

      {/* Info Sections */}
      <InfoRow data={eoiDetails1} />
      <InfoRow data={eoiDetails2} />
      <InfoRow data={eoiDetails3} />
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
  buyerName: {
    marginVertical: 0,
    width: '85%',
  },
  agency: {
    marginVertical: 0,
    fontSize: FontType.FontSmall,
    width: '70%',
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
    marginVertical: 0,
    fontSize: FontType.FontExtraSmall,
  },
  value: {
    fontSize: FontType.FontSmall,
  },
});

export default EOICard;
