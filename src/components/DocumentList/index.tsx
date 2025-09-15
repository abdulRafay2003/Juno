import {Colors, FontType, Images, Metrix} from '@/config';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import CustomText from '../CustomText';
import {
  downloadCommisionInvoice,
  downloadInvoice,
} from '@/utils/business.helper';

type DocumentTypes = {
  list: any[];
  title?: string;
  border?: boolean;
  subTitle?: string;
  download?: boolean;
};

const DocumentList = ({
  list,
  title,
  border,
  subTitle,
  download = false,
}: DocumentTypes) => {
  const getColor = status => {
    switch (status) {
      case 'Uploaded':
        return Colors.Black;
      case 'Not Uploaded':
        return Colors.Grey;
      case 'Rejected':
        return Colors.Red;
      case 'Expired':
        return Colors.Yellow;
      case 'Expiring Soon':
        return Colors.Yellow;
      default:
        return Colors.Black;
    }
  };

  return (
    <>
      <View style={border && styles.agencyInformationContainer}>
        {title && (
          <CustomText.LargeSemiBoldText
            customStyle={{
              marginVertical: Metrix.HorizontalSize(0),
              fontSize: FontType.FontMedium,
            }}>
            {title}
          </CustomText.LargeSemiBoldText>
        )}
        {subTitle && (
          <CustomText.LargeSemiBoldText>
            {subTitle}
          </CustomText.LargeSemiBoldText>
        )}
        {list?.map((item, index) => {
          const color = getColor(item?.status);
          return (
            <View key={index} style={styles.documentItem}>
              <View style={styles.documentItemText}>
                <View
                  style={[
                    styles.documentImgContainer,
                    // {backgroundColor: color},
                  ]}>
                  <Image
                    source={Images.Document}
                    style={styles.documentItemImg}
                  />
                </View>
                <View style={styles.documentItemTextContainer}>
                  <CustomText.RegularText
                    customStyle={styles.documentItemTitle}>
                    {item?.title}
                    {/* doc name */}
                  </CustomText.RegularText>
                  <CustomText.RegularText customStyle={styles.documentItemSize}>
                    {item?.extension}
                    {/* file extention */}
                  </CustomText.RegularText>
                </View>
              </View>
              {download && (
                <TouchableOpacity
                  onPress={() =>
                    downloadCommisionInvoice(item?.link, item?.title, () => {})
                  }>
                  <Images.DownloadSVG
                    width={Metrix.HorizontalSize(27)}
                    height={Metrix.VerticalSize(27)}
                  />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  documentItem: {
    flexDirection: 'row',
    marginTop: Metrix.VerticalSize(10),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  documentItemText: {
    flexDirection: 'row',
    width: '70%',
    gap: Metrix.HorizontalSize(10),
  },
  documentItemTextContainer: {
    width: '70%',
    justifyContent: 'space-between',
    marginVertical: Metrix.VerticalSize(2),
  },
  documentItemSize: {
    color: Colors.Grey,
    fontSize: FontType.FontSmall,
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
  documentItemTitle: {
    fontSize: FontType.FontSemiMedium,
  },

  downloadIcon: {
    height: Metrix.VerticalSize(27),
    width: Metrix.HorizontalSize(27),
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  },
  updateText: {
    textDecorationLine: 'underline',
    fontSize: FontType.FontMedium,
  },
  uploadText: {
    fontSize: FontType.FontMedium,
    alignSelf: 'flex-end',
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
});
export default DocumentList;
