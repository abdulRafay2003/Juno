import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Metrix, FontType, Images} from '@/config';
import CustomText from '@/components/CustomText';
export type PendingAccessCardProps = {
  text?: string;
  containerStyles?: any;
  textStyles?: any;
};
const PendingAccessCard: React.FC<PendingAccessCardProps> = ({
  text = 'We are verifying your detail. We will notify once its done',
  containerStyles,
  textStyles,
}) => {
  return (
    <View style={[styles.container, containerStyles]}>
      <Image
        source={Images.EmptyIcon}
        style={styles.EmptyIconStyles}
        resizeMode="contain"
      />
      <CustomText.RegularText customStyle={[styles.textStyle, textStyles]}>
        {text}
      </CustomText.RegularText>
    </View>
  );
};

export default PendingAccessCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.LightGreyBadge('0.1'),
    padding: Metrix.VerticalSize(10),
    borderRadius: Metrix.Radius,
    marginTop: Metrix.VerticalSize(10),
    marginBottom: Metrix.VerticalSize(15),
    borderWidth: 1,
    borderColor: Colors.LightGreyBadge('0.2'),
  },
  EmptyIconStyles: {
    height: Metrix.VerticalSize(50),
    width: Metrix.VerticalSize(50),
    alignSelf: 'center',
    marginBottom: Metrix.VerticalSize(10),
  },
  textStyle: {
    color: Colors.LightGreyBadge('0.9'),
    textAlign: 'center',
    fontSize: FontType.FontSemiRegular,
  },
});
