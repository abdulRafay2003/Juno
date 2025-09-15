import React, {useEffect, useState} from 'react';
import {StyleSheet, FlatList, View, ActivityIndicator} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import AgentCard from '@/components/AgentCard';
import {PrimaryButton} from '@/components/PrimaryButton';
import {Colors, Images, Metrix, NavigationService} from '@/config';
import {MainContainer} from '@/components';
import {agentsData} from '@/constants/dummyData';
import {RouteNames} from '@/config/routes';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import ListEmpty from '@/components/ListEmpty';
import AgentSkeleton from '@/components/Skeleton/AgentSkeleton';

const Agents = () => {
  const queryClient = useQueryClient();
  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: async ({pageParam = 0}) => {
      const offset = Number(pageParam);
      return await APIS.getUsers(offset);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const lastRecords = lastPage?.data?.data?.records || [];
      const lastOffset = lastPage?.data?.data?.pagination?.offset ?? 0;
      // If fewer records than expected are returned, we assume it's the end
      if (lastRecords.length < 10) return undefined; // 10 = static limit
      return lastOffset + lastRecords.length;
    },
    staleTime: 0,
  });
  const usersData =
    data?.pages?.flatMap(page => page?.data?.data?.records || []) ?? [];

  const onRefresh = async () => {
    queryClient.clear();
    queryClient.removeQueries({queryKey: ['users']}); // reset pagination
    await refetch(); // re-trigger with fresh state (offset 0)
  };
  const focused = useIsFocused();
  // Refetch data when screen comes into focus
  useEffect(() => {
    if (focused) {
      onRefresh();
    }
  }, [focused]);

  useEffect(() => {
    return () => {
      queryClient.cancelQueries({queryKey: ['users']}).catch(() => {});
    };
  }, [queryClient]);

  const renderItem = ({item}: any) => (
    <AgentCard
      item={item}
      onPress={() =>
        NavigationService.navigate(RouteNames.HomeRoutes.AgentsOverview, {
          agent: item,
        })
      }
    />
  );

  const handleAddNewUser = () => {
    NavigationService.navigate(RouteNames.HomeRoutes.AddAgent);
  };

  if (isFetching && !data) {
    return <AgentSkeleton />;
  }

  return (
    <MainContainer isHeader backArrow={false} heading="Users">
      <FlatList
        data={usersData}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx?.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" color={Colors.LightBlack} />
          ) : null
        }
        ListEmptyComponent={() => <ListEmpty />}
      />
      <View style={styles.addButtonContainer}>
        <PrimaryButton title="Add Agent" onPress={handleAddNewUser} />
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Metrix.HorizontalSize(15),
    zIndex: 10,
  },
  listContent: {
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

export default Agents;
