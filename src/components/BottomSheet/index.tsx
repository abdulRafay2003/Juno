import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Metrix, FontType} from '@/config';
import CustomText from '../CustomText';
import CustomBottomSheet from '../CustomBottomSheet';

interface BottomSheetProps {
  sheetRef: any | null;
  heading: string | null;
  subHeading: string | null;
  height?: number | null;
  children?: any | null;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  sheetRef,
  heading,
  subHeading,
  height = 400,
  children,
}) => {
  return (
    <CustomBottomSheet height={height} sheetRef={sheetRef}>
      <View style={styles.sheetContainer}>
        <CustomText.LargeSemiBoldText>{heading}</CustomText.LargeSemiBoldText>
        <CustomText.RegularText
          customStyle={styles.sheetDescription}
          isSecondaryColor>
          {subHeading}
        </CustomText.RegularText>
        <View style={{width: '100%'}}>{children}</View>
      </View>
    </CustomBottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    alignItems: 'center',
    padding: Metrix.HorizontalSize(20),
    width: '100%',
  },
  sheetDescription: {
    fontSize: FontType.FontSmall,
    textAlign: 'center',
    marginTop: Metrix.VerticalSize(5),
    marginBottom: Metrix.VerticalSize(10),
    width: '95%',
  },
});

export default BottomSheet;
