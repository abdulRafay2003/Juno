import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import CustomText from '../CustomText';
import {Colors, FontType, Metrix} from '@/config';
import StatusBadge from '../StatusBadge';
import {ACTIVE_OPACITY} from '@/constants/globalConst';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import {getStatusColorsFromItem} from '@/utils/business.helper';

export type AgentCardProps = {
  item?: any | null;
  style?: any | null;
  onPress?: () => void;
};

const AgentCard: React.FC<AgentCardProps> = ({item, style, onPress}) => {
  const statusBadges = useSelector(
    (state: RootState) => state?.user?.statusBadges?.user_listing,
  );
  const statusColors = getStatusColorsFromItem(item?.status, statusBadges);

  const statusStyles = {
    borderColor: statusColors?.primary_hex,
    color: statusColors?.primary_hex,
    backgroundColor: statusColors?.secondary_hex,
  };

  const infoDetails1 = [
    {label: 'Agent No:', value: item?.agent_num},
    {label: 'Role:', value: item?.role},
  ];
  const infoDetails2 = [
    {
      label: 'Email ID:',
      value: item?.email,
    },
    {label: 'Mobile:', value: item?.mobile_number},
  ];

  return (
    <TouchableOpacity
      activeOpacity={ACTIVE_OPACITY}
      style={[styles.card, style]}
      onPress={onPress}>
      <View style={styles.row}>
        <View style={{flex: 1}}>
          <CustomText.LargeSemiBoldText
            customStyle={{marginVertical: Metrix.HorizontalSize(0)}}>
            {item?.first_name} {item?.last_name}
          </CustomText.LargeSemiBoldText>
          <CustomText.RegularText isSecondaryColor customStyle={styles.agency}>
            {item?.designation}
          </CustomText.RegularText>
        </View>
        <StatusBadge status={item?.status} statusStyles={statusStyles} />
      </View>
      <View style={styles.infoRow}>
        {infoDetails1?.map((item: dataType, index: number) => {
          return (
            <View key={index?.toString()} style={{width: '48%'}}>
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
      <View style={styles.infoRow}>
        {infoDetails2?.map((item: dataType, index: number) => {
          return (
            <View key={index?.toString()} style={{width: '48%'}}>
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
    gap: Metrix.HorizontalSize(15),
    marginTop: Metrix.VerticalSize(5),
    paddingRight: Metrix.HorizontalSize(2),
  },
  label: {
    marginVertical: Metrix.VerticalSize(0),
    fontSize: FontType.FontExtraSmall,
  },
  value: {
    fontSize: FontType.FontExtraSmall,
  },
});

export default AgentCard;
