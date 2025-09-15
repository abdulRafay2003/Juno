import {Metrix, Colors} from '@/config';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {MainContainer} from '../MainContainer';

export default () => {
  return (
    <MainContainer
      isHeader
      backArrow={false}
      heading="Commission"
      isFlatList
      customeStyle={{paddingBottom: Metrix.VerticalSize(0)}}>
      <View style={styles.skeletonListContainer}>
        {[...Array(6)].map((_, idx) => (
          <SkeletonPlaceholder borderRadius={8} key={idx}>
            <SkeletonPlaceholder.Item
              width={'100%'}
              borderRadius={Metrix.Radius}
              marginBottom={12}
              padding={15}
              height={170}
              marginTop={10}
              backgroundColor={Colors.White}
              borderWidth={1}
              borderColor={Colors.TextInputBorderColor}>
              {/* Top row: seq, agency, badge */}
              <SkeletonPlaceholder.Item
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                marginBottom={Metrix.VerticalSize(8)}>
                <SkeletonPlaceholder.Item>
                  {/* seq */}
                  <SkeletonPlaceholder.Item
                    width={120}
                    height={18}
                    borderRadius={4}
                    marginBottom={6}
                  />
                  {/* agency */}
                  <SkeletonPlaceholder.Item
                    width={100}
                    height={12}
                    borderRadius={4}
                  />
                </SkeletonPlaceholder.Item>
                {/* badge */}
                <SkeletonPlaceholder.Item
                  width={70}
                  height={22}
                  borderRadius={12}
                />
              </SkeletonPlaceholder.Item>
              {/* Info row: 4 items */}
              <SkeletonPlaceholder.Item
                flexDirection="row"
                marginTop={Metrix.VerticalSize(5)}>
                {[0, 1, 2, 3].map(i => (
                  <SkeletonPlaceholder.Item
                    key={i}
                    marginRight={Metrix.HorizontalSize(20)}>
                    {/* label */}
                    <SkeletonPlaceholder.Item
                      width={40}
                      height={10}
                      borderRadius={3}
                      marginBottom={4}
                    />
                    {/* value */}
                    <SkeletonPlaceholder.Item
                      width={55}
                      height={14}
                      borderRadius={3}
                    />
                  </SkeletonPlaceholder.Item>
                ))}
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                width={370}
                height={1}
                borderRadius={4}
                marginBottom={6}
                marginTop={Metrix.VerticalSize(10)}
              />
              <SkeletonPlaceholder.Item
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                marginTop={Metrix.VerticalSize(10)}>
                <SkeletonPlaceholder.Item
                  width={120}
                  height={18}
                  borderRadius={4}
                  marginBottom={6}
                />
                <SkeletonPlaceholder.Item flexDirection="row">
                  <SkeletonPlaceholder.Item
                    width={70}
                    height={22}
                    borderRadius={12}
                    marginRight={20}
                  />
                  <SkeletonPlaceholder.Item
                    width={18}
                    height={18}
                    borderRadius={2}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        ))}
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  skeletonListContainer: {
    paddingTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
});
