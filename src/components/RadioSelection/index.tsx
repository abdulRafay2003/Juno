import React, {useState, FC} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import CustomText from '../CustomText';
import {Colors, Metrix} from '@/config';
import {useController} from 'react-hook-form';
import {ACTIVE_OPACITY} from '@/constants/globalConst';
import {useSelector} from 'react-redux';
export type RadioSelectionProps = {
  heading?: string;
  isRequired?: boolean;
  placeholder?: string;
  value?: string;
  setValue?: (val: string) => void;
  errTxt?: string | any;
  control?: any;
  fieldName?: string;
  mainContainerStyle?: any;
  editable?: boolean;
  list?: string[];
};

export const RadioSelection: FC<RadioSelectionProps> = ({
  heading,
  isRequired,
  mainContainerStyle,
  list,
  control,
  fieldName,
}) => {
  const dropDownData = useSelector(
    (state: RootState) => state?.user?.dropdownData,
  );
  const {
    field: {value, onChange},
  } = useController({
    name: fieldName,
    control,
    defaultValue: list?.[0]?.id || '', // default selection
  });
  return (
    <View style={mainContainerStyle}>
      {heading && (
        <CustomText.MediumText>
          <CustomText.MediumText
            customStyle={{color: isRequired ? Colors.Error : Colors.White}}>
            *{' '}
          </CustomText.MediumText>
          {heading || ''}
        </CustomText.MediumText>
      )}
      <View style={styles.radioTextContainer}>
        {list?.map((item, index) => {
          const isSelected = value === item?.id;
          return (
            <TouchableOpacity
              activeOpacity={ACTIVE_OPACITY}
              hitSlop={10}
              key={index?.toString()}
              style={styles.textContainerRadio}
              onPress={() => onChange(item?.id)}>
              <View
                style={[
                  styles.outerRadioContainer,
                  isSelected && styles.focusedRadioOuter,
                ]}>
                <View
                  style={[
                    styles.radioInnerContainer,
                    isSelected && styles.focusedRadioInner,
                  ]}
                />
              </View>
              <CustomText.RegularText
                customStyle={{
                  color: isSelected ? Colors.LightBlack : Colors.PieChartGray2,
                }}>
                {item?.key}
              </CustomText.RegularText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerRadioContainer: {
    borderWidth: 1,
    borderColor: Colors.PieChartGray2,
    borderRadius: Metrix.RoundRadius,
    width: Metrix.HorizontalSize(15),
    height: Metrix.HorizontalSize(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusedRadioOuter: {
    borderColor: Colors.Black,
  },
  radioInnerContainer: {
    width: Metrix.HorizontalSize(7),
    height: Metrix.HorizontalSize(7),
  },
  focusedRadioInner: {
    backgroundColor: Colors.Black,
    borderRadius: Metrix.RoundRadius,
  },
  radioTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: Metrix.VerticalSize(10),
  },
  textContainerRadio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Metrix.HorizontalSize(10),
    marginBottom: Metrix.VerticalSize(10),
  },
});

export default RadioSelection;
