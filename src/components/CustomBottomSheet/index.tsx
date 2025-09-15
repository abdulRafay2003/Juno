import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Colors, Metrix} from '@/config';
import RBSheet from 'react-native-raw-bottom-sheet';

interface BottomSheetProps {
  sheetRef?: any | null;
  children?: any | null;
  height?: number | null;
  openDuration?: number | null;
  closeDuration?: number | null;
}
const CustomBottomSheet: React.FC<BottomSheetProps> = ({
  sheetRef,
  children,
  height = 150,
  openDuration = 500,
  closeDuration = 500,
}) => {
  return (
    <RBSheet
      ref={sheetRef}
      draggable={true}
      closeOnPressMask={true}
      closeOnPressBack={true}
      openDuration={openDuration}
      closeDuration={closeDuration}
      height={height}
      customStyles={{
        wrapper: {
          backgroundColor: Colors.BlackColorOpacity('0.3'),
        },
        draggableIcon: {
          backgroundColor: Colors.PieChartGray2,
        },
        container: {
          paddingBottom: Metrix.VerticalSize(30),
          borderTopRightRadius: Metrix.HorizontalSize(15),
          borderTopLeftRadius: Metrix.HorizontalSize(15),
        },
      }}>
      {children}
    </RBSheet>
  );
};

export default CustomBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});
