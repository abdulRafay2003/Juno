import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  Platform,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  CustomText,
  BottomSheet,
  MainContainer,
  PrimaryButton,
  Loader,
} from '@/components';
import {
  Colors,
  FONT_FAMILY,
  FontType,
  Metrix,
  NavigationService,
} from '@/config';
import DocumentList from '@/components/DocumentList';
import AgentOverViewDetailsCard from '@/components/DetailCard/AgentOverViewDetailsCard';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useRoute} from '@react-navigation/native';
import {APIS} from '@/services/apiMethods';
import {useMutation, useQuery} from '@tanstack/react-query';
import {getFileExtensionFromUrl, showToast} from '@/utils/business.helper';
import {AGENT_OVERVIEW_DOCUMENTS} from '@/constants/globalConst';
import AgentOverviewSkeleton from '@/components/Skeleton/AgentOverviewSkeleton';

const AgentsOverview = () => {
  const route = useRoute<any>();
  const id = route?.params?.agent?.id;
  const status = route?.params?.agent?.status;
  const bottomSheetRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [Docs, setDocs] = useState([]);

  const {data: userOverview, isFetching: userOverviewLoading} = useQuery({
    queryKey: ['userOverview'],
    queryFn: () => APIS?.userOverview(id),
  });
  const transformDocuments = (documents: any[]) => {
    return documents?.map(doc => {
      return {
        title: AGENT_OVERVIEW_DOCUMENTS[doc?.document_type],
        extension: getFileExtensionFromUrl(doc?.doc_url)?.toUpperCase(),
        link: doc?.doc_url,
      };
    });
  };

  useEffect(() => {
    if (userOverview?.data?.data?.documents) {
      setDocs(transformDocuments(userOverview?.data?.data?.documents));
    }
  }, [userOverview]);

  const userOverviewData = userOverview?.data?.data;

  const deactivateMutate = useMutation({
    mutationFn: (body: {sf_agent_id: string; status: boolean}) =>
      APIS?.deactivateUser(body),
    onSuccess: data => {
      setLoading(false);
      NavigationService.goBack();
    },
    onError: (error: any) => {
      setLoading(false);
      showToast(
        'error',
        'Error',
        error?.response?.data?.message || 'Agent Status Update Failed',
      );
    },
  });

  const options = [
    {
      id: '1',
      title: status == 'Active' ? 'Confirm Deactivation' : 'Confirm Activation',
      onPress: () => {
        bottomSheetRef?.current?.close();
        setTimeout(() => {
          setLoading(true);
          deactivateMutate.mutate({
            sf_agent_id: id,
            status: status == 'Active' ? false : true,
          });
        }, 500);
      },
    },
    {
      id: '2',
      title: status == 'Active' ? 'Keep Active' : 'Keep Inactive',
      onPress: () => {
        bottomSheetRef?.current?.close();
      },
    },
  ];

  return (
    <MainContainer isHeader isFlatList heading="Agent Overview">
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          paddingBottom: Metrix.VerticalSize(50),
        }}>
        {userOverviewLoading ? (
          <AgentOverviewSkeleton />
        ) : (
          <>
            <AgentOverViewDetailsCard
              title={'User Information'}
              details={userOverviewData}
              customStyles={styles.userInfoContainer}
            />
            {userOverviewData?.documents?.length > 0 && (
              <DocumentList list={Docs} border title="Documents" download />
            )}

            {userOverviewData?.is_agent === true && (
              <PrimaryButton
                title={
                  status == 'Active' ? 'Deactivate Agent' : 'Activate Agent'
                }
                customStyles={styles.deactiveAgent}
                onPress={() => bottomSheetRef?.current?.open()}
              />
            )}
          </>
        )}
      </ScrollView>

      <BottomSheet
        sheetRef={bottomSheetRef}
        heading={`${status == 'Active' ? 'Deactivate' : 'Activate'}?`}
        subHeading={
          status == 'Active'
            ? 'Are you sure you want to deactivate this agent? They will lose access to their account.'
            : 'Are you sure you want to activate this agent? They will gain access to their account.'
        }
        height={Metrix.VerticalSize(280)}>
        {options?.map(
          (item: {id: string; title: string; onPress: () => void}) => {
            return (
              <TouchableOpacity
                onPress={item?.onPress}
                key={item?.id}
                style={[
                  styles.sheetItem,
                  item?.id != '2' && styles.sheetItemBorder,
                ]}>
                <CustomText.MediumText
                  customStyle={[
                    styles.sheetItemText,
                    {
                      color: item?.id == '1' ? Colors.Error : Colors.Black,
                      fontFamily:
                        item?.id == '2'
                          ? FONT_FAMILY?.InterRegular
                          : FONT_FAMILY?.InterMedium,
                    },
                  ]}>
                  {item?.title}
                </CustomText.MediumText>
              </TouchableOpacity>
            );
          },
        )}
      </BottomSheet>
      <Loader isLoading={loading} />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  userInfoContainer: {
    marginTop: Metrix.VerticalSize(20),
  },
  deactiveAgent: {
    marginBottom:
      Platform.OS == 'android'
        ? Metrix.VerticalSize(30)
        : Metrix.VerticalSize(0),
    marginTop: Metrix.VerticalSize(20),
  },
  sheetItem: {
    height: Metrix.VerticalSize(70),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  sheetItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.TextInputBorderColor,
  },
  sheetItemText: {
    fontSize: FontType.FontRegular,
  },
  skeletonDetailCard: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    marginTop: Metrix.VerticalSize(20),
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

export default AgentsOverview;
