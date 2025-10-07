import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CustomText, MainContainer} from '@/components';
import {dispatchToStore} from '@/redux/store';
import {loginSucces} from '@/redux/slice/AuthSlice/authSlice';

const Menu = () => {
  return (
    <MainContainer>
      <CustomText.LargeSemiBoldText
        onPress={() => {
          dispatchToStore(loginSucces(false));
        }}>
        logout
      </CustomText.LargeSemiBoldText>
    </MainContainer>
  );
};

const styles = StyleSheet.create({});

export default Menu;
