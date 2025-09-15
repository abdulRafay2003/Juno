import {Colors, Metrix} from '@/config';
import React from 'react';
import {
  View,
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const CustomSwitch = ({value, onChange}) => {
  const pressSwitch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onChange(!value);
  };
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.switch, value ? styles.switchOn : styles.switchOff]}
      onPress={pressSwitch}>
      <View
        style={[
          styles.switchCircle,
          value ? styles.whiteCircle : styles.redCircle,
        ]}
      />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  switchCircle: {
    height: Metrix.VerticalSize(25),
    width: Metrix.VerticalSize(25),
    borderRadius: Metrix.VerticalSize(20),
  },
  switchOn: {
    backgroundColor: Colors.Black,
    alignItems: 'flex-end',
    paddingRight: Metrix.VerticalSize(1),
  },
  switchOff: {
    backgroundColor: Colors.TextInputBorderColor,
    alignItems: 'flex-start',
    paddingLeft: Metrix.VerticalSize(1),
  },
  switch: {
    width: Metrix.VerticalSize(51),
    height: Metrix.VerticalSize(29),
    borderRadius: Metrix.VerticalSize(20),
    marginLeft: Metrix.VerticalSize(20),
    justifyContent: 'center',
    borderColor: Colors.Black,
    backgroundColor: Colors.White,
  },
  whiteCircle: {
    backgroundColor: Colors.White,
  },
  redCircle: {
    backgroundColor: Colors.White,
  },
});
export default CustomSwitch;
