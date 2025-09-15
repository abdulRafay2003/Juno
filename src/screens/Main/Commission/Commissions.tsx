import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {MainContainer} from '@/components/MainContainer';
import CommissionCard from '@/components/CommissionCard';
import {Metrix, Colors, NavigationService} from '@/config';
import {filteredParameters} from '@/constants/dummyData';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {CommissionFilterValidation} from '@/components/Validations';
import {RouteNames} from '@/config/routes';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {FilterApplied} from '@/components';
import {useSelector} from 'react-redux';
import {dispatchToStore, RootState} from '@/redux/store';
import {setFilterPayload} from '@/redux/slice/UserSlice/userSlice';
import {APIS} from '@/services/apiMethods';
import {useQueryClient, useInfiniteQuery} from '@tanstack/react-query';
import {downloadCommisionInvoice} from '@/utils/business.helper';
import ListEmpty from '@/components/ListEmpty';
import {useIsFocused} from '@react-navigation/native';
import ComissionsSkeleton from '@/components/Skeleton/ComissionsSkeleton';

const Commissions = () => {
  const filterSheetRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterLoading, setFilterLoading] = useState(false);
  const filter = useSelector((state: RootState) => state?.user?.filterPayload);
  const isFilterApplied = filter?.isApplied;

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(CommissionFilterValidation),
  });
  const queryClient = useQueryClient();
  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['commissionList'],
    queryFn: async ({pageParam = 0}) => {
      const offset = Number(pageParam);
      return await APIS.getCommissionList(offset);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const lastRecords = lastPage?.data?.data?.records || [];
      const lastOffset = lastPage?.data?.data?.pagination?.offset ?? 0;

      // If fewer records than expected are returned, we assume it's the end
      if (lastRecords.length < 10) return undefined; // 10 = static limit
      return lastOffset + lastRecords.length;
    },
  });

  const focused = useIsFocused();
  useEffect(() => {
    if (focused) {
      onRefresh();
    }
  }, [focused]);

  useEffect(() => {
    return () => {
      queryClient.cancelQueries({queryKey: ['commissionList']}).catch(() => {});
    };
  }, [queryClient]);

  const onRefresh = async () => {
    queryClient.clear();
    queryClient.removeQueries({queryKey: ['commissionList']});
    await refetch();
  };

  const commissionData =
    data?.pages?.flatMap(page => page?.data?.data?.records || []) ?? [];
  const handleAddSalesOffer = () => {
    NavigationService.navigate(RouteNames.HomeRoutes.AddSalesOffer);
  };

  const handleCommissionDetails = item => {
    NavigationService.navigate(RouteNames.HomeRoutes.CommissionOverview, {
      commission: item,
    });
  };
  const handleOpenFilterSheet = () => {
    NavigationService.navigate(RouteNames.HomeRoutes.Filter, {
      from: 'Commission',
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
  const onInvoicePress = (item: any) => {
    if (item?.can_upload_invoice === true) {
      NavigationService.navigate(RouteNames.HomeRoutes.UploadInvoice, {item});
    } else {
      setSelectedItem(item?.id);
      downloadCommisionInvoice(
        item?.documents[0]?.url,
        item?.documents[0]?.type,
        setSelectedItem,
      );
    }
  };
  const renderItem = ({item}) => (
    <CommissionCard
      item={item}
      onPress={() => {
        handleCommissionDetails(item);
      }}
      onInvoicePress={() => {
        if (selectedItem == null) {
          onInvoicePress(item);
        }
      }}
      selected={selectedItem}
    />
  );

  if (isFetching && !data) {
    return <ComissionsSkeleton />;
  }

  return (
    <MainContainer
      isHeader
      backArrow={false}
      heading="Commission"
      isFlatList
      firstIconPress={handleOpenFilterSheet}
      customeStyle={styles.mainContainer}>
      {isFilterApplied && (
        <FilterApplied
          filteredParameters={filteredParameters}
          handleResetFilter={handleResetFilter}
        />
      )}
      <FlatList
        data={commissionData}
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
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingBottom: Metrix.VerticalSize(50),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
  listContent: {
    paddingBottom: Metrix.VerticalSize(20),
    paddingTop: Metrix.HorizontalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(15),
    flexGrow: 1,
  },
  skeletonListContainer: {
    paddingTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
});

export default Commissions;
