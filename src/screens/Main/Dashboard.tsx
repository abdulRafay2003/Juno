import React from 'react';
import {View, StyleSheet} from 'react-native';
import CustomText from '@/components/CustomText';
import {MainContainer} from '@/components';

const Dashboard = props => {
  return (
    <MainContainer>
      <CustomText.LargeSemiBoldText>Welcome</CustomText.LargeSemiBoldText>
    </MainContainer>
  );
};

const styles = StyleSheet.create({});

export default Dashboard;
