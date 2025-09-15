import React from 'react';
import {StyleSheet, View} from 'react-native';
import {PrimaryButton} from '@/components/PrimaryButton';
import {Metrix, NavigationService} from '@/config';
import {MainContainer} from '@/components';
import {RouteNames} from '@/config/routes';
import PendingAccessCard from '@/components/PendingAccessCard';
import { usePendingStatusCheck } from '@/hooks/usePendingStatusCheck';

const PendingAgents = () => {
  // Check user status on every screen focus
  usePendingStatusCheck();
  
  const handleAddNewUser = () => {
    NavigationService.navigate(RouteNames.HomeRoutes.AddAgent);
  };

  return (
    <MainContainer
      isFlatList
      isHeader
      backArrow={false}
      heading="Users"
      customeStyle={{paddingBottom: Metrix.VerticalSize(0), flex: 1}}>
      <View style={styles.pendingAccessContainer}>
        <PendingAccessCard />
      </View>
      <View style={styles.addButtonContainer}>
        <PrimaryButton
          title="Add Agent"
          onPress={handleAddNewUser}
          disabled={true}
        />
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    bottom: Metrix.VerticalSize(5),
    zIndex: 10,
  },
  pendingAccessContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default PendingAgents;
