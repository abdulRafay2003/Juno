import React from 'react';
import {View, StyleSheet} from 'react-native';
import CustomText from '../CustomText';
import {Colors, FontType, Metrix} from '@/config';

export type StatusBadgeProps = {
  status: string;
  statusStyles: any;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({status, statusStyles}) => {
  return (
    <View
      style={[
        styles.badge,
        {
          borderColor: statusStyles?.borderColor,
          backgroundColor: statusStyles?.backgroundColor,
        },
      ]}>
      <CustomText.MediumText
        customStyle={[
          styles.statusText,
          {
            color: statusStyles?.color,
          },
        ]}>
        {status}
      </CustomText.MediumText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: Metrix.RoundRadius,
    paddingHorizontal: Metrix.HorizontalSize(10),
    paddingVertical: Metrix.VerticalSize(2),
    alignItems: 'center',
    justifyContent: 'center',
    // minWidth: Metrix.HorizontalSize(60),
  },
  statusText: {
    fontSize: FontType.FontExtraSmall,
  },
});

export default StatusBadge;
