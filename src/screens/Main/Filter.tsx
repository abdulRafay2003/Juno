import {CustomText, DropDownPicker, PrimaryButton} from '@/components';
import {Colors, FontType, Metrix, NavigationService} from '@/config';
import {ProjectNames} from '@/constants/dummyData';
import {setFilterPayload} from '@/redux/slice/UserSlice/userSlice';
import {dispatchToStore} from '@/redux/store';
import {useRoute} from '@react-navigation/native';
import React from 'react';
import {useForm} from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Filter = () => {
  const route = useRoute<any>();
  const from = route?.params?.from;
  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const handleCloseFilterSheet = () => {
    NavigationService.goBack();
    dispatchToStore(
      setFilterPayload({
        isApplied: true,
        data: {},
      }),
    );
  };

  const getHeight = () => {
    switch (from) {
      case 'Leads':
        return '80%';
      case 'EOI':
        return '90%';
      case 'Commission':
        return '65%';
      default:
        break;
    }
  };

  const renderFilters = () => {
    switch (from) {
      case 'Leads':
        return renderLeads();
      case 'EOI':
        return renderEOI();
      case 'Commission':
        return renderCommission();
      default:
        break;
    }
  };

  const renderLeads = () => {
    return (
      <KeyboardAwareScrollView
        extraScrollHeight={Metrix.VerticalSize(30)}
        keyboardShouldPersistTaps="always"
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <DropDownPicker
          heading={'Project Name'}
          placeholder={'Select'}
          searchPlaceholder={'Search project'}
          data={ProjectNames}
          fieldName={'projectName'}
          control={control}
          dropdownPosition={'bottom'}
          isSearch
          isFilter
        />
        <DropDownPicker
          heading={'Property Type'}
          placeholder={'Select'}
          searchPlaceholder={'Search project'}
          data={ProjectNames}
          fieldName={'propertyType'}
          dropdownPosition={'bottom'}
          control={control}
          isSearch
          isFilter
        />
        <DropDownPicker
          heading={'Lead Status'}
          placeholder={'Select'}
          searchPlaceholder={'Search project'}
          data={ProjectNames}
          fieldName={'leadStatus'}
          dropdownPosition={'top'}
          control={control}
          isSearch
          isFilter
        />
        <DropDownPicker
          heading={'Broker Name'}
          placeholder={'Select'}
          searchPlaceholder={'Search Broker'}
          data={ProjectNames}
          fieldName={'brokerName'}
          dropdownPosition={'top'}
          control={control}
          isSearch
          isFilter
        />
        <PrimaryButton
          title={'Search'}
          onPress={handleSubmit(handleCloseFilterSheet)}
        />
      </KeyboardAwareScrollView>
    );
  };

  const renderEOI = () => {
    return (
      <KeyboardAwareScrollView
        extraScrollHeight={Metrix.VerticalSize(30)}
        keyboardShouldPersistTaps="always"
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <DropDownPicker
          heading={'Booking Type'}
          placeholder={'Select'}
          searchPlaceholder={'Search project'}
          data={ProjectNames}
          fieldName={'bookingType'}
          control={control}
          dropdownPosition={'bottom'}
          isSearch
          isFilter
        />
        <DropDownPicker
          heading={'Project Name'}
          placeholder={'Select'}
          searchPlaceholder={'Search project'}
          data={ProjectNames}
          fieldName={'projectName'}
          dropdownPosition={'bottom'}
          control={control}
          isSearch
          isFilter
        />
        <DropDownPicker
          heading={'Sales Manager'}
          placeholder={'Select'}
          searchPlaceholder={'Search project'}
          data={ProjectNames}
          fieldName={'salesManager'}
          dropdownPosition={'top'}
          control={control}
          isSearch
          isFilter
        />
        <DropDownPicker
          heading={'Mode of Payment'}
          placeholder={'Select'}
          searchPlaceholder={'Search Broker'}
          data={ProjectNames}
          fieldName={'modeOfPayment'}
          dropdownPosition={'top'}
          control={control}
          isSearch
          isFilter
        />
        <DropDownPicker
          heading={'EOI Status'}
          placeholder={'Select'}
          searchPlaceholder={'Search Broker'}
          data={ProjectNames}
          fieldName={'eoiStatus'}
          dropdownPosition={'top'}
          control={control}
          isSearch
          isFilter
        />
        <PrimaryButton
          title={'Search'}
          onPress={handleSubmit(handleCloseFilterSheet)}
        />
      </KeyboardAwareScrollView>
    );
  };

  const renderCommission = () => {
    return (
      <KeyboardAwareScrollView
        extraScrollHeight={Metrix.VerticalSize(30)}
        keyboardShouldPersistTaps="always"
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <DropDownPicker
          heading={'Project Name'}
          placeholder={'Select'}
          searchPlaceholder={'Search project'}
          data={ProjectNames}
          fieldName={'projectName'}
          control={control}
          dropdownPosition={'bottom'}
          isSearch
          isFilter
        />
        <DropDownPicker
          heading={'Project Type'}
          placeholder={'Select'}
          searchPlaceholder={'Search project'}
          data={ProjectNames}
          fieldName={'projectType'}
          dropdownPosition={'bottom'}
          control={control}
          isSearch
          isFilter
        />
        <DropDownPicker
          heading={'Payment Status'}
          placeholder={'Select'}
          searchPlaceholder={'Search project'}
          data={ProjectNames}
          fieldName={'paymentStatus'}
          dropdownPosition={'top'}
          control={control}
          isSearch
          isFilter
        />
        <PrimaryButton
          title={'Search'}
          onPress={handleSubmit(handleCloseFilterSheet)}
        />
      </KeyboardAwareScrollView>
    );
  };

  return (
    <View style={styles.backdrop}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => NavigationService.goBack()}
      />
      <View style={[styles.modalContent, {height: getHeight()}]}>
        <View style={styles.line}></View>
        <CustomText.LargeSemiBoldText customStyle={{textAlign: 'center'}}>
          Filters
        </CustomText.LargeSemiBoldText>
        <CustomText.RegularText
          customStyle={styles.sheetDescription}
          isSecondaryColor>
          Easily manage {from}
        </CustomText.RegularText>
        {/* <ScrollView> */}

        {renderFilters()}
        {/* </ScrollView> */}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.BlackColorOpacity('0.3'),
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.White,
    paddingBottom: Metrix.VerticalSize(30),
    borderTopRightRadius: Metrix.HorizontalSize(15),
    borderTopLeftRadius: Metrix.HorizontalSize(15),
    paddingHorizontal: Metrix.HorizontalSize(20),
    paddingVertical: Metrix.HorizontalSize(15),
  },
  sheetDescription: {
    fontSize: FontType.FontSmall,
    textAlign: 'center',
    marginTop: Metrix.VerticalSize(5),
    marginBottom: Metrix.VerticalSize(10),
  },
  line: {
    borderWidth: 2,
    alignSelf: 'center',
    width: '8%',
    marginBottom: Metrix.VerticalSize(20),
    borderRadius: Metrix.RoundRadius,
    backgroundColor: Colors.LightBlack,
  },
});
export default Filter;
