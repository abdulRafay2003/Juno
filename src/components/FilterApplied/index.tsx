import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomText from '../CustomText';
import {Colors, FontType, Images, Metrix} from '@/config';
import React from 'react';

export type FilterAppliedProps = {
  filteredParameters: any;
  handleResetFilter: () => void;
};

export const FilterApplied: React.FC<FilterAppliedProps> = ({
  filteredParameters,
  handleResetFilter,
}) => {
  return (
    <View style={styles.leadsHeaderContainer}>
      <ScrollView
        bounces={false}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.leadsHeaderScrollContent}>
        {filteredParameters?.map((item, idx) => (
          <View style={styles.leadsHeaderFilterItem} key={idx}>
            <CustomText.MediumText customStyle={styles.leadsHeaderFilterText}>
              {item?.title}
            </CustomText.MediumText>
            <TouchableOpacity>
              <Image
                source={Images.BlackCross}
                resizeMode="contain"
                style={styles.leadsHeaderFilterIcon}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={handleResetFilter}
        style={styles.leadsHeaderResetContainer}>
        <CustomText.RegularText customStyle={styles.leadsHeaderResetText}>
          Reset Filters
        </CustomText.RegularText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  leadsHeaderContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    paddingVertical: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(15),
    backgroundColor: Colors.White,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  leadsHeaderScrollContent: {
    gap: Metrix.HorizontalSize(10),
  },
  leadsHeaderFilterItem: {
    paddingHorizontal: Metrix.HorizontalSize(10),
    paddingVertical: Metrix.HorizontalSize(4),
    alignItems: 'center',
    backgroundColor: Colors.LightGrey,
    borderRadius: Metrix.RoundRadius,
    flexDirection: 'row',
  },
  leadsHeaderFilterText: {
    fontSize: FontType.FontExtraSmall,
  },
  leadsHeaderFilterIcon: {
    width: Metrix.HorizontalSize(10),
    height: Metrix.VerticalSize(10),
    marginLeft: Metrix.HorizontalSize(5),
  },
  leadsHeaderResetContainer: {
    paddingLeft: Metrix.HorizontalSize(10),
  },
  leadsHeaderResetText: {
    textDecorationLine: 'underline',
  },
});
