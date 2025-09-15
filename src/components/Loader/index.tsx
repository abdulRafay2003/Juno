import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import React from 'react';
import {Colors, Metrix} from '@/config';

type LoaderProps = {isLoading: any};

export const Loader: React.FC<LoaderProps> = ({isLoading = false}) => {
  if (isLoading) {
    return (
      <Modal
        statusBarTranslucent
        visible={isLoading}
        transparent={true}
        animationType={'fade'}>
        <View style={styles.mainContaienr}>
          <View style={styles.backgroundContainer}>
            <ActivityIndicator size={'large'} color={Colors.LightBlack} />
          </View>
        </View>
      </Modal>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  mainContaienr: {
    flex: 1,
    backgroundColor: Colors.BlackColorOpacity('0.5'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundContainer: {
    padding: Metrix.HorizontalSize(22),
    borderRadius: Metrix.Radius,
    backgroundColor: Colors.White,
  },
});
