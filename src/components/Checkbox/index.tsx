import {Colors, Images, Metrix} from '@/config';
import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type CheckboxProps = {
  isChecked?: boolean;
  onPress: () => void;
  customStyles?: StyleProp<ViewStyle>;
};

const Checkbox = ({isChecked, onPress, customStyles}: CheckboxProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.checkboxContainer, customStyles]}>
      {isChecked && <Image source={Images.Tick} style={styles.tickImg} />}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  checkboxContainer: {
    borderWidth: 2,
    borderColor: Colors.Black,
    borderRadius: Metrix.VerticalSize(3),
    height: Metrix.VerticalSize(18),
    width: Metrix.VerticalSize(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickImg: {
    height: Metrix.VerticalSize(10),
    width: Metrix.VerticalSize(10),
    resizeMode: 'contain',
  },
});
export default Checkbox;
