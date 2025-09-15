import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, View, Platform} from 'react-native';
import {MainContainer, PrimaryButton} from '@/components';
import {Colors, FontType, Images, Metrix, NavigationService} from '@/config';
import {PROPERTY_INFO} from '@/constants/dummyData';
import IdWithTagCard from '@/components/IdWithTagCard';
import {RouteNames} from '@/config/routes';
import {downloadInvoice} from '@/utils/business.helper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import CommissionDetailsCard from '@/components/DetailCard/CommissionDetailsCard';
import PropertyInfoDetailsCard from '@/components/DetailCard/PropertyInfoDetailsCard';
import CustomerDetailsCard from '@/components/DetailCard/CustomerDetailsCard';
import {useRoute} from '@react-navigation/native';
import {useMutation, useQuery} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import ComissionOverviewSkeleton from '@/components/Skeleton/ComissionOverviewSkeleton';

const CommissionOverview = props => {
  const route = useRoute<any>();
  const id = route?.params?.commission?.id;
  const {
    data: commissionOverView,
    isFetching: commissionOverViewLoading,
    isError: commissionOverViewError,
    refetch: commissionOverViewRefetch,
  } = useQuery({
    queryKey: ['commissionOverview'],
    queryFn: () => APIS?.getCommissionOverview(id),
  });

  const [isLoadingSignedUrl, setIsLoadingSignedUrl] = useState(false);

  const getSignedUrl = useMutation({
    mutationFn: async (documentId: string) => {
      return await APIS?.signedUrl(documentId);
    },
    onSuccess: data => {
      downloadInvoice(
        data?.data?.data?.signed_url,
        commissionOverView?.data?.data?.documents[0]?.type,
      );
      setIsLoadingSignedUrl(false);
    },
    onError: error => {
      setIsLoadingSignedUrl(false);
    },
  });

  const commissionOverViewData = commissionOverView?.data?.data;
  return (
    <>
      <MainContainer
        customeStyle={{paddingBottom: 0}}
        isHeader
        isFlatList
        heading="Commission Overview">
        {!commissionOverViewLoading && (
          <IdWithTagCard
            id={commissionOverViewData?.commission_num}
            status={commissionOverViewData?.status}
            type={'commission'}
          />
        )}
        <ScrollView
          contentContainerStyle={Platform.select({
            ios: {
              paddingBottom: Metrix.VerticalSize(120),
            },
            android: {
              paddingBottom: Metrix.VerticalSize(150),
            },
          })}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          {commissionOverViewLoading ? (
            <ComissionOverviewSkeleton />
          ) : (
            <>
              <CommissionDetailsCard
                title={PROPERTY_INFO.commissionHeading}
                details={commissionOverViewData?.commission}
                customStyles={styles.userInfoContainer}
              />
              <PropertyInfoDetailsCard
                title={PROPERTY_INFO.propertyHeading}
                details={commissionOverViewData?.project}
                customStyles={styles.userInfoContainer}
              />
              <CustomerDetailsCard
                title={PROPERTY_INFO.customerHeading}
                details={commissionOverViewData.customer}
                customStyles={styles.userInfoContainer}
              />
            </>
          )}
        </ScrollView>
      </MainContainer>
      {!commissionOverViewLoading && (
        <View style={styles.invoidBtnContainer}>
          {(commissionOverViewData?.documents?.length > 0 &&
            !commissionOverViewData?.can_upload_invoice) ||
          commissionOverViewData?.can_upload_invoice ? (
            commissionOverViewData?.can_upload_invoice ? (
              <PrimaryButton
                titleIcon={() => <Images.UploadSVG color={Colors.White} />}
                title="Upload Invoice"
                customStyles={styles.invoiceBtn}
                customTextStyle={styles.btnText}
                width="100%"
                onPress={() => {
                  NavigationService.navigate(
                    RouteNames.HomeRoutes.UploadInvoice,
                    {item: commissionOverViewData},
                  );
                }}
              />
            ) : (
              <>
                <PrimaryButton
                  title="View Invoice"
                  disabled={isLoadingSignedUrl}
                  customStyles={styles.invoiceBtn}
                  customTextStyle={styles.btnText}
                  width="48%"
                  onPress={() => {
                    NavigationService.navigate(
                      RouteNames.HomeRoutes.ViewInvoice,
                      {doc: commissionOverView?.data?.data?.documents[0]},
                    );
                  }}
                />
                <PrimaryButton
                  title="Download Invoice"
                  customStyles={styles.invoiceBtn}
                  customTextStyle={styles.btnText}
                  width="50%"
                  isLoading={isLoadingSignedUrl}
                  onPress={() => {
                    setIsLoadingSignedUrl(true);
                    getSignedUrl.mutate(
                      commissionOverView?.data?.data?.documents[0]?.url,
                    );
                  }}
                />
              </>
            )
          ) : null}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  userInfoContainer: {
    marginTop: Metrix.VerticalSize(5),
  },
  invoidBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Metrix.HorizontalSize(15),
    zIndex: 10,
    width: '100%',
    alignSelf: 'center',
    marginBottom:
      Platform.OS == 'android'
        ? Metrix.VerticalSize(5)
        : Metrix.HorizontalSize(20),
  },
  btnText: {
    fontSize: FontType.FontSemiRegular,
  },
  invoiceBtn: {
    paddingHorizontal: Metrix.HorizontalSize(0),
    marginBottom:
      Platform.OS == 'android'
        ? Metrix.VerticalSize(5)
        : Metrix.VerticalSize(0),
  },
  skeletonCard: {
    backgroundColor: Colors.White,
    marginTop: Metrix.VerticalSize(10),
    borderRadius: Metrix.Radius,
    paddingHorizontal: Metrix.VerticalSize(14),
    paddingVertical: Metrix.VerticalSize(20),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    marginVertical: Metrix.VerticalSize(6),
  },

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

export default CommissionOverview;
