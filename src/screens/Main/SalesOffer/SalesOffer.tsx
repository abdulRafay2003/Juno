import React, {useEffect, useState} from 'react';
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
  SalesOfferCard,
  CustomText,
} from '@/components';
import {Colors, Images, NavigationService, Metrix} from '@/config';
import {RouteNames} from '@/config/routes';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {downloadInvoice, showToast} from '@/utils/business.helper';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import ListEmpty from '@/components/ListEmpty';
import {useIsFocused} from '@react-navigation/native';

const SalesOffer = props => {
  const queryClient = useQueryClient();
  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['salesofferList'],
    queryFn: async ({pageParam = 0}) => {
      const offset = Number(pageParam);
      return await APIS.getSalesOfferList(offset);
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
  // Refetch data when screen comes into focus
  useEffect(() => {
    if (focused) {
      onRefresh();
    }
  }, [focused]);

  const salesOfferData =
    data?.pages?.flatMap(page => page?.data?.data?.records || []) ?? [];
  const handleAddSalesOffer = () => {
    NavigationService.navigate(RouteNames.HomeRoutes.AddSalesOffer);
  };
  const onRefresh = async () => {
    queryClient.clear();
    queryClient.removeQueries({queryKey: ['salesofferList']}); // reset pagination
    await refetch(); // re-trigger with fresh state (offset 0)
  };

  const getSignedUrl = useMutation({
    mutationFn: async (documentId: string) => {
      return await APIS.signedUrl(documentId);
    },
    onSuccess: data => {
      const url = data?.data?.data?.signed_url;
      if (url) {
        downloadInvoice(url, 'SalesOffer');
        setSelected(null); // Reset selected after download
        showToast('success', 'Success', 'Document downloaded successfully!');
      } else {
        showToast('error', 'Error', 'Failed to get signed URL');
        setSelected(null); // Reset selected after download
      }
    },
    onError: error => {
      showToast('error', 'Error', error?.message || 'Failed to download');
      setSelected(null); // Reset selected after download
    },
  });

  const [selected, setSelected] = useState(null);
  const renderSalesItem = ({item}) => {
    const onDownload = item => {
      // in-case document is not available (Backend blunder ofc)
      if (item?.documents.length > 0) {
        setSelected(item?.id);
        getSignedUrl.mutate(item?.documents?.[0]?.url);
      } else {
        showToast('alert', 'Alert', 'No document available for download');
      }
    };

    return (
      <SalesOfferCard
        item={item}
        // I was confused about the onPress function here, so I commented it out
        // onPress={() =>
        //   item?.status == 'Document Generated'
        //     ? NavigationService.navigate(RouteNames.HomeRoutes.OfferReady, {
        //         document: item?.documents[0],
        //       })
        //     : showToast(
        //         'alert',
        //         'Alert',
        //         'The sales offer has not been generated yet.',
        //       )
        // }
        onDownloadPress={() => {
          if (selected == null) {
            onDownload(item);
          }
        }}
        selected={selected}
      />
    );
  };

  if (isFetching && !data) {
    return (
      <MainContainer
        firstIcon={() => <Images.RefreshSVG />}
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
      firstIconPress={onRefresh}
      isHeader
      heading="Sales Offer"
      backArrow={false}
      customeStyle={{paddingBottom: Metrix.VerticalSize(0)}}>
      <FlatList
        data={salesOfferData}
        keyExtractor={(_, idx) => idx?.toString()}
        renderItem={renderSalesItem}
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
        <PrimaryButton
          title="Generate Sales Offer"
          onPress={handleAddSalesOffer}
        />
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
  contentContainer: {
    paddingBottom: Metrix.VerticalSize(80),
    paddingTop: Metrix.VerticalSize(10),
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
  skeletonFilterContainer: {
    paddingTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
});

export default SalesOffer;
