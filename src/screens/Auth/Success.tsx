import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CustomText} from '@/components';

const Success = () => {
  return (
    <View style={{flex: 1}}>
      <CustomText.LargeSemiBoldText>Welcome Login</CustomText.LargeSemiBoldText>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Success;
