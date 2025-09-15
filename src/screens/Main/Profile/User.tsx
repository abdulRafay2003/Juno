import {MainContainer, CustomText, PrimaryButton} from '@/components';
import {
  Colors,
  FONT_FAMILY,
  FontType,
  Images,
  Metrix,
  NavigationService,
} from '@/config';
import {RouteNames} from '@/config/routes';
import {
  setFilterPayload,
  setTokens,
  setUserDetail,
} from '@/redux/slice/UserSlice/userSlice';
import {dispatchToStore, RootState} from '@/redux/store';
import {APIS} from '@/services/apiMethods';
import {
  DateModifier,
  downloadCommisionInvoice,
  getFileExtensionFromUrl,
  getStatusColorsFromItem,
  showToast,
} from '@/utils/business.helper';
import {useMutation} from '@tanstack/react-query';
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useSelector} from 'react-redux';
import {
  setAuthPayload,
  loginSucces,
  setCategoryType,
} from '@/redux/slice/AuthSlice/authSlice';

const User = ({navigation}) => {
  const fcmToken = useSelector((state: RootState) => state.user.fcm);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [docDownload, setDocDownload] = useState('');
  const [accordionOpen, setAccordionOpen] = useState(null);

  const details = useSelector((state: any) => state.user.userDetail);
  const isAgent = useSelector((state: any) => state.user.agent);
  const role = details?.agent?.role;

  const statusBadges = useSelector(
    (state: RootState) => state?.user?.statusBadges?.bank_detail,
  );

  const logoutMutation = useMutation({
    mutationFn: (body: {fcm_token: string}) => APIS?.postLogout(body),
    onSuccess: data => {
      dispatchToStore(setUserDetail({}));
      dispatchToStore(setTokens({}));
      dispatchToStore(setFilterPayload({}));
      dispatchToStore(setAuthPayload({}));
      // dispatchToStore(setFcmToken('fcmToken'));
      dispatchToStore(setCategoryType(''));

      dispatchToStore(loginSucces(false));
    },
    onError: (error: any) => {},
  });
  const statusColors = getStatusColorsFromItem('Not Available', statusBadges);
  const statusStyles = {
    borderColor: statusColors?.primary_hex,
    color: statusColors?.primary_hex,
    backgroundColor: statusColors?.secondary_hex,
  };

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    trigger,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
  });
  const getProfile = useMutation({
    mutationFn: () => APIS.getProfileDetails(),
    onSuccess: resp => {
      dispatchToStore(setUserDetail(resp.data.data.details));
      setLoading(false);
    },
    onError: error => {},
  });
  const category =
    getProfile?.data?.data?.data?.details?.agency?.company?.category;

  const ONBOARDINGCATEGORIES = {
    REALDUBAIBASED: 'Real Estate Agency (Dubai Based)',
    REALOTHEREMIRATES: 'Real Estate Agency (Other Emirates)',
    NONREALUAE: 'Non Real Estate Company',
    UAEFREELANCER: 'UAE Freelancer',
    REALINTERNATIONAL: 'International Real Estate Agency',
    NONREALINTERNATIONAL: 'International Non Real Estate Company',
    INTERNATIONALFREELANCER: 'International Freelancer',
  };
  const Property_Consultant =
    category != ONBOARDINGCATEGORIES?.UAEFREELANCER &&
    category != ONBOARDINGCATEGORIES?.INTERNATIONALFREELANCER;
  const Trade_License_Category =
    category == ONBOARDINGCATEGORIES?.REALDUBAIBASED ||
    category == ONBOARDINGCATEGORIES?.REALOTHEREMIRATES ||
    category == ONBOARDINGCATEGORIES?.NONREALUAE;
  const COMPANYRERA =
    category == ONBOARDINGCATEGORIES?.REALDUBAIBASED &&
    getProfile?.data?.data?.data?.details?.agency?.company?.trade_license?.category?.toLowerCase() ==
      'ded';
  const TRN =
    category == ONBOARDINGCATEGORIES?.REALDUBAIBASED ||
    category == ONBOARDINGCATEGORIES?.REALOTHEREMIRATES ||
    category == ONBOARDINGCATEGORIES?.NONREALUAE;
  const OWNERSHIP =
    category == ONBOARDINGCATEGORIES?.REALDUBAIBASED ||
    category == ONBOARDINGCATEGORIES?.REALOTHEREMIRATES ||
    category == ONBOARDINGCATEGORIES?.NONREALUAE;
  const Registration =
    category == ONBOARDINGCATEGORIES?.REALINTERNATIONAL ||
    category == ONBOARDINGCATEGORIES?.NONREALINTERNATIONAL;

  const Company =
    category != ONBOARDINGCATEGORIES?.UAEFREELANCER &&
    category != ONBOARDINGCATEGORIES?.INTERNATIONALFREELANCER;

  const EMIRTESTONATIONAL =
    category == ONBOARDINGCATEGORIES?.INTERNATIONALFREELANCER ||
    category == ONBOARDINGCATEGORIES?.REALINTERNATIONAL ||
    category == ONBOARDINGCATEGORIES?.NONREALINTERNATIONAL;
  // kept for refrence, might use later.
  // function mergeDocuments(docs) {
  //   return AGENCY_DOCUMENTS.map(item1 => {
  //     const match = docs.find(
  //       item2 => item2.document_type === item1.documentType,
  //     );
  //     return {
  //       ...item1,
  //       doc_url: match ? match.doc_url : null,
  //     };
  //   });
  // }

  // Refetch profile data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      getProfile.mutate();
    }, []),
  );

  const downloadSuccess = () => {
    setDocDownload(null);
    showToast(
      'success',
      'Download Manager',
      'Document downloaded successfully',
    );
  };

  const onDownload = item => {
    if (item?.doc_url) {
      setDocDownload(item?.doc_url);
      downloadCommisionInvoice(
        item.doc_url,
        item.document_type,
        setDocDownload,
      );
    } else {
      showToast('alert', 'Download Manager', 'Document URL not found');
    }
  };

  const Accordion = ({title, isPending, body, setOpen, open}: any) => {
    return (
      <View style={styles.accordianContainer}>
        <Pressable
          onPress={() => {
            if (title == open) {
              setOpen(null);
            } else {
              setOpen(title);
            }
          }}
          style={styles.accordianHeader}>
          <View style={styles.accordianHeaderLeft}>
            <CustomText.LargeSemiBoldText customStyle={styles.accordianTitle}>
              {title}
            </CustomText.LargeSemiBoldText>
            {isPending && (
              <CustomText.MediumText
                customStyle={[styles.pendingText, statusStyles]}>
                Pending
              </CustomText.MediumText>
            )}
          </View>
          <Image
            source={Images.ArrowChevron}
            style={[
              styles.accordianChevron,
              open == title && styles.accordianChevronOpen,
            ]}
          />
        </Pressable>
        <View
          style={[
            styles.accordianBody,
            open != title && styles.accordianBodyClosed,
          ]}>
          {body()}
        </View>
      </View>
    );
  };
  const renderDocumentTile = (item, index) => (
    <View key={index} style={styles.documentItem}>
      <View style={styles.documentItemText}>
        <View style={[styles.documentImgContainer]}>
          <Image source={Images.Document} style={styles.documentItemImg} />
        </View>
        <View style={styles.documentItemTextContainer}>
          <CustomText.RegularText customStyle={styles.documentItemTitle}>
            {/* {item.title} */}
            {item?.document_type}
          </CustomText.RegularText>
          <CustomText.RegularText customStyle={styles.documentItemSize}>
            {item?.doc_url
              ? (getFileExtensionFromUrl(item.doc_url)?.toUpperCase() ?? '')
              : null}
          </CustomText.RegularText>
        </View>
      </View>

      <View
        style={[
          styles.documentItemUpdateContainer,
          item?.is_downloable && item?.is_uploadable
            ? styles.justifySpaceBetween
            : styles.justifyFlexEnd,
        ]}>
        {item?.is_downloable &&
          (docDownload == item?.doc_url ? (
            <ActivityIndicator color={Colors.Black} />
          ) : (
            <TouchableOpacity onPress={() => onDownload(item)}>
              {/* <Images.DownloadSVG
              width={Metrix.HorizontalSize(27)}
              height={Metrix.VerticalSize(27)}
            /> */}
              <Image source={Images.Download} style={styles.downloadIcon} />
            </TouchableOpacity>
          ))}

        {item?.is_uploadable && (
          <TouchableOpacity
            onPress={() => {
              NavigationService.navigate(RouteNames.HomeRoutes.UpdateDocument, {
                doc: item.document_type,
                type: item?.document_type,
              });
            }}>
            <CustomText.RegularText customStyle={styles.updateText}>
              {item?.doc_url ? 'Update' : 'Upload'}
            </CustomText.RegularText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const getDocumentBody = () => {
    if (isAgent) {
      return (
        <>
          <Accordion
            title={'Personal'}
            icon={null}
            open={accordionOpen}
            setOpen={setAccordionOpen}
            body={(data = details?.agent) => (
              <>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    First Name
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.first_name}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Last Name
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.last_name}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Nationality
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.nationality || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Mobile Number
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.mobile}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItemNoBorder}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Email Address
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.email}
                  </CustomText.LargeSemiBoldText>
                </View>
              </>
            )}
          />
          <Accordion
            title={'Account'}
            icon={null}
            open={accordionOpen}
            setOpen={setAccordionOpen}
            body={(data = details?.agent) => (
              <>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Role
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.role}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Designation
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.designation}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    {EMIRTESTONATIONAL
                      ? 'National ID Number'
                      : 'Emirate ID Number'}
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.emirates_id?.number}
                  </CustomText.LargeSemiBoldText>
                </View>
                {!EMIRTESTONATIONAL && (
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      Emirate ID Issue Place
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {data?.emirates_id?.issue_place}
                    </CustomText.LargeSemiBoldText>
                  </View>
                )}
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    {EMIRTESTONATIONAL
                      ? 'National ID Expiry Date'
                      : 'Emirate ID Expiry Date'}
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {DateModifier(data?.emirates_id?.expiry_date)}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Passport Number
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.passport?.number}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Passport Issue Place
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.passport?.issue_place}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Passport Expiry Date
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {DateModifier(data?.passport?.expiry_date)}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Broker RERA Number
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.rera?.number}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItemNoBorder}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    RERA Expiry Date
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {DateModifier(data?.rera?.expiry_date)}
                  </CustomText.LargeSemiBoldText>
                </View>
              </>
            )}
          />
          <Accordion
            title={'Documents'}
            icon={null}
            open={accordionOpen}
            setOpen={setAccordionOpen}
            body={(data = details?.agent?.documents) => (
              <>{data?.map((item, index) => renderDocumentTile(item, index))}</>
            )}
          />
        </>
      );
    } else if (!isAgent && role == 'Administrator') {
      return (
        <>
          {Company ? (
            <>
              <Accordion
                title={'Company Information'}
                icon={null}
                open={accordionOpen}
                setOpen={setAccordionOpen}
                body={(data = details?.agency?.company) => (
                  <>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Company Name
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.name || '-'}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    {Trade_License_Category && (
                      <>
                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            Trade License Category
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {data?.trade_license?.category || '-'}
                          </CustomText.LargeSemiBoldText>
                        </View>
                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            Trade License Number
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {data?.trade_license?.number || '-'}
                          </CustomText.LargeSemiBoldText>
                        </View>
                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            Trade License Expiry Date
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {DateModifier(data?.trade_license?.expiry_date)}
                          </CustomText.LargeSemiBoldText>
                        </View>
                      </>
                    )}
                    {Registration && (
                      <>
                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            Registration Number
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {data?.trade_license?.number || '-'}
                          </CustomText.LargeSemiBoldText>
                        </View>
                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            Registration Expiry Date
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {DateModifier(data?.trade_license?.expiry_date)}
                          </CustomText.LargeSemiBoldText>
                        </View>
                      </>
                    )}
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Company Email
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.contact?.email || '-'}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Company Phone
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.contact?.mobile || '-'}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    {Property_Consultant && (
                      <View style={styles.agencyInfoItem}>
                        <CustomText.RegularText customStyle={styles.titleText}>
                          Property Consultant
                        </CustomText.RegularText>
                        <CustomText.LargeSemiBoldText
                          customStyle={styles.valueText}>
                          {data?.property_consultant || '-'}
                        </CustomText.LargeSemiBoldText>
                      </View>
                    )}
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Address Line 1
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.address?.line_1 || '-'}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    {data?.address?.line_2 && (
                      <View style={styles.agencyInfoItem}>
                        <CustomText.RegularText customStyle={styles.titleText}>
                          Address Line 2
                        </CustomText.RegularText>
                        <CustomText.LargeSemiBoldText
                          customStyle={styles.valueText}>
                          {data?.address?.line_2 || '-'}
                        </CustomText.LargeSemiBoldText>
                      </View>
                    )}
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Country
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.country || '-'}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        City
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.city || '-'}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        P.O. Box
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.address?.po_box || '-'}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    {COMPANYRERA && (
                      <>
                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            Company RERA Number
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {data?.rera?.number || '-'}
                          </CustomText.LargeSemiBoldText>
                        </View>
                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            Company RERA Registration Expiry
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {DateModifier(data?.rera?.expiry_date)}
                          </CustomText.LargeSemiBoldText>
                        </View>
                      </>
                    )}
                    {TRN && (
                      <>
                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            Have TRN
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {data?.trn?.have_trn || '-'}
                          </CustomText.LargeSemiBoldText>
                        </View>

                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText>
                            TRN Number
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {data?.trn?.number || '-'}
                          </CustomText.LargeSemiBoldText>
                        </View>
                      </>
                    )}
                    {OWNERSHIP && (
                      <View style={styles.agencyInfoItemNoBorder}>
                        <CustomText.RegularText customStyle={styles.titleText}>
                          Ownership
                        </CustomText.RegularText>
                        <CustomText.LargeSemiBoldText
                          customStyle={styles.valueText}>
                          {data?.ownership || '-'}
                        </CustomText.LargeSemiBoldText>
                      </View>
                    )}
                  </>
                )}
              />
              <Accordion
                title={'Personal'}
                icon={null}
                open={accordionOpen}
                setOpen={setAccordionOpen}
                body={(data = details?.agent) => (
                  <>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        First Name
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.first_name}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Last Name
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.last_name}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Nationality
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.nationality || '-'}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Mobile Number
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.mobile}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Email Address
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.email}
                      </CustomText.LargeSemiBoldText>
                    </View>
                  </>
                )}
              />
            </>
          ) : (
            <Accordion
              title={'Personal Information'}
              icon={null}
              open={accordionOpen}
              setOpen={setAccordionOpen}
              body={(
                data = details?.agent,
                companyData = details?.agency?.company,
              ) => (
                <>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      First Name
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {data?.first_name}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      Last Name
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {data?.last_name}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      Country
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {companyData?.country || '-'}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      City
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {companyData?.city || '-'}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      Signatory Mobile
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {data?.mobile}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      Signatory Email
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {data?.email}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      {EMIRTESTONATIONAL
                        ? 'National ID Number'
                        : 'Emirate ID Number'}
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {data?.emirates_id?.number}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      {EMIRTESTONATIONAL
                        ? 'National ID Expiry Date'
                        : 'Emirate ID Expiry Date'}
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {DateModifier(data?.emirates_id?.expiry_date)}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      Passport Number
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {data?.passport?.number}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      Passport Issue Place
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {data?.passport?.issue_place}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      Passport Expiry Date
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {DateModifier(data?.passport?.expiry_date)}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      Address Line 1
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {companyData?.address?.line_1 || '-'}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  {companyData?.address?.line_2 && (
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Address Line 2
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {companyData?.address?.line_2 || '-'}
                      </CustomText.LargeSemiBoldText>
                    </View>
                  )}
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      P.O. Box
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {companyData?.address?.po_box || '-'}
                    </CustomText.LargeSemiBoldText>
                  </View>
                </>
              )}
            />
          )}
          <Accordion
            title={'Bank Details'}
            open={accordionOpen}
            setOpen={setAccordionOpen}
            isPending={!details?.agency?.bank?.is_bank_detail_available}
            icon={null}
            body={(data = details?.agency?.bank) => (
              <>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Bank Country
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.country || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Bank Name
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.name || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Account Number
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.account_number || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Beneficiary Name
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.beneficiary_name || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    IBAN
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.iban || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Swift Code
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.swift_code || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Currency
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.currency || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Branch Name
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.branch_name || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItemNoBorder}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Bank Address
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.address || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                {role === 'Administrator' &&
                  !isAgent &&
                  !data?.is_bank_detail_available && (
                    <PrimaryButton
                      title="Update Details"
                      customStyles={styles.btn}
                      onPress={() =>
                        NavigationService.navigate(
                          RouteNames.HomeRoutes.UpdateDetails,
                        )
                      }
                    />
                  )}
              </>
            )}
          />
          <Accordion
            title={'Documents'}
            icon={null}
            open={accordionOpen}
            setOpen={setAccordionOpen}
            body={(data = details?.agency?.documents) => (
              <>{data?.map((item, index) => renderDocumentTile(item, index))}</>
            )}
          />
        </>
      );
    } else {
      return (
        <>
          {Company ? (
            <>
              <Accordion
                title={'Company Information'}
                icon={null}
                open={accordionOpen}
                setOpen={setAccordionOpen}
                body={(data = details?.agency?.company) => (
                  <>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Company Name
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.name || '-'}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    {Trade_License_Category && (
                      <>
                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            Trade License Category
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {data?.trade_license?.category || '-'}
                          </CustomText.LargeSemiBoldText>
                        </View>

                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            Trade License Number
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {data?.trade_license?.number || '-'}
                          </CustomText.LargeSemiBoldText>
                        </View>
                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            Trade License Expiry Date
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {DateModifier(data?.trade_license?.expiry_date)}
                          </CustomText.LargeSemiBoldText>
                        </View>
                      </>
                    )}
                    {Registration && (
                      <>
                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            Registration Number
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {data?.trade_license?.number || '-'}
                          </CustomText.LargeSemiBoldText>
                        </View>
                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            Registration Expiry Date
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {DateModifier(data?.trade_license?.expiry_date)}
                          </CustomText.LargeSemiBoldText>
                        </View>
                      </>
                    )}
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Company Email
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.contact?.email || '-'}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Company Phone
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.contact?.mobile || '-'}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    {Property_Consultant && (
                      <View style={styles.agencyInfoItem}>
                        <CustomText.RegularText customStyle={styles.titleText}>
                          Property Consultant
                        </CustomText.RegularText>
                        <CustomText.LargeSemiBoldText
                          customStyle={styles.valueText}>
                          {data?.property_consultant || '-'}
                        </CustomText.LargeSemiBoldText>
                      </View>
                    )}
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Address Line 1
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.address?.line_1 || '-'}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    {data?.address?.line_2 && (
                      <View style={styles.agencyInfoItem}>
                        <CustomText.RegularText customStyle={styles.titleText}>
                          Address Line 2
                        </CustomText.RegularText>
                        <CustomText.LargeSemiBoldText
                          customStyle={styles.valueText}>
                          {data?.address?.line_2 || '-'}
                        </CustomText.LargeSemiBoldText>
                      </View>
                    )}
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Country
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.country || '-'}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        City
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.city || '-'}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        P.O. Box
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.address?.po_box || '-'}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    {COMPANYRERA && (
                      <>
                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            Company RERA Number
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {data?.rera?.number || '-'}
                          </CustomText.LargeSemiBoldText>
                        </View>
                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            Company RERA Registration Expiry
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {DateModifier(data?.rera?.expiry_date)}
                          </CustomText.LargeSemiBoldText>
                        </View>
                      </>
                    )}
                    {TRN && (
                      <>
                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            Have TRN
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {data?.trn?.have_trn || '-'}
                          </CustomText.LargeSemiBoldText>
                        </View>

                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText>
                            TRN Number
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {data?.trn?.number || '-'}
                          </CustomText.LargeSemiBoldText>
                        </View>
                      </>
                    )}
                    {OWNERSHIP && (
                      <View style={styles.agencyInfoItemNoBorder}>
                        <CustomText.RegularText customStyle={styles.titleText}>
                          Ownership
                        </CustomText.RegularText>
                        <CustomText.LargeSemiBoldText
                          customStyle={styles.valueText}>
                          {data?.ownership || '-'}
                        </CustomText.LargeSemiBoldText>
                      </View>
                    )}
                  </>
                )}
              />
              <Accordion
                title={'Signatory'}
                icon={null}
                open={accordionOpen}
                setOpen={setAccordionOpen}
                body={(data = details?.agent) => (
                  <>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        First Name
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.first_name}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Last Name
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.last_name}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        {EMIRTESTONATIONAL
                          ? 'National ID Number'
                          : 'Emirate ID Number'}
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.emirates_id?.number}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        {EMIRTESTONATIONAL
                          ? 'National ID Expiry Date'
                          : 'Emirate ID Expiry Date'}
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {DateModifier(data?.emirates_id?.expiry_date)}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Passport Number
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.passport?.number}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Passport Issue Place
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.passport?.issue_place}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Passport Expiry Date
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {DateModifier(data?.passport?.expiry_date)}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Signatory Mobile
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.mobile}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Signatory Email
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.email}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Role
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.role}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Designation
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {data?.designation}
                      </CustomText.LargeSemiBoldText>
                    </View>
                    {COMPANYRERA && (
                      <>
                        <View style={styles.agencyInfoItem}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            Broker RERA Number
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {data?.rera?.number}
                          </CustomText.LargeSemiBoldText>
                        </View>
                        <View
                          style={[
                            styles.agencyInfoItem,
                            {borderBottomWidth: 0},
                          ]}>
                          <CustomText.RegularText
                            customStyle={styles.titleText}>
                            RERA Expiry Date
                          </CustomText.RegularText>
                          <CustomText.LargeSemiBoldText
                            customStyle={styles.valueText}>
                            {DateModifier(data?.rera?.expiry_date)}
                          </CustomText.LargeSemiBoldText>
                        </View>
                      </>
                    )}
                  </>
                )}
              />
            </>
          ) : (
            <Accordion
              title={'Personal Information'}
              icon={null}
              open={accordionOpen}
              setOpen={setAccordionOpen}
              body={(
                data = details?.agent,
                companyData = details?.agency?.company,
              ) => (
                <>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      First Name
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {data?.first_name}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      Last Name
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {data?.last_name}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      Country
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {companyData?.country || '-'}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      City
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {companyData?.city || '-'}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      Signatory Mobile
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {data?.mobile}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      Signatory Email
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {data?.email}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      {EMIRTESTONATIONAL
                        ? 'National ID Number'
                        : 'Emirate ID Number'}
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {data?.emirates_id?.number}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      {EMIRTESTONATIONAL
                        ? 'National ID Expiry Date'
                        : 'Emirate ID Expiry Date'}
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {DateModifier(data?.emirates_id?.expiry_date)}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      Passport Number
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {data?.passport?.number}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      Passport Issue Place
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {data?.passport?.issue_place}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      Passport Expiry Date
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {DateModifier(data?.passport?.expiry_date)}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      Address Line 1
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {companyData?.address?.line_1 || '-'}
                    </CustomText.LargeSemiBoldText>
                  </View>
                  {companyData?.address?.line_2 && (
                    <View style={styles.agencyInfoItem}>
                      <CustomText.RegularText customStyle={styles.titleText}>
                        Address Line 2
                      </CustomText.RegularText>
                      <CustomText.LargeSemiBoldText
                        customStyle={styles.valueText}>
                        {companyData?.address?.line_2 || '-'}
                      </CustomText.LargeSemiBoldText>
                    </View>
                  )}
                  <View style={styles.agencyInfoItem}>
                    <CustomText.RegularText customStyle={styles.titleText}>
                      P.O. Box
                    </CustomText.RegularText>
                    <CustomText.LargeSemiBoldText
                      customStyle={styles.valueText}>
                      {companyData?.address?.po_box || '-'}
                    </CustomText.LargeSemiBoldText>
                  </View>
                </>
              )}
            />
          )}

          <Accordion
            title={'Bank Details'}
            open={accordionOpen}
            setOpen={setAccordionOpen}
            isPending={!details?.agency?.bank?.is_bank_detail_available}
            icon={null}
            body={(data = details?.agency?.bank) => (
              <>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Bank Country
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.country || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Bank Name
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.name || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Account Number
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.account_number || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Beneficiary Name
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.beneficiary_name || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    IBAN
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.iban || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Swift Code
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.swift_code || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Currency
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.currency || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItem}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Branch Name
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.branch_name || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>
                <View style={styles.agencyInfoItemNoBorder}>
                  <CustomText.RegularText customStyle={styles.titleText}>
                    Bank Address
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
                    {data?.address || '-'}
                  </CustomText.LargeSemiBoldText>
                </View>

                {!data?.is_bank_detail_available && (
                  <PrimaryButton
                    title="Update Details"
                    customStyles={styles.btn}
                    onPress={() =>
                      NavigationService.navigate(
                        RouteNames.HomeRoutes.UpdateDetails,
                      )
                    }
                  />
                )}
              </>
            )}
          />
          <Accordion
            title={'Documents'}
            icon={null}
            open={accordionOpen}
            setOpen={setAccordionOpen}
            body={(
              data = [
                ...(details?.agency?.documents || []),
                ...(details?.agent?.documents || []),
              ],
            ) => (
              <>{data?.map((item, index) => renderDocumentTile(item, index))}</>
            )}
          />
        </>
      );
    }
  };
  const handleLogout = () => {
    logoutMutation.mutate({
      fcm_token: fcmToken,
    });
  };

  if (loading) {
    return (
      <MainContainer isHeader isFlatList heading="Profile">
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          {/* User Info */}
          <View style={styles.userContainer}>
            <View style={styles.userImgContainer}>
              <SkeletonPlaceholder borderRadius={8}>
                <SkeletonPlaceholder.Item
                  width={50}
                  height={50}
                  borderRadius={25}
                />
              </SkeletonPlaceholder>
              <View>
                <SkeletonPlaceholder borderRadius={8}>
                  <SkeletonPlaceholder.Item
                    width={110}
                    height={18}
                    borderRadius={4}
                  />
                  <SkeletonPlaceholder.Item
                    width={60}
                    height={14}
                    borderRadius={4}
                    style={styles.skeletonItemMargin}
                  />
                </SkeletonPlaceholder>
              </View>
            </View>
            <SkeletonPlaceholder borderRadius={8}>
              <SkeletonPlaceholder.Item
                width={90}
                height={20}
                borderRadius={4}
              />
            </SkeletonPlaceholder>
          </View>

          {/* Agency Info Card with border */}
          {[...Array(5)].map((_, i) => (
            <View style={styles.agencyInformationContainer} key={i}>
              <SkeletonPlaceholder borderRadius={8}>
                <SkeletonPlaceholder.Item
                  width={120}
                  height={18}
                  borderRadius={4}
                />
              </SkeletonPlaceholder>
            </View>
          ))}
        </ScrollView>
      </MainContainer>
    );
  }
  return (
    <MainContainer
      isHeader
      isFlatList
      heading="Profile"
      firstIcon={() => <Images.LogoutSVG transform={[{rotate: '180deg'}]} />}
      firstIconPress={() => {
        handleLogout();
      }}
      customeStyle={styles.mainContainerPadding}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.headerRow}>
          <Images.AvatarSVG
            height={Metrix.VerticalSize(50)}
            width={Metrix.VerticalSize(50)}
          />
          <View style={styles.headerNameContainer}>
            <CustomText.LargeBoldText numberOfLines={3} ellipsizeMode="tail">
              {details?.agent?.first_name} {details?.agent?.last_name}
            </CustomText.LargeBoldText>
            <View style={styles.statusContainer}>
              <CustomText.LargeSemiBoldText customStyle={styles.adminText}>
                {isAgent ? 'Agent' : 'Admin'}
              </CustomText.LargeSemiBoldText>
              <TouchableOpacity
                onPress={() =>
                  NavigationService.navigate(
                    RouteNames.HomeRoutes.ChangePassword,
                  )
                }
                style={styles.changePasswordBtn}>
                <CustomText.MediumText customStyle={styles.changePasswordText}>
                  Change Password
                </CustomText.MediumText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {getDocumentBody()}
      </ScrollView>
      {/* <Loader isLoading={docDownload !== null} /> */}
    </MainContainer>
  );
};
const styles = StyleSheet.create({
  mainContainerPadding: {
    paddingHorizontal: Metrix.HorizontalSize(15),
  },
  avatarImg: {
    height: Metrix.VerticalSize(50),
    width: Metrix.VerticalSize(50),
  },
  userContainer: {
    paddingTop: Metrix.VerticalSize(20),
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  userImgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Metrix.HorizontalSize(12),
  },
  agencyInfoValue: {
    fontSize: FontType.FontSemiMedium,
    fontFamily: FONT_FAMILY.InterSemiBold,
    textAlign: 'right',
    flexGrow: 1,
    paddingLeft: Metrix.HorizontalSize(0),
    textAlignVertical: 'top',
    paddingTop: Metrix.VerticalSize(0),
  },
  adminText: {
    color: Colors.Grey,
    fontSize: FontType.FontSemiMedium,
  },
  changePasswordText: {
    fontSize: FontType.FontSmall,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.TransparentGrey,
    borderRadius: Metrix.VerticalSize(5),

    marginTop: Metrix.VerticalSize(20),
    alignItems: 'center',
    paddingHorizontal: Metrix.HorizontalSize(4),
  },
  tabTextContainer: {
    paddingVertical: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(3),
    marginVertical: Metrix.VerticalSize(2),
  },
  adminTabTextContainer: {
    width: '33%',
    alignItems: 'center',
    paddingVertical: Metrix.VerticalSize(12),
    paddingHorizontal: Metrix.HorizontalSize(9),
    marginVertical: Metrix.VerticalSize(3),
  },
  activeTab: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.VerticalSize(5),
    elevation: 1,
    paddingHorizontal: Metrix.HorizontalSize(9),
    shadowColor: Colors.Black,
    shadowOffset: {
      width: Metrix.HorizontalSize(0),
      height: Metrix.HorizontalSize(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tabLine: {
    height: Metrix.VerticalSize(10),
    width: Metrix.HorizontalSize(1),
    backgroundColor: Colors.Grey,
  },
  agencyInformationContainer: {
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    borderRadius: Metrix.VerticalSize(10),
    paddingVertical: Metrix.VerticalSize(20),
    paddingHorizontal: Metrix.HorizontalSize(15),
    backgroundColor: Colors.White,
    marginTop: Metrix.VerticalSize(20),
  },

  titleText: {
    fontSize: FontType.FontRegular,
    marginBottom: Metrix.VerticalSize(5),
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: Metrix.VerticalSize(10),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingText: {
    borderWidth: 1,
    borderRadius: Metrix.RoundRadius,
    paddingHorizontal: Metrix.HorizontalSize(13),
    paddingVertical: Metrix.VerticalSize(2),
    fontSize: FontType.FontSmall,
  },
  documentItem: {
    flexDirection: 'row',
    marginTop: Metrix.VerticalSize(20),
  },
  documentItemImg: {
    height: Metrix.VerticalSize(30),
    width: Metrix.HorizontalSize(30),
    resizeMode: 'contain',
    tintColor: Colors.White,
  },
  documentImgContainer: {
    backgroundColor: Colors.Black,
    borderRadius: Metrix.Radius,
    height: Metrix.HorizontalSize(45),
    width: Metrix.HorizontalSize(42),
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateText: {
    textDecorationLine: 'underline',
    fontSize: FontType.FontSemiMedium,
  },
  downloadIcon: {
    height: Metrix.VerticalSize(27),
    width: Metrix.HorizontalSize(27),
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  },
  documentItemText: {
    flexDirection: 'row',
    width: '70%',
    gap: Metrix.HorizontalSize(10),
  },
  documentItemUpdateContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '30%',
  },
  justifySpaceBetween: {
    justifyContent: 'space-between',
  },
  justifyFlexEnd: {
    justifyContent: 'flex-end',
  },
  documentItemTextContainer: {
    width: '90%',
    justifyContent: 'space-between',
    marginVertical: Metrix.VerticalSize(2),
  },
  documentItemSize: {
    color: Colors.Grey,
    fontSize: FontType.FontSmall,
    marginVertical: Metrix.VerticalSize(0),
  },
  documentItemTitle: {
    fontSize: FontType.FontSemiMedium,
    marginVertical: Metrix.VerticalSize(0),
  },
  skeletonItemMargin: {
    marginTop: 6,
  },
  activeTabText: {
    fontSize: FontType.FontExtraSmall,
  },
  agencyInfoItem: {
    marginTop: Metrix.VerticalSize(10),
    paddingBottom: Metrix.VerticalSize(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.PieChartGray2,
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginTop: Metrix.VerticalSize(0),
    width: '100%',
    marginHorizontal: Metrix.HorizontalSize(0),
    height: 'auto',
    paddingVertical: Metrix.HorizontalSize(0),
    justifyContent: 'flex-end',
    backgroundColor: Colors.White,
    borderRadius: Metrix.HorizontalSize(0),
    borderWidth: Metrix.HorizontalSize(0),
  },
  inputMainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  btn: {
    marginTop: Metrix.VerticalSize(20),
  },
  valueText: {
    fontSize: FontType.FontRegular,
    marginVertical: Metrix.VerticalSize(0),
  },
  scrollContentContainer: {
    paddingBottom: Metrix.VerticalSize(50),
    flexGrow: 1,
  },
  headerRow: {
    paddingVertical: Metrix.VerticalSize(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Metrix.HorizontalSize(12),
    justifyContent: 'space-between',
  },
  headerNameContainer: {
    justifyContent: 'space-between',
    width: '80%',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: Metrix.VerticalSize(2),
  },
  changePasswordBtn: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Metrix.HorizontalSize(10),
    paddingVertical: Metrix.VerticalSize(2),
    borderRadius: Metrix.RoundRadius,
  },
  accordianContainer: {
    backgroundColor: Colors.White,
    padding: Metrix.VerticalSize(12),
    marginVertical: Metrix.VerticalSize(10),
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Metrix.Radius,
    borderColor: Colors.PieChartGray2,
  },
  accordianHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Metrix.HorizontalSize(10),
  },
  accordianHeaderLeft: {
    flexDirection: 'row',
    gap: Metrix.HorizontalSize(10),
    alignItems: 'center',
    width: '80%',
    // justifyContent: 'space-between',
  },
  accordianTitle: {
    fontSize: FontType.FontMedium,
  },
  accordianChevron: {
    height: Metrix.VerticalSize(20),
    width: Metrix.HorizontalSize(20),
    transform: [{rotate: '0deg'}],
  },
  accordianChevronOpen: {
    transform: [{rotate: '180deg'}],
  },
  accordianBody: {
    display: 'flex',
    paddingTop: Metrix.VerticalSize(12),
  },
  accordianBodyClosed: {
    display: 'none',
  },
  agencyInfoItemNoBorder: {
    marginTop: Metrix.VerticalSize(10),
    paddingBottom: Metrix.VerticalSize(10),
    borderBottomWidth: 0,
    borderBottomColor: Colors.PieChartGray2,
    justifyContent: 'space-between',
  },
});

export default User;
