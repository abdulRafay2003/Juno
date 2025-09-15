import React from 'react';
import {Image, Text, TouchableOpacity, ViewStyle} from 'react-native';
import {ItemTemplateProps} from '../types/Types';
import {SvgUri} from 'react-native-svg';
import {Images} from '@/config';

export const CountryButton = ({
  item,
  name,
  style,
  ...rest
}: ItemTemplateProps) => (
  <TouchableOpacity
    style={[styles.countryButton, style?.countryButtonStyles]}
    testID="countryCodesPickerCountryButton"
    {...rest}>
    {item?.icon_url == null ? (
      <Image
        source={Images.DummyFlag}
        style={{height: 20, width: 20, marginRight: 25, borderRadius: 20}}
      />
    ) : (
      <SvgUri
        width={20}
        height={20}
        style={[style?.flag, {marginRight: 25, borderRadius: 20}]}
        uri={`${item?.icon_url}`}
      />
    )}

    {/* <Text
      style={[
        {
          flex: 0.2,
        },
        style?.flag,
      ]}>
      {item?.flag}
    </Text> */}
    <Text
      style={[
        {
          flex: 0.3,
        },
        style?.dialCode,
      ]}>
      {`+${item?.value?.length && item?.value.substring(item?.value.indexOf(':') + 2)}`}
      {/* {item?.dial_code} */}
    </Text>
    <Text
      style={[
        {
          flex: 1,
        },
        style?.countryName,
      ]}>
      {name}
    </Text>
  </TouchableOpacity>
);

type StyleKeys = 'countryButton';

const styles: {[key in StyleKeys]: ViewStyle} = {
  countryButton: {
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    width: '100%',
    height: 50,
    paddingHorizontal: 25,
    alignItems: 'center',
    marginVertical: 2,
    flexDirection: 'row',
    borderRadius: 10,
  },
};
