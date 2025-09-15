import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, View, Platform} from 'react-native';
import {MainContainer} from '@/components';
import {Colors, FontType, Metrix} from '@/config';
import DocumentList from '@/components/DocumentList';
import PrimaryApplicantCard from '@/components/DetailCard/PrimaryApplicantCard';
import BuyerTypeCard from '@/components/DetailCard/BuyerTypeCard';
import EoiInformationCard from '@/components/DetailCard/EoiInformtationCard';
import UnitPreferenceCard from '@/components/DetailCard/UnitPreferenceCard';
import EoiPaymentDetailsCard from '@/components/DetailCard/EoiPaymentDetailsCard';
import KycDetailsCard from '@/components/DetailCard/KycDetailsCard';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useRoute} from '@react-navigation/native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import {EOI_OVERVIEW_DOCUMENTS} from '@/constants/globalConst';
import {getFileExtensionFromUrl} from '@/utils/business.helper';
import EoiOverviewSkeleton from '@/components/Skeleton/EoiOverviewSkeleton';

const EoiOverview = props => {
  const route = useRoute<any>();
  const id = route?.params?.eoi?.id;
  const queryClient = useQueryClient();
  const [documents, setDocuments] = useState([]);
  const {
    data: eoiOverview,
    isFetching: eoiOverviewLoading,
    isError: eoiOverviewError,
  } = useQuery({
    queryKey: ['eoiOverview'],
    queryFn: () => APIS?.eoiOverview(id),
    staleTime: 0, // 5 minutes cache time
  });

  const transformDocuments = (documents: any[]) => {
    return documents?.map(doc => {
      const title =
        EOI_OVERVIEW_DOCUMENTS?.[doc?.type] ?? doc?.type ?? 'Document';
      const extension = doc?.url
        ? (getFileExtensionFromUrl(doc?.url)?.toUpperCase() ?? '')
        : '';
      const link = doc?.url ?? '';

      return {title, extension, link};
    });
  };
  useEffect(() => {
    if (eoiOverview?.data?.data?.documents) {
      setDocuments(transformDocuments(eoiOverview?.data?.data?.documents));
    }
  }, [eoiOverview]);

  useEffect(() => {
    return () => {
      queryClient.cancelQueries({queryKey: ['eoiOverview']}).catch(() => {});
    };
  }, [queryClient]);
  const eoiOverviewData = eoiOverview?.data?.data;

  return (
    <MainContainer isHeader isFlatList heading="EOI Overview">
      {eoiOverviewLoading ? (
        <EoiOverviewSkeleton />
      ) : (
        <>
          <BuyerTypeCard
            customStyles={styles.buyerContainer}
            details={eoiOverviewData}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={Platform.select({
              ios: {
                paddingBottom: Metrix.VerticalSize(120),
              },
              android: {
                paddingBottom: Metrix.VerticalSize(160),
              },
            })}>
            <PrimaryApplicantCard
              title={'Primary Applicant'}
              details={eoiOverviewData?.primary_applicant}
              type={eoiOverviewData?.buyer?.type}
            />
            <EoiInformationCard
              title={'Information'}
              details={eoiOverviewData}
            />
            {eoiOverviewData?.unit_preferences?.length > 0 &&
              eoiOverviewData?.unit_preferences?.map((item, index) => {
                return (
                  <UnitPreferenceCard
                    title={`Unit Preference`}
                    details={item}
                  />
                );
              })}

            <EoiPaymentDetailsCard
              title={'Payment Details'}
              details={eoiOverviewData?.deposit}
            />
            <KycDetailsCard
              title={'KYC Details'}
              details={eoiOverviewData?.kyc_detail}
              type={eoiOverviewData?.buyer?.type}
            />
            {eoiOverviewData?.documents?.length > 0 && (
              <DocumentList
                title={'Attached Documents'}
                list={documents}
                border
                download
              />
            )}
          </ScrollView>
        </>
      )}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  userInfoContainer: {
    marginTop: Metrix.VerticalSize(5),
  },
  buyerContainer: {
    marginTop: Metrix.VerticalSize(10),
    paddingTop: Metrix.VerticalSize(0),
    paddingBottom: Metrix.VerticalSize(10),
  },
  deactiveAgent: {
    marginBottom: Metrix.VerticalSize(30),
  },
  invoidBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Metrix.VerticalSize(30),
  },
  btnText: {
    fontSize: FontType.FontRegular,
  },
  invoiceBtn: {
    paddingHorizontal: Metrix.HorizontalSize(0),
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
  documentItem: {
    flexDirection: 'row',
    marginTop: Metrix.VerticalSize(10),
  },
  documentItemText: {
    flexDirection: 'row',
    width: '70%',
    gap: Metrix.HorizontalSize(10),
  },
  documentItemUpdateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '30%',
    gap: Metrix.HorizontalSize(10),
    alignItems: 'center',
  },
  documentItemTextContainer: {
    width: '70%',
    justifyContent: 'space-between',
    marginVertical: Metrix.VerticalSize(2),
  },
});

export default EoiOverview;
