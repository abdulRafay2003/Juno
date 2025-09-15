import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  MainContainer,
  LeadsCard,
  PrimaryButton,
  EoiCard,
  FilterApplied,
} from '@/components';
import {Images, NavigationService} from '@/config';
import {Metrix} from '@/config';
import {eoiData, filteredParameters, ProjectNames} from '@/constants/dummyData';
import {RouteNames} from '@/config/routes';
import {
  EoiFilterValidation,
  LeadsFilterValidation,
} from '@/components/Validations';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Colors} from '@/config';
import {dispatchToStore, RootState} from '@/redux/store';
import {setFilterPayload} from '@/redux/slice/UserSlice/userSlice';
import {useSelector} from 'react-redux';
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import ListEmpty from '@/components/ListEmpty';
import {useIsFocused} from '@react-navigation/native';
import EoiSkeleton from '@/components/Skeleton/EoiSkeleton';

const Eoi = () => {
  const queryClient = useQueryClient();
  const focused = useIsFocused();
  const isFilterApplied = useSelector(
    (state: RootState) => state?.user?.filterPayload?.isApplied,
  );

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(EoiFilterValidation),
  });

  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['eoi'],
    queryFn: async ({pageParam = 0}) => {
      const offset = Number(pageParam);
      return await APIS.getEoi(offset);
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

  const eoiData =
    data?.pages?.flatMap(page => page?.data?.data?.records || []) ?? [];

  useEffect(() => {
    if (focused) {
      onRefresh();
    }
  }, [focused]);

  useEffect(() => {
    return () => {
      queryClient.cancelQueries({queryKey: ['eoi']}).catch(() => {});
    };
  }, [queryClient]);

  const onRefresh = async () => {
    queryClient.clear();
    queryClient.removeQueries({queryKey: ['eoi']}); // reset pagination
    await refetch(); // re-trigger with fresh state (offset 0)
  };

  const handleCaptureEoi = () => {
    NavigationService.navigate(RouteNames.HomeRoutes.CaptureEoi);
  };

  const handleOpenFilterSheet = () => {
    NavigationService.navigate(RouteNames.HomeRoutes.Filter, {
      from: 'EOI',
    });
  };

  const handleResetFilter = () => {
    dispatchToStore(
      setFilterPayload({
        isApplied: false,
        data: {},
      }),
    );
  };

  const renderEoiItem = ({item}) => {
    return (
      <EoiCard
        item={item}
        onPress={() =>
          NavigationService.navigate(RouteNames.HomeRoutes.EoiOverview, {
            eoi: item,
          })
        }
      />
    );
  };

  if (isFetching && !data) {
    return <EoiSkeleton />;
  }

  return (
    <MainContainer
      firstIcon={() => <Images.RefreshSVG />}
      firstIconPress={onRefresh}
      secondIconPress={handleOpenFilterSheet}
      isHeader
      heading="EOI "
      subheading={'(Expression Of Interest)'}
      backArrow={false}
      customeStyle={styles.mainContainer}>
      {isFilterApplied && (
        <FilterApplied
          filteredParameters={filteredParameters}
          handleResetFilter={handleResetFilter}
        />
      )}
      <FlatList
        data={eoiData}
        keyExtractor={(_, idx) => idx?.toString()}
        renderItem={renderEoiItem}
        contentContainerStyle={styles.contentContainer}
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
        <PrimaryButton title="Capture EOI" onPress={handleCaptureEoi} />
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingBottom: Metrix.VerticalSize(0),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
  skeletonMainContainer: {
    paddingBottom: Metrix.VerticalSize(0),
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Metrix.HorizontalSize(15),
    zIndex: 10,
  },
  contentContainer: {
    paddingBottom: Metrix.VerticalSize(80),
    paddingTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(15),
    flexGrow: 1,
  },
  skeletonListContainer: {
    paddingTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
  skeletonButtonContainer: {
    marginTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
  skeletonInfoRowNarrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginVertical: Metrix.VerticalSize(5),
  },
  skeletonInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Metrix.VerticalSize(5),
  },
});

export default Eoi;
