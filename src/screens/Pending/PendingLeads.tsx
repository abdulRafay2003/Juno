import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {MainContainer, PrimaryButton, CustomText} from '@/components';
import {Images, NavigationService, Colors, FontType} from '@/config';
import {Metrix} from '@/config';
import {RouteNames} from '@/config/routes';
import {filteredParameters} from '@/constants/dummyData';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {LeadsFilterValidation} from '@/components/Validations';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {getAccountStatus} from '@/utils/business.helper';
import PendingAccessCard from '@/components/PendingAccessCard';
import { usePendingStatusCheck } from '@/hooks/usePendingStatusCheck';

const PendingLeads = props => {
  // Check user status on every screen focus
  usePendingStatusCheck();
  
  const [loading, setLoading] = useState(true);
  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [loading]);
  getAccountStatus();
  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(LeadsFilterValidation),
  });

  const handleAddLead = () => {
    NavigationService.navigate(RouteNames.HomeRoutes.AddLeads);
  };

  const handleOpenFilterSheet = () => {
    NavigationService.navigate(RouteNames.HomeRoutes.Filter, {from: 'Leads'});
  };

  const handleResetFilter = () => {
    setFilterApplied(false);
  };

  const renderAppliedFilter = (filteredParameters: any) => {
    return (
      <View style={styles.leadsHeaderContainer}>
        <ScrollView
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.leadsHeaderScrollContent}>
          {filteredParameters?.map((item, idx) => (
            <View style={styles.leadsHeaderFilterItem} key={idx}>
              <CustomText.MediumText customStyle={styles.leadsHeaderFilterText}>
                {item?.title}
              </CustomText.MediumText>
              <TouchableOpacity>
                <Image
                  source={Images.BlackCross}
                  resizeMode="contain"
                  style={styles.leadsHeaderFilterIcon}
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity
          onPress={handleResetFilter}
          style={styles.leadsHeaderResetContainer}>
          <CustomText.RegularText customStyle={styles.leadsHeaderResetText}>
            Reset Filters
          </CustomText.RegularText>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <MainContainer
        firstIcon={() => <Images.RefreshSVG />}
        firstIconPress={() => setLoading(true)}
        secondIconPress={handleOpenFilterSheet}
        isHeader
        isFlatList
        heading="Leads"
        disabled={true}
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
                height={120}
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
                    width={70}
                    height={22}
                    borderRadius={12}
                  />
                </SkeletonPlaceholder.Item>
                {/* Info row: 4 items */}
                <SkeletonPlaceholder.Item
                  flexDirection="row"
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
      firstIconPress={() => setLoading(true)}
      secondIconPress={handleOpenFilterSheet}
      isHeader
      heading="Leads"
      backArrow={false}
      disabled={true}
      customeStyle={styles.mainContainer}>
      {filterApplied && renderAppliedFilter(filteredParameters)}
      <View style={[styles.leadsHeaderContainer, {flexGrow: 1}]}>
        <PendingAccessCard />
      </View>
      <View style={styles.addButtonContainer}>
        <PrimaryButton
          title="Add Lead"
          onPress={handleAddLead}
          disabled={getAccountStatus()}
        />
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingBottom: Metrix.VerticalSize(0),
    paddingHorizontal: Metrix.HorizontalSize(0),
    flex: 1,
  },
  addButtonContainer: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    bottom: Metrix.VerticalSize(5),
    paddingHorizontal: Metrix.HorizontalSize(15),
    zIndex: 10,
  },
  contentContainer: {
    paddingBottom: Metrix.VerticalSize(70),
    paddingTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(15),
  },
  skeletonListContainer: {
    paddingTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
  skeletonButtonContainer: {
    marginTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
  leadsHeaderContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    paddingVertical: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(15),
    backgroundColor: Colors.White,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  leadsHeaderScrollContent: {
    gap: Metrix.HorizontalSize(10),
  },
  leadsHeaderFilterItem: {
    paddingHorizontal: Metrix.HorizontalSize(10),
    paddingVertical: Metrix.HorizontalSize(4),
    alignItems: 'center',
    backgroundColor: Colors.LightGrey,
    borderRadius: Metrix.RoundRadius,
    flexDirection: 'row',
  },
  leadsHeaderFilterText: {
    fontSize: FontType.FontExtraSmall,
  },
  leadsHeaderFilterIcon: {
    width: Metrix.HorizontalSize(10),
    height: Metrix.VerticalSize(10),
    marginLeft: Metrix.HorizontalSize(5),
  },
  leadsHeaderResetContainer: {
    paddingLeft: Metrix.HorizontalSize(10),
  },
  leadsHeaderResetText: {
    textDecorationLine: 'underline',
  },
});

export default PendingLeads;
