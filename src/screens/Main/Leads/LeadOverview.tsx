import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Platform} from 'react-native';
import {MainContainer} from '@/components';
import {Colors, Metrix} from '@/config';
import LeadDetailCard from '@/components/DetailCard/LeadDetailCard';
import IdWithTagCard from '@/components/IdWithTagCard';
import InterestDetailsCard from '@/components/DetailCard/InterestDetailsCard';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useQuery} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import {useRoute} from '@react-navigation/native';

const SkeletonLoader = () => (
  <>
    <SkeletonPlaceholder borderRadius={Metrix.Radius}>
      <View style={styles.card}>
        <View style={styles.rowSkeleton}>
          <View style={styles.skeletonIdText} />
          <View style={styles.skeletonStatusBadge} />
        </View>
      </View>
    </SkeletonPlaceholder>
    {[1, 2].map(() => (
      <SkeletonPlaceholder borderRadius={Metrix.Radius}>
        <View style={styles.skeletonDetailCard}>
          <View style={styles.skeletonHeading} />
          {[1, 2, 3, 4, 5].map((_, i) => (
            <View key={i} style={styles.skeletonRow}>
              <View style={styles.skeletonLeftText} />
              <View style={styles.skeletonRightText} />
            </View>
          ))}
        </View>
      </SkeletonPlaceholder>
    ))}
  </>
);

const LeadOverview = () => {
  const route = useRoute<any>();
  const id = route?.params?.lead?.id;
  const {
    data: leadsOverView,
    isFetching: leadsOverViewLoading,
    isError: leadsOverViewError,
    refetch: leadsOverViewRefetch,
  } = useQuery({
    queryKey: ['leadsOverview'],
    queryFn: () => APIS?.leadsOverview(id),
  });

  const leadsOverViewData = leadsOverView?.data?.data;
  return (
    <MainContainer isHeader isFlatList heading="Lead Overview">
      {leadsOverViewLoading ? (
        <SkeletonLoader />
      ) : (
        <>
          <IdWithTagCard
            id={leadsOverViewData?.lead_num}
            status={leadsOverViewData?.status?.title}
            type={'lead'}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={Platform.select({
              ios: {
                paddingBottom: Metrix.VerticalSize(100),
              },
              android: {
                paddingBottom: Metrix.VerticalSize(140),
              },
            })}>
            <LeadDetailCard
              title={'Lead Information'}
              details={leadsOverViewData}
            />
            <InterestDetailsCard
              title={'Interest Details'}
              details={leadsOverViewData?.interested_project}
            />
          </ScrollView>
        </>
      )}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  skeletonDetailCard: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    paddingHorizontal: Metrix.VerticalSize(14),
    paddingVertical: Metrix.VerticalSize(20),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    marginVertical: Metrix.VerticalSize(6),
  },
  skeletonHeading: {
    width: Metrix.HorizontalSize(180),
    height: Metrix.VerticalSize(22),
    marginBottom: Metrix.VerticalSize(10),
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Metrix.VerticalSize(15),
  },
  skeletonLeftText: {
    width: Metrix.HorizontalSize(130),
    height: Metrix.VerticalSize(18),
  },
  skeletonRightText: {
    width: Metrix.HorizontalSize(90),
    height: Metrix.VerticalSize(18),
  },
  rowSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonIdText: {
    width: Metrix.HorizontalSize(100),
    height: Metrix.VerticalSize(20),
  },
  skeletonStatusBadge: {
    width: Metrix.HorizontalSize(80),
    height: Metrix.VerticalSize(24),
    borderRadius: Metrix.Radius,
  },
  card: {
    backgroundColor: Colors.White,
    marginTop: Metrix.VerticalSize(20),
    borderRadius: Metrix.Radius,
    paddingHorizontal: Metrix.VerticalSize(14),
    paddingVertical: Metrix.VerticalSize(10),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    marginVertical: Metrix.VerticalSize(6),
  },
});

export default LeadOverview;
