import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {CustomText, Loader, MainContainer, PrimaryButton} from '@/components';
import {Colors, FontType, Images, Metrix, NavigationService} from '@/config';
import {globalStyles} from '@/constants/globalStyles';
import Checkbox from '@/components/Checkbox';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import fontsSize from '@/config/fontsSize';
import {plansData, selectTypeOptions} from '@/constants/dummyData';
import {RouteNames} from '@/config/routes';
import {useRoute} from '@react-navigation/native';
import {useMutation, useQuery} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {formatPricing, showToast} from '@/utils/business.helper';
import ListEmpty from '@/components/ListEmpty';

const Inventory = () => {
  const route = useRoute<any>();
  const body = route?.params?.body;
  const from = route?.params?.from;

  // Filter out empty string values from body
  const filteredBody = body
    ? Object.fromEntries(
        Object.entries(body).filter(([key, value]) => value !== ''),
      )
    : {};
  const [selected, setSelected] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const {data: inventory, isLoading: isInventoryLoading} = useQuery({
    queryKey: ['inventory', filteredBody],
    queryFn: () => APIS.getInventory(filteredBody),
    // staleTime: 300000, // 5 minutes cache time
    enabled: Object.keys(filteredBody)?.length > 0, // Only run query if we have parameters
  });

  useEffect(() => {
    const records = inventory?.data?.data?.records ?? [];
    if (records.length === 0 || selected.length > 0) return;

    const autoSelected = records.map(record => ({
      inventory: record.id,
      payment_plan: record.payment_plans?.[0]?.id,
    }));
    setSelectedType(autoSelected);
  }, [inventory]);

  const handleSelectAll = () => {
    const records = inventory?.data?.data?.records ?? [];

    const allSelected = records.every(record =>
      selected.some(item => item === record?.id),
    );
    if (allSelected) {
      // Deselect all
      setSelected([]);
      setErrors([]); // also clear all errors
    } else {
      // Select all with first payment plan auto-selected (if available)
      const updatedSelection = records.map(record => record?.id);
      setSelected(updatedSelection);
      setErrors([]); // clear errors in case user had previously submitted
    }
  };
  const onSelected = id => {
    let exists = selected.find(item => item === id);

    if (exists) {
      // Remove the item from the selected list
      const updatedSelected = selected.filter(item => item !== id);
      setSelected(updatedSelected);
    } else {
      if (selected.length >= 5) {
        // If already 5 selected, show error
        showToast(
          'alert',
          'Sales Offer',
          'You can select a maximum of 5 units at once.',
        );
      } else {
        // Add the item to the selected list
        const updatedSelected = [...selected, id];
        setSelected(updatedSelected);
      }
    }
  };

  const onSelectPlaymentPlan = (inventoryId, paymentPlanId) => {
    const target = selectedType.find(item => item?.inventory == inventoryId);
    const temp = {
      ...target,
      payment_plan: paymentPlanId,
    };
    const filtered = selectedType.filter(
      item => item?.inventory !== inventoryId,
    );
    const updatedSelected = [...filtered, temp];
    setSelectedType(updatedSelected);
    // ✅ Remove the error for this item, if it exists
    setErrors(prev => prev.filter(id => id !== inventoryId));
  };

  const generateOfferMutation = useMutation({
    mutationFn: (data: any) => APIS.generateSalesOffer(data),
    onSuccess: data => {
      setLoading(false);
      showToast(
        'success',
        'Sales Offer',
        data?.data?.message || 'Sales Offer Generated Successfully',
      );
      if (from === 'homeSalesOffer') {
        NavigationService.navigate('TabStack', {
          screen: 'Menu',
          params: {
            screen: 'SalesOffer',
          },
        });
      } else {
        NavigationService.pop(2);
      }
    },
    onError: error => {
      console.error('Failed to generate inventory', error.response.data);
      setLoading(false);
      // Could add error handling UI feedback here
    },
  });

  const onSubmit = () => {
    const payload = selected.map(inventoryId => {
      const match = selectedType.find(item => item.inventory === inventoryId);
      return {
        project_id: body.project_id,
        inventory_id: inventoryId,
        payment_plan_id: match ? match.payment_plan : null,
      };
    });

    // Clear previous errors and proceed
    setErrors([]);
    setLoading(true);
    generateOfferMutation.mutate({offer_details: payload});
  };

  const handleNavigate = (plan: string, item: any) => {
    if (plan === 'Payment Plan') {
      // Step 1: Find selected inventory from records

      const selectedItem = inventory?.data?.data?.records.find(
        sel => sel?.id === item?.id,
      );

      // Step 2: Find selected payment plan for this inventory
      const selectedPlan = selectedType.find(
        sel => sel?.inventory === item?.id,
      );

      // Step 3: Find the specific payment plan object
      const selectedPlanObj = selectedItem?.payment_plans.find(
        plan => plan?.id == selectedPlan?.payment_plan,
      );

      // Step 4: Navigate with the selected plan object
      NavigationService.navigate(RouteNames.HomeRoutes.AmendPaymentPlan, {
        paymentPlan: selectedPlanObj, // only the selected plan
        unit: item?.unit?.name,
      });
    } else {
      if (item?.floor_plan == null || item?.floor_plan === '') {
        showToast('alert', 'Alert', 'Floor plan not available for this unit');
      } else {
        NavigationService.navigate(RouteNames.HomeRoutes.FloorPlan, {
          url: item?.floor_plan,
        });
      }
    }
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <View style={globalStyles.cardContainer} key={index}>
        <View style={styles.cardContentContainer}>
          {item?.payment_plans.length > 0 && (
            <Checkbox
              isChecked={selected.includes(item?.id)}
              onPress={() => onSelected(item?.id)}
              customStyles={styles.checkboxContainer}
            />
          )}

          <View style={styles.cardContainer}>
            <View style={styles.headingContainer}>
              <View>
                <CustomText.LargeSemiBoldText customStyle={styles.headingtext}>
                  {item?.project_name}
                </CustomText.LargeSemiBoldText>
                <CustomText.RegularText customStyle={styles.buildingText}>
                  {item?.building_name}
                </CustomText.RegularText>
              </View>
              <CustomText.LargeSemiBoldText customStyle={styles.headingtext}>
                {formatPricing(item?.unit?.price)}
              </CustomText.LargeSemiBoldText>
            </View>

            <View style={styles.unitTextContainer}>
              {[
                {label: 'Unit Code', value: item?.unit?.name},
                {label: 'Type', value: item?.unit?.type},
                {label: 'B/R', value: item?.unit?.number_of_bedrooms},
                {label: 'Token', value: item?.unit?.min_token_price},
              ].map((spec, specIndex) => (
                <View key={specIndex}>
                  <CustomText.RegularText customStyle={styles.itemText}>
                    {spec?.label}
                  </CustomText.RegularText>
                  <CustomText.RegularText customStyle={styles.houseText}>
                    {spec?.value}
                  </CustomText.RegularText>
                </View>
              ))}
            </View>

            {item?.payment_plans.length > 0 && (
              <View style={styles.selectContainer}>
                <CustomText.RegularText customStyle={styles.selectType}>
                  Select Type:
                </CustomText.RegularText>
                <FlatList
                  horizontal
                  keyExtractor={(_, idx) => idx.toString()}
                  showsHorizontalScrollIndicator={false}
                  data={item?.payment_plans}
                  renderItem={({item: type}: any) => (
                    <TouchableOpacity
                      // disabled={
                      //   selected.find(i => i?.inventory_id === item?.id)
                      //     ? false
                      //     : true
                      // }
                      onPress={() => onSelectPlaymentPlan(item?.id, type?.id)}
                      style={[
                        styles.btnType,
                        selectedType.find(i => i?.inventory === item?.id)
                          ?.payment_plan === type?.id && styles.selectedBtnType,
                      ]}>
                      <CustomText.RegularText customStyle={styles.typeItemText}>
                        {type?.name}
                      </CustomText.RegularText>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
            {errors.includes(item?.id) && (
              <CustomText.RegularText
                customStyle={{
                  alignSelf: 'flex-end',
                  color: Colors.Error,
                  // left: Metrix.HorizontalSize(5),
                  fontSize: FontType.FontSmall,
                }}>
                Payment plan required
              </CustomText.RegularText>
            )}
            {item?.payment_plans.length > 0 && (
              <View style={styles.floorPlanContainer}>
                {plansData.map((plan, planIndex) => (
                  <TouchableOpacity
                    key={planIndex}
                    style={styles.floorPanBtn}
                    onPress={() => handleNavigate(plan, item)}>
                    <Images.EyeActiveSVG
                      width={Metrix.HorizontalSize(15)}
                      height={Metrix.VerticalSize(15)}
                      marginRight={Metrix.HorizontalSize(8)}
                    />
                    <CustomText.RegularText
                      customStyle={{fontSize: FontType.FontSmall}}>
                      {plan}
                    </CustomText.RegularText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderSkeletonItem = () => (
    <View
      style={[
        globalStyles.cardContainer,
        {marginBottom: Metrix.VerticalSize(10)},
      ]}>
      <View style={styles.cardContentContainer}>
        <SkeletonPlaceholder borderRadius={4}>
          <View
            style={{
              width: Metrix.HorizontalSize(20),
              height: Metrix.VerticalSize(20),
              marginTop: Metrix.VerticalSize(5),
            }}
          />
        </SkeletonPlaceholder>

        <View style={styles.cardContainer}>
          {/* Header Section */}
          <View style={styles.headingContainer}>
            <View>
              <SkeletonPlaceholder borderRadius={4}>
                <View
                  style={{
                    width: Metrix.HorizontalSize(150),
                    height: Metrix.VerticalSize(18),
                    marginBottom: Metrix.VerticalSize(5),
                  }}
                />
              </SkeletonPlaceholder>
              <SkeletonPlaceholder borderRadius={4}>
                <View
                  style={{
                    width: Metrix.HorizontalSize(100),
                    height: Metrix.VerticalSize(14),
                  }}
                />
              </SkeletonPlaceholder>
            </View>
            <SkeletonPlaceholder borderRadius={4}>
              <View
                style={{
                  width: Metrix.HorizontalSize(60),
                  height: Metrix.VerticalSize(18),
                }}
              />
            </SkeletonPlaceholder>
          </View>

          {/* Unit Details Section */}
          <View
            style={[
              styles.unitTextContainer,
              {marginTop: Metrix.VerticalSize(10)},
            ]}>
            {Array.from({length: 4}).map((_, index) => (
              <View key={index} style={{alignItems: 'center'}}>
                <SkeletonPlaceholder borderRadius={4}>
                  <View
                    style={{
                      width: Metrix.HorizontalSize(40),
                      height: Metrix.VerticalSize(12),
                      marginBottom: Metrix.VerticalSize(3),
                    }}
                  />
                </SkeletonPlaceholder>
                <SkeletonPlaceholder borderRadius={4}>
                  <View
                    style={{
                      width: Metrix.HorizontalSize(35),
                      height: Metrix.VerticalSize(10),
                    }}
                  />
                </SkeletonPlaceholder>
              </View>
            ))}
          </View>

          {/* Select Type Section */}
          <View
            style={[
              styles.selectContainer,
              {marginTop: Metrix.VerticalSize(10)},
            ]}>
            <SkeletonPlaceholder borderRadius={4}>
              <View
                style={{
                  width: Metrix.HorizontalSize(70),
                  height: Metrix.VerticalSize(12),
                }}
              />
            </SkeletonPlaceholder>
            <View style={{flexDirection: 'row', gap: Metrix.HorizontalSize(8)}}>
              {Array.from({length: 3}).map((_, index) => (
                <SkeletonPlaceholder
                  key={index}
                  borderRadius={Metrix.RoundRadius}>
                  <View
                    style={{
                      width: Metrix.HorizontalSize(50),
                      height: Metrix.VerticalSize(30),
                    }}
                  />
                </SkeletonPlaceholder>
              ))}
            </View>
          </View>

          {/* Floor Plan Section */}
          <View
            style={[
              styles.floorPlanContainer,
              {marginTop: Metrix.VerticalSize(15)},
            ]}>
            {Array.from({length: 2}).map((_, index) => (
              <SkeletonPlaceholder
                key={index}
                borderRadius={Metrix.RoundRadius}>
                <View
                  style={{
                    width: Metrix.HorizontalSize(90),
                    height: Metrix.VerticalSize(35),
                  }}
                />
              </SkeletonPlaceholder>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  if (isInventoryLoading) {
    return (
      <MainContainer isHeader isFlatList heading="Inventory">
        {/* List Items Skeleton */}
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {Array.from({length: 4}).map((_, index) => (
            <View key={index}>{renderSkeletonItem()}</View>
          ))}
        </ScrollView>
      </MainContainer>
    );
  }

  return (
    <MainContainer isHeader isFlatList heading="Inventory">
      <FlatList
        keyExtractor={(_, idx) => idx?.toString()}
        data={inventory?.data?.data?.records}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Metrix.VerticalSize(100),
        }}
        ListEmptyComponent={() => <ListEmpty />}
      />

      {inventory?.data?.data?.records.length > 0 && (
        <View style={styles.alignBtn}>
          <PrimaryButton
            title="Generate"
            onPress={onSubmit}
            disabled={selected.length === 0}
            customStyles={styles.generateBtn}
          />
        </View>
      )}
      <Loader isLoading={loading} />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  headingMargin: {marginBottom: Metrix.VerticalSize(20)},
  alignBtn: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: Metrix.VerticalSize(60),
  },
  cardContentContainer: {
    flexDirection: 'row',
    gap: Metrix.HorizontalSize(10),
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContainer: {
    flex: 1,
  },
  headingtext: {
    marginVertical: Metrix.HorizontalSize(0),
    marginTop: Metrix.HorizontalSize(0),
    paddingVertical: Metrix.HorizontalSize(0),
  },
  buildingText: {
    color: Colors.PieChartGray1,
  },
  unitTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Metrix.VerticalSize(5),
  },
  itemText: {
    fontSize: FontType.FontRegular,
    color: Colors.PieChartGray2,
  },
  btnType: {
    borderWidth: 1,
    paddingVertical: Metrix.VerticalSize(5),
    paddingHorizontal: Metrix.HorizontalSize(15),
    borderRadius: Metrix.RoundRadius,
    borderColor: Colors.TextInputBorderColor,
    marginHorizontal: Metrix.HorizontalSize(3),
  },
  selectedBtnType: {
    backgroundColor: Colors.TextInputBorderColor,
    borderColor: Colors.PieChartGray2,
  },
  selectTypeContainer: {
    flexDirection: 'row',
    gap: Metrix.HorizontalSize(10),
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectAllContainer: {
    flexDirection: 'row',
    gap: Metrix.HorizontalSize(10),
    alignItems: 'center',
    marginTop: Metrix.VerticalSize(15),
  },
  selectType: {
    color: Colors.PieChartGray1,
    fontSize: FontType.FontSmall,
  },
  typeItemText: {
    fontSize: FontType.FontSmall,
  },
  floorPlanContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Metrix.VerticalSize(15),
  },
  floorPanBtn: {
    borderWidth: 1,
    paddingVertical: Metrix.VerticalSize(7),
    paddingHorizontal: Metrix.VerticalSize(10),
    borderRadius: Metrix.RoundRadius,
    borderColor: Colors.TextInputBorderColor,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '48%',
  },
  houseText: {
    fontSize: fontsSize.FontExtraSmall,
  },
  checkboxContainer: {
    marginTop: Metrix.VerticalSize(5),
  },
  generateBtn: {
    marginVertical:
      Platform.OS == 'android'
        ? Metrix.VerticalSize(10)
        : Metrix.VerticalSize(0),
  },
  iconStyle: {
    width: Metrix.HorizontalSize(15),
    height: Metrix.VerticalSize(15),
    marginRight: Metrix.HorizontalSize(8),
  },
});

export default Inventory;
