import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import CustomText from '../CustomText';
import {Colors, FontType, Metrix} from '@/config';
import StatusBadge from '../StatusBadge';
import {ACTIVE_OPACITY} from '@/constants/globalConst';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import {getStatusColorsFromItem} from '@/utils/business.helper';

export type LeadsCardProps = {
  item: any;
  style?: any;
  onPress?: () => void;
};

const LeadsCard: React.FC<LeadsCardProps> = ({item, style, onPress}) => {
  const statusBadges = useSelector(
    (state: RootState) => state?.user?.statusBadges?.lead,
  );

  const statusColors = getStatusColorsFromItem(
    item?.status?.title,
    statusBadges,
  );

  const statusStyles = {
    borderColor: statusColors?.primary_hex,
    color: statusColors?.primary_hex,
    backgroundColor: statusColors?.secondary_hex,
  };

  const leadDetails = [
    {
      label: 'Lead No',
      value: item?.lead_num,
    },
    item?.interested_project?.type && {
      label: 'Property Type',
      value: item?.interested_project?.type,
    },
  ].filter(Boolean);

  return (
    <TouchableOpacity
      activeOpacity={ACTIVE_OPACITY}
      style={[styles.card, style]}
      onPress={onPress}>
      <View style={styles.row}>
        <View style={{flex: 1}}>
          <CustomText.LargeSemiBoldText
            customStyle={{marginVertical: Metrix.HorizontalSize(0)}}>
            {item?.full_name}
          </CustomText.LargeSemiBoldText>
          <CustomText.RegularText isSecondaryColor customStyle={styles.agency}>
            {item?.interested_project?.name}
          </CustomText.RegularText>
        </View>
        <StatusBadge status={item?.status?.title} statusStyles={statusStyles} />
      </View>
      <View style={styles.infoRow}>
        {leadDetails?.map((item: dataType, index: number) => {
          return (
            <View key={index?.toString()} style={styles.infoItem}>
              <CustomText.RegularText
                isSecondaryColor
                customStyle={styles.label}>
                {item?.label}
              </CustomText.RegularText>
              <CustomText.MediumText customStyle={styles.value}>
                {item?.value}
              </CustomText.MediumText>
            </View>
          );
        })}
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
  agency: {
    fontSize: FontType.FontSmall,
  },
  badge: {
    borderWidth: 1,
    borderRadius: Metrix.RoundRadius,
    paddingHorizontal: Metrix.HorizontalSize(10),
    paddingVertical: Metrix.VerticalSize(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: Metrix.VerticalSize(5),
  },
  infoItem: {
    paddingRight: Metrix.HorizontalSize(40),
    width: '50%',
  },
  label: {
    marginVertical: Metrix.VerticalSize(0),
    fontSize: FontType.FontExtraSmall,
  },
  value: {
    fontSize: FontType.FontSmall,
  },
});

export default LeadsCard;
