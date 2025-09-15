import {Colors, Metrix} from '@/config';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import StatusBadge from '../StatusBadge';
import CustomText from '../CustomText';
import {getStatusColorsFromItem} from '@/utils/business.helper';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';

const IdWithTagCard = ({id, status, type}) => {
  const statusBadges = useSelector(
    (state: RootState) => state?.user?.statusBadges?.[type],
  );
  const statusColors = getStatusColorsFromItem(status, statusBadges);
  const statusStyles = {
    borderColor: statusColors?.primary_hex,
    color: statusColors?.primary_hex,
    backgroundColor: statusColors?.secondary_hex,
  };
  return (
    <View style={[styles.card]}>
      <View style={styles.row}>
        <View style={{flex: 1}}>
          <CustomText.LargeSemiBoldText
            customStyle={{marginVertical: Metrix.HorizontalSize(0)}}>
            {id}
          </CustomText.LargeSemiBoldText>
        </View>
        <StatusBadge status={status} statusStyles={statusStyles} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.White,
    marginTop: Metrix.VerticalSize(20),
    marginBottom: Metrix.VerticalSize(10),
    borderRadius: Metrix.Radius,
    paddingHorizontal: Metrix.VerticalSize(14),
    paddingVertical: Metrix.VerticalSize(12),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    marginVertical: Metrix.VerticalSize(6),
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonIdText: {
    width: Metrix.HorizontalSize(100),
    height: Metrix.VerticalSize(20),
  },
  skeletonStatusBadge: {
    width: Metrix.HorizontalSize(80),
    height: Metrix.VerticalSize(24),
    borderRadius: Metrix.Radius,
  },
});

export default IdWithTagCard;
