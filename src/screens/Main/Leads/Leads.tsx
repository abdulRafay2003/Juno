import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  MainContainer,
  LeadsCard,
  PrimaryButton,
  CustomText,
  FilterApplied,
} from '@/components';
import {Images, NavigationService, Colors, FontType} from '@/config';
import {Metrix} from '@/config';
import {RouteNames} from '@/config/routes';
import {filteredParameters} from '@/constants/dummyData';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {LeadsFilterValidation} from '@/components/Validations';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useSelector} from 'react-redux';
import {dispatchToStore, RootState} from '@/redux/store';
import {setFilterPayload} from '@/redux/slice/UserSlice/userSlice';
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import ListEmpty from '@/components/ListEmpty';
import {useIsFocused} from '@react-navigation/native';
import LeadsSkeleton from '@/components/Skeleton/LeadsSkeleton';

const width = Dimensions.get('window');

const Leads = props => {
  const queryClient = useQueryClient();

  const filter = useSelector((state: RootState) => state?.user?.filterPayload);
  const isFilterApplied = filter?.isApplied;
  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(LeadsFilterValidation),
  });

  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['leads'],
    queryFn: async ({pageParam = 0}) => {
      const offset = Number(pageParam);
      return await APIS.getLeads(offset);
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

  const leadsData =
    data?.pages?.flatMap(page => page?.data?.data?.records || []) ?? [];

  const focused = useIsFocused();
  // Refetch data when screen comes into focus
  useEffect(() => {
    if (focused) {
      onRefresh();
    }
  }, [focused]);

  useEffect(() => {
    return () => {
      queryClient.cancelQueries({queryKey: ['leads']}).catch(() => {});
    };
  }, [queryClient]);

  const onRefresh = async () => {
    queryClient.clear();
    queryClient.removeQueries({queryKey: ['leads']}); // reset pagination
    await refetch(); // re-trigger with fresh state (offset 0)
  };

  const handleAddLead = () => {
    NavigationService.navigate(RouteNames.HomeRoutes.AddLeads);
  };
  const handleLeadDetails = item => {
    NavigationService.navigate(RouteNames.HomeRoutes.LeadOverview, {
      lead: item,
    });
  };
  const handleOpenFilterSheet = () => {
    NavigationService.navigate(RouteNames.HomeRoutes.Filter, {from: 'Leads'});
  };

  const handleResetFilter = () => {
    dispatchToStore(
      setFilterPayload({
        isApplied: false,
        data: {},
      }),
    );
  };
  const renderLeadItem = ({item}) => {
    return <LeadsCard item={item} onPress={() => handleLeadDetails(item)} />;
  };

  if (isFetching && !data) {
    return <LeadsSkeleton />;
  }

  return (
    <MainContainer
      firstIcon={() => <Images.RefreshSVG />}
      firstIconPress={onRefresh}
      secondIconPress={handleOpenFilterSheet}
      isHeader
      heading="Leads"
      backArrow={false}
      customeStyle={styles.mainContainer}>
      {isFilterApplied && (
        <FilterApplied
          filteredParameters={filteredParameters}
          handleResetFilter={handleResetFilter}
        />
      )}
      <FlatList
        data={leadsData}
        keyExtractor={(_, idx) => idx?.toString()}
        renderItem={renderLeadItem}
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
        <PrimaryButton title="Add Lead" onPress={handleAddLead} />
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
  skeletonInfoRow: {
    flexDirection: 'row',
    width: '75%',
    justifyContent: 'space-between',
    marginTop: Metrix.VerticalSize(5),
  },
  addButtonContainer: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
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
});

export default Leads;
