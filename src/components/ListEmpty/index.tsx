import {Images, Metrix, FontType, Colors} from '@/config';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import CustomText from '../CustomText';

export default () => {
  return (
    <View style={styles.container}>
      <Images.EmptyIconSVG
        width={Metrix.HorizontalSize(40)}
        height={Metrix.VerticalSize(40)}
      />
      <CustomText.RegularText customStyle={styles.text}>
        Data not found
      </CustomText.RegularText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: Dimensions.get('window').height - Metrix.VerticalSize(200),
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: Metrix.VerticalSize(40) || 40,
    width: Metrix.HorizontalSize(40) || 40,
  },
  text: {
    fontSize: FontType.FontSemiMedium,
    color: Colors.PieChartGray2,
  },
});
