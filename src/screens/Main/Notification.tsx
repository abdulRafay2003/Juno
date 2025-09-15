import React, {useCallback, useMemo, useState, useEffect} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {MainContainer, NotificationCard} from '@/components';
import {Colors, Metrix} from '@/config';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import ListEmpty from '@/components/ListEmpty';
import {showToast} from '@/utils/business.helper';

const Notification = () => {
  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: async ({pageParam = 0}) => {
      const offset = Number(pageParam);
      return await APIS.getNotifications(offset);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const lastRecords = lastPage?.data?.data?.records || [];
      const lastOffset = lastPage?.data?.data?.pagination?.offset ?? 0;

      // If fewer records than expected are returned, we assume it's the end
      if (lastRecords.length < 10) return undefined; // 10 = static limit
      return lastOffset + lastRecords.length;
    },
    staleTime: 300000,
  });

  const notifications =
    data?.pages?.flatMap(page => page?.data?.data?.records || []) ?? [];

  const readNotificationMutate = useMutation({
    mutationFn: (id: any) => APIS?.readNotification(id),
    onSuccess: data => {
      refetch();
    },
    onError: (error: any) => {
      showToast('error', 'Error', error?.response?.data?.message);
    },
  });

  const handleReadNotification = (item: any) => {
    readNotificationMutate.mutate(item?.id);
  };

  const renderItem = ({item}) => (
    <NotificationCard
      item={item}
      onPress={() => handleReadNotification(item)}
    />
  );

  const keyExtractor = item => item.id;

  if (isFetching && !data) {
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
    <MainContainer isFlatList isHeader heading="Notifications" backArrow>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={7}
        windowSize={10}
        removeClippedSubviews={true}
        contentContainerStyle={styles.listContent}
        bounces={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        ListEmptyComponent={() => <ListEmpty />}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" color={Colors.LightBlack} />
          ) : null
        }
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  cardSpacing: {
    marginBottom: Metrix.VerticalSize(5),
  },
  listContent: {
    paddingTop: Metrix.VerticalSize(10),
    paddingBottom: Metrix.VerticalSize(50),
    flexGrow: 1,
  },
  skeletonContainer: {
    paddingTop: Metrix.VerticalSize(15),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
});

export default Notification;
