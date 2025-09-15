import React from 'react';
import {
  FlatList,
  Platform,
  SectionList,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {CustomText, MainContainer} from '@/components';
import {Colors, FontType, Metrix} from '@/config';
import IdWithTagCard from '@/components/IdWithTagCard';
import {globalStyles} from '@/constants/globalStyles';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import {DateModifier} from '@/utils/business.helper';

const AmendPaymentPlan = ({route}) => {
  const {paymentPlan, unit} = route.params;
  const RenderButton = ({
    title,
    value,
    customInputStyle,
  }: {
    title: string;
    value: string;
    customInputStyle?: StyleProp<ViewStyle>;
  }) => {
    return (
      <View>
        <CustomText.MediumText customStyle={styles.eventType}>
          {title}
        </CustomText.MediumText>
        <View style={[styles.inputContainer, customInputStyle]}>
          <CustomText.RegularText customStyle={styles.inputText}>
            {value}
          </CustomText.RegularText>
        </View>
      </View>
    );
  };
  const renderPaymentSection = ({item}: {item: any}) => {
    return (
      <View style={globalStyles.cardContainer}>
        <CustomText.LargeSemiBoldText customStyle={styles.headingText}>
          {item?.installment_number}
        </CustomText.LargeSemiBoldText>
        <View style={styles.inputMainContainer}>
          <View style={styles.rowBetween}>
            <CustomText.RegularText customStyle={styles.titleText}>
              {'Event Type'}
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
              {item?.event_type || '-'}
            </CustomText.LargeSemiBoldText>
          </View>
          <View style={styles.rowBetween}>
            <CustomText.RegularText customStyle={styles.titleText}>
              {'Due Date'}
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
              {DateModifier(item?.due_date)}
            </CustomText.LargeSemiBoldText>
          </View>
          <View style={styles.rowBetween}>
            <CustomText.RegularText customStyle={styles.titleText}>
              {'Percent'}
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
              {item?.percentage || '-'}
            </CustomText.LargeSemiBoldText>
          </View>
          <View style={styles.rowBetween}>
            <CustomText.RegularText customStyle={styles.titleText}>
              {'Amount (AED)'}
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
              {item?.amount || '-'}
            </CustomText.LargeSemiBoldText>
          </View>
          <View style={styles.rowBetween}>
            <CustomText.RegularText customStyle={[styles.titleText]}>
              {'Payment Milestone'}
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
              {item?.milestone || '-'}
            </CustomText.LargeSemiBoldText>
          </View>
          <View style={styles.rowBetween}>
            <CustomText.RegularText customStyle={styles.titleText}>
              {'RC + SPA'}
            </CustomText.RegularText>
            <CustomText.LargeSemiBoldText customStyle={styles.valueText}>
              {item?.rc_or_spa || '-'}
            </CustomText.LargeSemiBoldText>
          </View>
        </View>
        {/* <View style={styles.inputMainContainer}>
          <RenderButton title={'Event Type'} value={item?.event_type} />
          <RenderButton title={'Due Date'} value={item?.due_date} />
          <RenderButton title={'Percent'} value={item?.percentage} />
          <RenderButton title={'Amount (AED)'} value={item?.amount} />
          <RenderButton title={'Payment Milestone'} value={item?.milestone} />
          <RenderButton title={'RC + SPA'} value={item?.rc_or_spa} />
        </View> */}
      </View>
    );
  };
  // const renderHeader = item => {
  //   return (

  //   );
  // };
  const sectionData = [
    {
      title: {id: paymentPlan?.id, name: paymentPlan?.name}, // You can use item.id or combine name + id for uniqueness
      data: paymentPlan?.schedules,
    },
  ];

  return (
    <MainContainer isHeader isFlatList heading="Payment Plan">
      <View style={styles.headerContainer}>
        <IdWithTagCard
          id={unit}
          status={paymentPlan?.name}
          type={'sale_offer'}
        />
      </View>
      <SectionList
        sections={sectionData}
        renderItem={({item}) => renderPaymentSection({item})}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContentContainer}
        bounces={false}
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  headingMargin: {marginBottom: Metrix.VerticalSize(20)},
  alignBtn: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: Metrix.VerticalSize(20),
  },
  valueText: {
    width: '50%',
    textAlign: 'right',
    fontSize: FontType.FontSemiMedium,
    marginVertical: Metrix.VerticalSize(0),
  },
  titleText: {
    width: '40%',
    fontSize: FontType.FontSemiMedium,
    marginVertical: Metrix.VerticalSize(0),
  },
  headingText: {
    fontSize: FontType.FontLarge,
  },
  eventType: {
    fontSize: FontType.FontRegular,
    marginVertical: Metrix.VerticalSize(10),
  },
  inputContainer: {
    backgroundColor: Colors.LightGreyBadge('0.1'),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    paddingVertical: Metrix.VerticalSize(12),
    paddingHorizontal: Metrix.HorizontalSize(15),
    width: Metrix.HorizontalSize(140),
    borderRadius: Metrix.RoundRadius,
  },
  inputText: {
    color: Colors.PieChartGrayLine,
  },
  inputMainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: Metrix.VerticalSize(10),
  },
  lastInput: {
    width: Metrix.HorizontalSize(297),
  },
  flatListContentContainer: {
    paddingBottom:
      Platform.OS == 'android'
        ? Metrix.VerticalSize(150)
        : Metrix.VerticalSize(100),
  },
  headerContainer: {
    backgroundColor: Colors.Transparent,
    paddingHorizontal: 0,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Metrix.VerticalSize(10),
    width: '100%',
  },
});

export default AmendPaymentPlan;
