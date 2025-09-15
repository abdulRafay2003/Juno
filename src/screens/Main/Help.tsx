import {CustomText} from '@/components';
import {MainContainer} from '@/components/MainContainer';
import {Colors, FontType, Metrix} from '@/config';
import {ACTIVE_OPACITY} from '@/constants/globalConst';
import {APIS} from '@/services/apiMethods';
import {
  openDialer,
  openMapAddress,
  openWhatsApp,
} from '@/utils/business.helper';
import {useQuery} from '@tanstack/react-query';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const Help = () => {
  const {
    data: helpData,
    isError: helpError,
    isFetching: helpDataLoading,
  } = useQuery({
    queryKey: ['help'],
    queryFn: () => APIS?.getHelp(),
    staleTime: 50000,
  });

  const contacts = helpData?.data?.data?.HELP_PAGE_CONTENT?.contacts || [];
  const address = helpData?.data?.data?.HELP_PAGE_CONTENT?.addresses || [];
  const handleLinking = async (item: any, index: number) => {
    switch (index) {
      case 0:
        await openDialer(item?.redirect);
        break;
      case 1:
        await openWhatsApp(item?.redirect);
        break;
      default:
        break;
    }
  };

  const handleAddressLinking = (item: any, index: number) => {
    switch (index) {
      case 0:
        openMapAddress(item?.value);
        break;
      case 1:
        openMapAddress(item?.value);
        break;
      default:
        break;
    }
  };

  if (helpDataLoading) {
    return (
      <MainContainer isHeader heading="Help" backArrow={false}>
        {[0, 1, 2, 3]?.map((item, i) => (
          <View key={i} style={styles.cardContainer}>
            <View style={[styles.titleContainer]}>
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item
                  width={20}
                  height={20}
                  borderRadius={10}
                />
              </SkeletonPlaceholder>
              {i == 0 || i == 1 ? (
                <View
                  style={{
                    width: '90%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item
                      width={100}
                      height={20}
                      borderRadius={4}
                    />
                  </SkeletonPlaceholder>
                  <SkeletonPlaceholder borderRadius={8}>
                    <SkeletonPlaceholder.Item
                      width={100}
                      height={20}
                      borderRadius={4}
                    />
                  </SkeletonPlaceholder>
                </View>
              ) : (
                <View style={{width: '90%'}}>
                  <SkeletonPlaceholder borderRadius={8}>
                    <SkeletonPlaceholder.Item
                      width={120}
                      height={18}
                      borderRadius={4}
                    />
                    <SkeletonPlaceholder.Item
                      width={180}
                      height={14}
                      borderRadius={4}
                      style={{marginTop: Metrix.VerticalSize(10)}}
                    />
                  </SkeletonPlaceholder>
                </View>
              )}
            </View>
          </View>
        ))}
      </MainContainer>
    );
  }
  return (
    <MainContainer isHeader heading="Help" backArrow={false}>
      {contacts?.map((item, index) => (
        <TouchableOpacity
          onPress={() => handleLinking(item, index)}
          activeOpacity={ACTIVE_OPACITY}
          style={styles.cardContainer}>
          <View style={styles.titleContainer}>
            <View style={styles.contactIconTitleContainer}>
              <Image
                resizeMode="contain"
                source={{uri: item?.icon}}
                style={styles.contactIcon}
              />
              <CustomText.LargeSemiBoldText
                numberOfLines={3}
                ellipsizeMode="tail"
                customStyle={styles.contactTitle}>
                {item.label}
              </CustomText.LargeSemiBoldText>
            </View>
            {item?.isBold ? (
              <CustomText.LargeSemiBoldText
                numberOfLines={3}
                ellipsizeMode="tail"
                customStyle={styles.contactValueText}>
                {item.value}
              </CustomText.LargeSemiBoldText>
            ) : (
              <CustomText.RegularText
                numberOfLines={3}
                ellipsizeMode="tail"
                customStyle={styles.contactValueText}>
                {item.value}
              </CustomText.RegularText>
            )}
          </View>
        </TouchableOpacity>
      ))}
      {address?.map((item, index) => (
        <TouchableOpacity
          onPress={() => handleAddressLinking(item, index)}
          activeOpacity={ACTIVE_OPACITY}
          style={styles.cardContainer}>
          <View
            style={[
              styles.titleContainer,
              {
                alignItems: 'flex-start',
              },
            ]}>
            <Image
              resizeMode="contain"
              source={{uri: item?.icon}}
              style={styles.icon}
            />
            <View style={styles.titleText}>
              <CustomText.LargeSemiBoldText customStyle={styles.title}>
                {item.label}
              </CustomText.LargeSemiBoldText>
              {item.value && (
                <CustomText.RegularText customStyle={styles.description}>
                  {item.value}
                </CustomText.RegularText>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </MainContainer>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.White,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    paddingVertical: Metrix.VerticalSize(18),
    paddingHorizontal: Metrix.HorizontalSize(15),
    borderRadius: Metrix.Radius,
    marginTop: Metrix.VerticalSize(20),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  contactIconTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
  },
  contactIcon: {
    resizeMode: 'cover',
    height: Metrix.VerticalSize(20),
    width: Metrix.VerticalSize(20),
    marginRight: Metrix.HorizontalSize(10),
  },
  contactTitle: {
    fontSize: FontType.FontMedium,
    marginVertical: Metrix.HorizontalSize(0),
  },
  contactValueText: {
    width: '50%',
    textAlign: 'right',
  },
  icon: {
    resizeMode: 'cover',
    height: Metrix.VerticalSize(20),
    width: Metrix.VerticalSize(20),
  },

  title: {
    fontSize: FontType.FontMedium,
    marginVertical: Metrix.HorizontalSize(0),
  },

  description: {
    marginTop: Metrix.VerticalSize(5),
  },
  titleText: {
    width: '90%',
  },
  valueText: {
    width: '50%',
    textAlign: 'right',
  },
});
export default Help;
