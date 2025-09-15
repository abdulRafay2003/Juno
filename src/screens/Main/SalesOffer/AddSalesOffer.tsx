import React, {useState, useEffect} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {
  CustomText,
  DropDownPicker,
  MainContainer,
  PrimaryButton,
} from '@/components';
import {Metrix, NavigationService} from '@/config';
import {globalStyles} from '@/constants/globalStyles';
import {useForm} from 'react-hook-form';
import {AddSalesOfferValidation} from '@/components/Validations';
import {yupResolver} from '@hookform/resolvers/yup';
import {RouteNames} from '@/config/routes';
import {useMutation, useQuery} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import {useRoute} from '@react-navigation/native';

const AddSalesOffer = () => {
  const route = useRoute<any>();
  const from = route?.params?.from;
  const [buildingsData, setBuildingsData] = useState([]);
  const [unitTypesData, setUnitTypesData] = useState([]);
  const [bedroomsData, setBedroomsData] = useState([]);

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(AddSalesOfferValidation),
  });

  // Watch the propertyName field
  const propertyName = watch('propertyName');
  const buildingName = watch('buildingName');

  // Effect to handle propertyName changes
  useEffect(() => {
    if (propertyName) {
      getFiltersMuatate.mutate(propertyName);
    }
  }, [propertyName]);

  // Effect to handle buildingName changes
  useEffect(() => {
    if (buildingName && buildingsData.length > 0) {
      const selectedBuildingData = buildingsData.find(
        building => building?.id === buildingName,
      );

      if (selectedBuildingData) {
        // Set unit types for the selected building
        const unitTypesForBuilding =
          selectedBuildingData.unit_types?.map(type => ({
            id: type,
            key: type,
            value: type,
            is_default: false,
          })) || [];
        setUnitTypesData(unitTypesForBuilding);

        // Set bedrooms for the selected building
        const bedroomsForBuilding =
          selectedBuildingData.number_of_bedrooms?.map(bedroom => ({
            id: bedroom,
            key: bedroom,
            value: bedroom,
            is_default: false,
          })) || [];
        setBedroomsData(bedroomsForBuilding);

        // Reset dependent fields
        setValue('unitType', '');
        setValue('numberOfBedrooms', '');
      }
    }
  }, [buildingName, buildingsData]);

  const {data: projectsData, isLoading: projectsLoading} = useQuery({
    queryKey: ['projects'],
    queryFn: () => APIS.getWithSlug('projects'),
    staleTime: 300000, // 5 minutes cache time
  });

  const getFiltersMuatate = useMutation({
    mutationFn: (param: string) => APIS?.getSalesOfferFilters(param),
    onSuccess: data => {
      let buildings = [];
      data?.data?.data?.buildings?.map(item => {
        buildings.push({
          id: item?.id,
          key: item?.name,
          value: item?.name,
          unit_types: item?.unit_types,
          number_of_bedrooms: item?.number_of_bedrooms,
          is_default: false,
        });
      });
      setBuildingsData(buildings);

      // Reset building selection and dependent fields when property changes
      setValue('buildingName', '');
      setValue('unitType', '');
      setValue('numberOfBedrooms', '');
      setUnitTypesData([]);
      setBedroomsData([]);
    },
    onError: (error: any) => {
      console.log('Error FIlters', error?.response?.data);
    },
  });

  const onSubmit = (values: any) => {
    const body = {
      project_id: propertyName,
      building_id: buildingName,
      unit_type: values?.unitType,
      bedrooms: values?.numberOfBedrooms,
    };
    NavigationService.navigate(RouteNames.HomeRoutes.Inventory, {
      body: body,
      from: from,
    });
  };

  const [dropdownKey, setDropdownKey] = useState(0); // using to force re-render of dropdowns
  useEffect(() => {
    setValue('buildingName', '');
    setValue('unitType', '');
    setValue('numberOfBedrooms', '');
    setDropdownKey(prev => prev + 1); // force re-render of dropdowns
  }, [watch('propertyName')]);

  useEffect(() => {
    setValue('buildingName', '');
    setValue('unitType', '');
    setValue('numberOfBedrooms', '');
    setDropdownKey(prev => prev + 1); // force re-render of dropdowns
  }, [watch('propertyName')]);
  return (
    <MainContainer isHeader heading="Send Sales Offer" customeStyle={{flex: 1}}>
      <View style={globalStyles.cardContainer}>
        <CustomText.LargeSemiBoldText customStyle={styles.headingMargin}>
          Sales Offer
        </CustomText.LargeSemiBoldText>
        <DropDownPicker
          heading={'Property Name'}
          placeholder={'Select'}
          searchPlaceholder={'Search project'}
          data={projectsData?.data?.data}
          isRequired
          fieldName={'propertyName'}
          dropdownPosition={'bottom'}
          control={control}
          isSearch
          errTxt={errors?.propertyName && errors?.propertyName?.message}
        />
        <DropDownPicker
          key={dropdownKey + '-building'} // as the key changes componenet re-renders
          heading={'Building Name'}
          placeholder={'Select'}
          data={buildingsData}
          fieldName={'buildingName'}
          dropdownPosition={'bottom'}
          control={control}
        />
        <DropDownPicker
          key={dropdownKey + '-unit'} // as the key changes componenet re-renders
          heading={'Unit Type'}
          placeholder={'Select'}
          data={unitTypesData}
          fieldName={'unitType'}
          dropdownPosition={'bottom'}
          control={control}
        />
        <DropDownPicker
          key={dropdownKey + '-bedrooms'} // as the key changes componenet re-renders
          heading={'Bedroom'}
          placeholder={'Select'}
          data={bedroomsData}
          fieldName={'numberOfBedrooms'}
          dropdownPosition={'bottom'}
          control={control}
        />
      </View>
      <View style={styles.alignBtn}>
        <PrimaryButton
          title="Search"
          onPress={handleSubmit(onSubmit)}
          customStyles={styles.searchBtn}
        />
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  headingMargin: {marginBottom: Metrix.VerticalSize(20)},
  alignBtn: {
    flex: 1,
    justifyContent: 'flex-end',
    // marginBottom:
    //   Platform.OS == 'android'
    //     ? Metrix.VerticalSize(10)
    //     : Metrix.VerticalSize(0),
  },
  searchBtn: {
    marginVertical:
      Platform.OS == 'android'
        ? Metrix.VerticalSize(10)
        : Metrix.VerticalSize(0),
  },
});

export default AddSalesOffer;
