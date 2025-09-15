import React, {FC, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated as RAnimated,
  Easing,
  Platform,
} from 'react-native';
import DatePicker, {useDefaultStyles} from 'react-native-ui-datepicker';
import CustomText from '../CustomText';
import {Colors, FontType, Metrix, Images, FONT_FAMILY} from '@/config';
import {Controller} from 'react-hook-form';
import dayjs from 'dayjs';
import Animated, {FadeInUp} from 'react-native-reanimated';
import {DateModifier} from '@/utils/business.helper';

export type CustomDatePickerProps = {
  heading?: string;
  isRequired?: boolean;
  placeholder?: string;
  value?: any;
  setValue?: (date: any) => void;
  errTxt?: string | any;
  control?: any;
  fieldName?: string;
  minDate?: any;
  maxDate?: any;
  mode?: 'single' | 'range' | 'multiple';
  style?: any;
  datePickerProps?: any;
};

export const CustomDatePicker: FC<CustomDatePickerProps> = ({
  heading,
  isRequired,
  placeholder = 'Select',
  value,
  setValue,
  errTxt,
  control,
  fieldName,
  minDate,
  maxDate,
  mode = 'single',
  style,
  datePickerProps = {},
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const animation = useRef(new RAnimated.Value(0)).current;
  const toggleCalendar = () => {
    if (showCalendar) {
      RAnimated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start(() => setShowCalendar(false));
    } else {
      setShowCalendar(true);
      RAnimated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();
    }
  };

  const calendarHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Platform.OS === 'ios' ? 410 : 410],
  });
  const calendarOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const calendarCustomStyles = {
    // Day cell wrapper
    day_cell: {
      padding: Metrix.VerticalSize(4),
    },
    // Day number
    day_label: {
      fontSize: FontType.FontMedium,
      fontFamily: FONT_FAMILY.InterRegular,
      color: Colors.LightBlack,
      textAlign: 'center',
      width: Metrix.HorizontalSize(24),
      height: Metrix.VerticalSize(24),
    },
    // Selected day
    selected: {
      backgroundColor: Colors.LightBlack,
      borderRadius: Metrix.RoundRadius,
      alignItems: 'center',
      justifyContent: 'center',
      width: Metrix.HorizontalSize(30),
      height: Metrix.HorizontalSize(30),
      alignSelf: 'center',
    },
    selected_label: {
      color: Colors.White,
      fontFamily: FONT_FAMILY.InterRegular,
      fontWeight: '500',
      fontSize: FontType.FontRegular,
      textAlign: 'center',
      lineHeight: Metrix.VerticalSize(24),
    },
    // Month/year label
    month_selector_label: {
      fontSize: FontType.FontLarge,
      fontFamily: FONT_FAMILY.InterSemiBold,
      color: Colors.LightBlack,
      fontWeight: '600',
      textAlign: 'center',
      marginVertical: Metrix.VerticalSize(8),
    },
    year_selector_label: {
      fontSize: FontType.FontLarge,
      fontFamily: FONT_FAMILY.InterSemiBold,
      color: Colors.LightBlack,
      fontWeight: '600',
      textAlign: 'center',
      marginVertical: Metrix.VerticalSize(8),
    },
    // Weekday header
    weekday_label: {
      fontSize: FontType.FontMedium,
      fontFamily: FONT_FAMILY.InterRegular,
      color: Colors.LightBlack,
      fontWeight: '400',
      textAlign: 'center',
    },
    // Calendar container
    days: {
      paddingHorizontal: Metrix.HorizontalSize(10),
      paddingVertical: Metrix.HorizontalSize(5),
      borderTopWidth: 1,
      marginTop: Metrix.VerticalSize(10),
      borderColor: Colors.TextInputBorderColor,
    },
    header: {
      marginBottom: Metrix.VerticalSize(10),
      marginTop: Metrix.VerticalSize(5),
      paddingHorizontal: Metrix.HorizontalSize(20),
    },
    // Today
    today_label: {
      color: Colors.LightBlack,
      fontFamily: FONT_FAMILY.InterRegular,
      fontWeight: '700',
      fontSize: FontType.FontRegular,
    },
    // Calendar border
    daysContainer: {
      borderRadius: Metrix.Radius,
      backgroundColor: Colors.UnreadColor,
      //   borderWidth: 2,
      borderColor: Colors.TextInputBorderColor,
    },
    // Weekdays container
    weekdays: {
      paddingHorizontal: Metrix.HorizontalSize(10),
      //   paddingVertical: Metrix.VerticalSize(5),
    },
    // Arrow images in header
    button_prev_image: {
      width: Metrix.HorizontalSize(16),
      height: Metrix.VerticalSize(16),
      tintColor: Colors.LightBlack,
    },
    button_next_image: {
      width: Metrix.HorizontalSize(16),
      height: Metrix.VerticalSize(16),
      tintColor: Colors.LightBlack,
    },
    disabled_label: {opacity: 0.3},
  };

  return (
    <View style={[style]}>
      {heading && (
        <CustomText.MediumText>
          <CustomText.MediumText
            customStyle={{color: isRequired ? Colors.Error : Colors.White}}>
            *{' '}
          </CustomText.MediumText>
          {heading || ''}
          {!isRequired && (
            <CustomText.MediumText customStyle={styles.isOptional}>
              {'  '}
              {'(optional)'}
            </CustomText.MediumText>
          )}
        </CustomText.MediumText>
      )}
      <Controller
        control={control}
        name={fieldName}
        render={({field: {onChange, value: fieldValue}}) => {
          const displayValue = fieldValue
            ? DateModifier(fieldValue)
            : // ? dayjs(fieldValue).format('YYYY-MM-DD')
              '';
          return (
            <>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.textContainer]}
                onPress={toggleCalendar}>
                <CustomText.RegularText
                  customStyle={[
                    styles.textInput,
                    !displayValue && {color: Colors.TextInputPlaceholderColor},
                  ]}>
                  {displayValue || placeholder}
                </CustomText.RegularText>
                {/* will use in UAT */}
                {/* {displayValue ? (
                  <TouchableOpacity
                    onPress={() => {
                      onChange(undefined);
                      setValue && setValue('');
                    }}>
                    <Image
                      source={Images.Cross}
                      style={styles.calendarIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ) : (
                  <Image
                    source={Images.Calendar}
                    style={styles.calendarIcon}
                    resizeMode="contain"
                  />
                )} */}

                <Image
                  source={Images.Calendar}
                  style={styles.calendarIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              {showCalendar && (
                <RAnimated.View
                  style={{
                    marginTop: Metrix.VerticalSize(10),
                    overflow: 'hidden',
                    height: calendarHeight,
                    opacity: calendarOpacity,
                  }}>
                  <DatePicker
                    mode={mode}
                    date={fieldValue}
                    onChange={({date}) => {
                      const year = date.getFullYear();
                      const month = `${date.getMonth() + 1}`.padStart(2, '0');
                      const day = `${date.getDate()}`.padStart(2, '0');
                      onChange(`${year}-${month}-${day}`);
                      setValue && setValue(`${year}-${month}-${day}`);
                      toggleCalendar();
                    }}
                    minDate={minDate}
                    maxDate={maxDate}
                    style={styles.datePicker}
                    styles={calendarCustomStyles}
                    {...datePickerProps}
                  />
                </RAnimated.View>
              )}
            </>
          );
        }}
      />
      <View style={{height: Metrix.VerticalSize(25)}}>
        {errTxt && (
          <CustomText.RegularText customStyle={styles.errorText}>
            {'  '}
            {errTxt}
          </CustomText.RegularText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    borderWidth: 1,
    borderRadius: Metrix.RoundRadius,
    height: Metrix.VerticalSize(42),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Metrix.VerticalSize(10),
    backgroundColor: Colors.White,
    borderColor: Colors.TextInputBorderColor,
    alignItems: 'center',
    overflow: 'hidden',
    paddingHorizontal: Metrix.HorizontalSize(15),
  },
  textInput: {
    color: Colors.LightBlack,
    fontSize: FontType.FontRegular,
    fontFamily: FONT_FAMILY.InterRegular,
    width: '85%',
  },
  calendarIcon: {
    width: Metrix.HorizontalSize(18),
    height: Metrix.VerticalSize(18),
    tintColor: Colors.LightBlack,
  },
  datePicker: {
    width: '100%',
    backgroundColor: Colors.UnreadColor,
    borderRadius: Metrix.Radius,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    paddingBottom: Metrix.VerticalSize(20),
  },
  errorText: {
    color: Colors.Error,
    left: Metrix.HorizontalSize(5),
    fontSize: FontType.FontSmall,
  },
  isOptional: {
    fontSize: FontType.FontSmall,
    color: Colors.PieChartGray2,
  },
});

export default CustomDatePicker;
