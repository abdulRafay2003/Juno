import React from 'react';
import {View, StyleSheet, useWindowDimensions, ScrollView} from 'react-native';
import {MainContainer, CustomText} from '@/components';
import {Colors, FontType, Metrix} from '@/config';
import {announcementDetailsHtml} from '@/constants/dummyData';
import RenderHtml from 'react-native-render-html';

const AnnouncementDetails = () => {
  const {width} = useWindowDimensions();
  return (
    <MainContainer isHeader heading="Detail" backArrow>
      <View style={styles.titleBox}>
        <CustomText.LargeSemiBoldText
          customStyle={{fontSize: FontType.FontExtraLarge}}>
          Project launch for unit #013
        </CustomText.LargeSemiBoldText>
      </View>
      <View style={styles.card}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <RenderHtml
            contentWidth={width}
            source={{html: announcementDetailsHtml}}
            baseStyle={{color: Colors.LightBlack}}
          />
        </ScrollView>
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  titleBox: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    paddingHorizontal: Metrix.VerticalSize(15),
    paddingVertical: Metrix.VerticalSize(18),
    marginBottom: Metrix.VerticalSize(12),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
  },
  card: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    padding: Metrix.VerticalSize(16),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    flex: 1,
  },
});

export default AnnouncementDetails;
