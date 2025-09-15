import React, {useRef, useCallback} from 'react';
import {
  Pressable,
  View,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Metrix, Colors, Images, FontType, NavigationService} from '@/config';
import CustomText from '../CustomText';
import CustomBottomSheet from '../CustomBottomSheet';
import {RouteNames} from '@/config/routes';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';

const addTypesData = [
  {
    id: '1',
    title: 'Add Leads',
    route: RouteNames.HomeRoutes.AddLeads,
    params: {from: 'homeLead'},
  },
  {
    id: '2',
    title: 'Capture EOI',
    route: RouteNames.HomeRoutes.CaptureEoi,
    params: {from: 'homeEoi'},
  },
  // {removed / commented as per client's requirment
  //   id: '3',
  //   title: 'Generate Sales Offer',
  //   route: RouteNames.HomeRoutes.AddSalesOffer,
  //   params: {from: 'homeSalesOffer'},
  // },
  {
    id: '4',
    title: 'Add Agent',
    route: RouteNames.HomeRoutes.AddAgent,
    params: {from: 'homeAgent'},
  },
];

const AddTabBarButton: React.FC = () => {
  const sheetRef = useRef<any>(null);
  const isAgent = useSelector((state: RootState) => state.user.agent);

  const handleOpenSheet = useCallback(() => {
    sheetRef.current?.open();
  }, []);

  const handleItemPress = useCallback((route, params) => {
    sheetRef.current?.close();
    setTimeout(() => {
      NavigationService.navigate(route, params);
    }, 500);
  }, []);

  const items = isAgent
    ? addTypesData.filter(item => item.id !== '4')
    : addTypesData;

  return (
    <>
      <Pressable onPress={handleOpenSheet} style={styles.addContainer}>
        <Image
          source={Images.Add}
          resizeMode="contain"
          style={styles.plusIcon}
        />
        <CustomText.MediumText
          isWhiteColor
          customStyle={[styles.tabLabel, {marginVertical: 2}]}>
          Add
        </CustomText.MediumText>
      </Pressable>

      <CustomBottomSheet height={Metrix.VerticalSize(350)} sheetRef={sheetRef}>
        <View style={styles.sheetContainer}>
          <CustomText.LargeSemiBoldText>Quick Add</CustomText.LargeSemiBoldText>
          <CustomText.RegularText
            customStyle={styles.sheetDescription}
            isSecondaryColor>
            Quickly Add New Leads, Capture Expression of Interest, Generate
            Sales Offers and Add Agents
          </CustomText.RegularText>
          {items.map(item => (
            <TouchableOpacity
              onPress={() => handleItemPress(item.route, item.params)}
              key={item.id}
              style={[
                styles.sheetItem,
                item.id !== '4' && styles.sheetItemBorder,
              ]}>
              <CustomText.RegularText customStyle={styles.sheetItemText}>
                {item.title}
              </CustomText.RegularText>
            </TouchableOpacity>
          ))}
        </View>
      </CustomBottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: FontType.FontSuperSmall,
  },
  addContainer: {
    bottom: Platform.select({
      ios: Metrix.VerticalSize(28),
      android: Metrix.VerticalSize(30),
    }),
    width: Metrix.HorizontalSize(65),
    height: Metrix.HorizontalSize(50),
    borderRadius: Metrix.Radius,
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Black,
  },
  plusIcon: {
    width: Metrix.HorizontalSize(20),
    height: Metrix.VerticalSize(20),
  },
  sheetContainer: {
    alignItems: 'center',
    paddingHorizontal: Metrix.HorizontalSize(15),
    paddingVertical: Metrix.HorizontalSize(20),
  },
  sheetDescription: {
    fontSize: FontType.FontSmall,
    textAlign: 'center',
    marginVertical: Metrix.VerticalSize(10),
    width: '95%',
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
});

export default AddTabBarButton;
