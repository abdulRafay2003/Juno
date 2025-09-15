import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {MainContainer, PrimaryButton, SalesOfferCard} from '@/components';
import {Colors, Images, NavigationService, Metrix} from '@/config';
import {RouteNames} from '@/config/routes';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {showToast} from '@/utils/business.helper';
import PendingAccessCard from '@/components/PendingAccessCard';
import { usePendingStatusCheck } from '@/hooks/usePendingStatusCheck';

const PendingSalesOffer = props => {
  // Check user status on every screen focus
  usePendingStatusCheck();
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [loading]);

  const handleAddSalesOffer = () => {
    NavigationService.navigate(RouteNames.HomeRoutes.AddSalesOffer);
  };

  if (loading) {
    return (
      <MainContainer
        firstIcon={() => <Images.RefreshSVG />}
        firstIconPress={() => setLoading(true)}
        isHeader
        isFlatList
        heading="Sales Offer"
        backArrow={false}
        customeStyle={{paddingBottom: Metrix.VerticalSize(0)}}>
        <View style={styles.skeletonListContainer}>
          {[...Array(6)].map((_, idx) => (
            <SkeletonPlaceholder borderRadius={8} key={idx}>
              <SkeletonPlaceholder.Item
                width={'100%'}
                borderRadius={Metrix.Radius}
                marginBottom={12}
                padding={15}
                height={125}
                marginTop={10}
                backgroundColor={Colors.White}
                borderWidth={1}
                borderColor={Colors.TextInputBorderColor}>
                {/* Top row: seq, agency, badge */}
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  marginBottom={Metrix.VerticalSize(8)}>
                  <SkeletonPlaceholder.Item>
                    {/* seq */}
                    <SkeletonPlaceholder.Item
                      width={160}
                      height={18}
                      borderRadius={4}
                      marginBottom={6}
                    />
                    {/* agency */}
                    <SkeletonPlaceholder.Item
                      width={90}
                      height={12}
                      borderRadius={4}
                    />
                  </SkeletonPlaceholder.Item>
                  {/* badge */}
                  <SkeletonPlaceholder.Item
                    width={120}
                    height={20}
                    borderRadius={4}
                    marginBottom={6}
                  />
                </SkeletonPlaceholder.Item>
                {/* Info row: 4 items */}
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  justifyContent="space-between"
                  marginTop={Metrix.VerticalSize(5)}>
                  {[0, 1, 2].map(i => (
                    <SkeletonPlaceholder.Item
                      key={i}
                      marginRight={Metrix.HorizontalSize(20)}>
                      {/* label */}
                      <SkeletonPlaceholder.Item
                        width={40}
                        height={10}
                        borderRadius={3}
                        marginBottom={4}
                      />
                      {/* value */}
                      <SkeletonPlaceholder.Item
                        width={55}
                        height={14}
                        borderRadius={3}
                      />
                    </SkeletonPlaceholder.Item>
                  ))}
                  {/* badge */}
                  <SkeletonPlaceholder.Item
                    width={70}
                    height={22}
                    borderRadius={12}
                    marginTop={5}
                    // marginRight={Metrix.HorizontalSize(20)}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          ))}
        </View>
        <View style={styles.skeletonButtonContainer}>
          <SkeletonPlaceholder borderRadius={8}>
            <SkeletonPlaceholder.Item
              width={'100%'}
              height={48}
              borderRadius={8}
            />
          </SkeletonPlaceholder>
        </View>
      </MainContainer>
    );
  }

  return (
    <MainContainer
      firstIcon={() => <Images.RefreshSVG />}
      firstIconPress={() => setLoading(true)}
      isHeader
      heading="Sales Offer"
      backArrow={false}
      disabled={true}
      customeStyle={{paddingBottom: Metrix.VerticalSize(0), flex: 1}}>
      <View style={styles.pendingAccessContainer}>
        <PendingAccessCard />
      </View>
      <View style={styles.addButtonContainer}>
        <PrimaryButton
          title="Send Sales Offer"
          onPress={handleAddSalesOffer}
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
  contentContainer: {
    paddingBottom: Metrix.VerticalSize(70),
    paddingTop: Metrix.VerticalSize(10),
  },
  skeletonListContainer: {
    paddingTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
  skeletonButtonContainer: {
    marginTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
  skeletonFilterContainer: {
    paddingTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
  pendingAccessContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default PendingSalesOffer;
