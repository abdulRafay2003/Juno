import React, {useEffect} from 'react';
import {View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {MainContainer, OverviewCard} from '@/components';
import {Metrix, Colors} from '@/config';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import ListEmpty from '@/components/ListEmpty';
import {useIsFocused} from '@react-navigation/native';

const Overview = () => {
  const focused = useIsFocused();
  const queryClient = useQueryClient();
  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['overview'],
    queryFn: async ({pageParam = 0}) => {
      const offset = Number(pageParam);
      return await APIS.getOverview(offset);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const lastRecords = lastPage?.data?.data?.records || [];
      const lastOffset = lastPage?.data?.data?.pagination?.offset ?? 0;

      // If fewer records than expected are returned, we assume it's the end
      if (lastRecords.length < 10) return undefined; // 10 = static limit
      return lastOffset + lastRecords.length;
    },
    staleTime: 10000,
  });
  const overviewData =
    data?.pages?.flatMap(page => page?.data?.data?.records || []) ?? [];

  useEffect(() => {
    if (focused) {
      onRefresh();
    }
    return () => queryClient.cancelQueries({queryKey: ['overview']});
  }, [focused]);

  const onRefresh = async () => {
    queryClient.removeQueries({queryKey: ['overview']}); // reset pagination
    await refetch(); // re-trigger with fresh state (offset 0)
  };

  const renderOverItem = ({item}) => {
    return <OverviewCard item={item} />;
  };

  if (isFetching && !data) {
    return (
      <MainContainer
        isHeader
        isFlatList
        heading="Overview"
        customeStyle={styles.mainContainer}>
        <View style={styles.skeletonListContainer}>
          {[...Array(4)].map((_, idx) => (
            <SkeletonPlaceholder borderRadius={8} key={idx}>
              <SkeletonPlaceholder.Item
                width={'100%'}
                borderRadius={Metrix.Radius}
                marginBottom={12}
                padding={15}
                height={260}
                marginTop={10}
                backgroundColor={Colors.White}
                borderWidth={1}
                borderColor={Colors.TextInputBorderColor}>
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  marginBottom={Metrix.VerticalSize(8)}>
                  <SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item
                      width={160}
                      height={18}
                      borderRadius={4}
                      marginBottom={6}
                    />
                    <SkeletonPlaceholder.Item
                      width={90}
                      height={18}
                      borderRadius={4}
                    />
                  </SkeletonPlaceholder.Item>
                  <SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item
                      width={120}
                      height={18}
                      borderRadius={4}
                      marginBottom={6}
                    />
                    <SkeletonPlaceholder.Item
                      width={80}
                      height={18}
                      borderRadius={4}
                      left={40}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>

                <SkeletonPlaceholder.Item
                  // flexDirection="row"
                  marginTop={Metrix.VerticalSize(5)}>
                  <SkeletonPlaceholder.Item marginTop={5}>
                    <SkeletonPlaceholder.Item
                      width={'100%'}
                      height={33}
                      borderRadius={3}
                      marginBottom={4}
                    />
                  </SkeletonPlaceholder.Item>
                  <SkeletonPlaceholder.Item marginTop={10}>
                    <SkeletonPlaceholder.Item
                      width={'100%'}
                      height={33}
                      borderRadius={3}
                      marginBottom={4}
                    />
                  </SkeletonPlaceholder.Item>
                  <SkeletonPlaceholder.Item marginTop={10}>
                    <SkeletonPlaceholder.Item
                      width={'100%'}
                      height={33}
                      borderRadius={3}
                      marginBottom={4}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  width={80}
                  height={20}
                  borderRadius={3}
                  marginTop={10}
                  alignSelf="center"
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
      isFlatList
      heading="Overview"
      customeStyle={styles.mainContainer}>
      <FlatList
        data={overviewData}
        keyExtractor={(item, idx) => item?.id?.toString() ?? idx?.toString()}
        renderItem={renderOverItem}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
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
  mainContainer: {
    paddingBottom: Metrix.VerticalSize(0),
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: Metrix.VerticalSize(80),
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
});

export default Overview;
