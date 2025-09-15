import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import CustomText from '../CustomText';
import {Colors, FontType, Metrix} from '@/config';
import {ACTIVE_OPACITY} from '@/constants/globalConst';
import {timeHumanize} from '@/utils/business.helper';
import moment from 'moment';

export type NotificationCardProps = {
  style?: any;
  item?: any;
  onPress: any;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  style,
  item,
  onPress,
}) => {
  // const date = new Date(item?.created_at);
  // const localTime = date.toLocaleString();
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // You can customize the date format as needed
  };
  return (
    <TouchableOpacity
      activeOpacity={ACTIVE_OPACITY}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: item?.is_read
            ? Colors.White
            : Colors.TransparentGrey,
        },
        style,
      ]}>
      <CustomText.LargeSemiBoldText
        customStyle={{fontSize: FontType.FontMedium}}>
        {item?.subject}
      </CustomText.LargeSemiBoldText>
      <CustomText.RegularText customStyle={styles.description}>
        {item?.body?.message}
      </CustomText.RegularText>
      <CustomText.RegularText
        customStyle={{fontSize: FontType.FontExtraSmall}}
        isSecondaryColor>
        {formatTime(item?.created_at)}
      </CustomText.RegularText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    paddingHorizontal: Metrix.VerticalSize(15),
    paddingVertical: Metrix.VerticalSize(12),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    marginVertical: Metrix.VerticalSize(5),
  },
  description: {
    fontSize: FontType.FontSemiRegular,
    marginBottom: Metrix.VerticalSize(5),
  },
});

export default NotificationCard;
