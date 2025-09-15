import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import CustomText from '../CustomText';
import {Colors, FontType, Metrix} from '@/config';
import {ACTIVE_OPACITY} from '@/constants/globalConst';

export type AnnouncementCardProps = {
  title: string;
  description: string;
  time: string;
  date: string; // format: 'YYYY-MM-DD' or '2024-05-02'
  style?: any;
  isUnread?: boolean;
  onPress?: () => void;
};

const getDayMonth = (dateString: string) => {
  const dateObj = new Date(dateString);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleString('default', {month: 'short'});
  return {day, month};
};

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  title,
  description,
  time,
  date,
  style,
  isUnread = false,
  onPress,
}) => {
  const {day, month} = getDayMonth(date);
  return (
    <TouchableOpacity
      activeOpacity={ACTIVE_OPACITY}
      onPress={onPress}
      style={[
        styles.card,
        {backgroundColor: isUnread ? Colors.UnreadColor : Colors.White},
        style,
      ]}>
      <View style={styles.dateHeadingContainer}>
        <View style={[styles.dateBox]}>
          <CustomText.MediumText customStyle={styles.day}>
            {day}
          </CustomText.MediumText>
          <CustomText.RegularText customStyle={styles.month}>
            {month}
          </CustomText.RegularText>
        </View>
        <CustomText.LargeSemiBoldText customStyle={styles.title}>
          {title}
        </CustomText.LargeSemiBoldText>
      </View>

      <View style={styles.contentBox}>
        <CustomText.RegularText customStyle={styles.description}>
          {description}
        </CustomText.RegularText>
        <CustomText.RegularText customStyle={styles.time} isSecondaryColor>
          {time}
        </CustomText.RegularText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    padding: Metrix.VerticalSize(15),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    marginVertical: Metrix.VerticalSize(5),
  },
  dateHeadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrix.VerticalSize(5),
  },
  dateBox: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.LightRadius,
    alignItems: 'center',
    justifyContent: 'center',
    width: Metrix.HorizontalSize(50),
    height: Metrix.HorizontalSize(50),
    marginRight: Metrix.HorizontalSize(10),
    // paddingVertical: Metrix.VerticalSize(9),
  },
  day: {
    fontSize: FontType.FontExtraLarge2,
    marginVertical: Metrix.HorizontalSize(0),
  },
  month: {
    fontSize: FontType.FontSmall,
    marginVertical: Metrix.HorizontalSize(0),
  },
  contentBox: {
    flex: 1,
  },
  title: {
    fontSize: FontType.FontLarge,
    marginBottom: Metrix.VerticalSize(2),
    width: '80%',
  },
  description: {
    marginBottom: Metrix.VerticalSize(5),
    marginTop: Metrix.VerticalSize(15),
  },
  time: {
    color: Colors.Grey,
    fontSize: FontType.FontExtraSmall,
  },
});

export default AnnouncementCard;
