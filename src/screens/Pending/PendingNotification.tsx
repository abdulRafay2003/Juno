import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {MainContainer} from '@/components';
import {Colors, Metrix} from '@/config';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import PendingAccessCard from '@/components/PendingAccessCard';
import { usePendingStatusCheck } from '@/hooks/usePendingStatusCheck';

const PendingNotification = () => {
  // Check user status on every screen focus
  usePendingStatusCheck();
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <MainContainer isFlatList isHeader heading="Notifications" backArrow>
        <View style={styles.skeletonContainer}>
          {[...Array(7)].map((_, idx) => (
            <SkeletonPlaceholder borderRadius={8} key={idx}>
              <SkeletonPlaceholder.Item
                width={'100%'}
                borderRadius={Metrix.Radius}
                marginBottom={12}
                padding={Metrix.VerticalSize(15)}
                backgroundColor={Colors.White}
                borderWidth={1}
                borderColor={Colors.TextInputBorderColor}
                flexDirection="column">
                {/* Row 1: Date box + Title */}
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="center"
                  marginBottom={Metrix.VerticalSize(5)}>
                  {/* Title */}
                  <SkeletonPlaceholder.Item
                    width={350}
                    height={30}
                    borderRadius={4}
                  />
                </SkeletonPlaceholder.Item>
                {/* Row 2: Description */}
                <SkeletonPlaceholder.Item
                  width={300}
                  height={14}
                  borderRadius={3}
                  marginTop={Metrix.VerticalSize(5)}
                  marginBottom={Metrix.VerticalSize(5)}
                />
                {/* Row 3: Time */}
                <SkeletonPlaceholder.Item
                  width={60}
                  height={10}
                  borderRadius={3}
                  marginTop={Metrix.VerticalSize(5)}
                  marginBottom={2}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          ))}
        </View>
      </MainContainer>
    );
  }

  return (
    <MainContainer
      isHeader
      heading="Notifications"
      backArrow
      customeStyle={{flex: 1}}>
      <View style={styles.pendingAccessCardContainer}>
        <PendingAccessCard />
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  pendingAccessCardContainer: {flexGrow: 1, justifyContent: 'center'},
  skeletonContainer: {
    paddingTop: Metrix.VerticalSize(15),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
});

export default PendingNotification;
