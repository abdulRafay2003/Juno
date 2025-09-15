import {Images, Metrix, Colors} from '@/config';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {MainContainer} from '../MainContainer';

export default () => {
  return (
    <MainContainer
      firstIcon={() => <Images.RefreshSVG />}
      isHeader
      isFlatList
      heading="EOI "
      subheading={'(Expression Of Interest)'}
      backArrow={false}
      customeStyle={styles.skeletonMainContainer}>
      <View style={styles.skeletonListContainer}>
        {[...Array(6)].map((_, idx) => (
          <SkeletonPlaceholder borderRadius={8} key={idx}>
            <SkeletonPlaceholder.Item
              width={'100%'}
              borderRadius={Metrix.Radius}
              marginBottom={Metrix.VerticalSize(12)}
              padding={Metrix.VerticalSize(15)}
              height={Metrix.VerticalSize(180)}
              marginTop={10}
              backgroundColor={Colors.White}
              borderWidth={1}
              borderColor={Colors.TextInputBorderColor}>
              {/* Top row: seq, agency, badge */}
              <SkeletonPlaceholder.Item
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between">
                <SkeletonPlaceholder.Item>
                  {/* seq */}
                  <SkeletonPlaceholder.Item
                    width={160}
                    height={18}
                    borderRadius={4}
                    marginBottom={6}
                  />
                  {/* agency */}
                  <SkeletonPlaceholder.Item
                    width={90}
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
              {/* Info row 1: 2 items */}
              <View style={styles.skeletonInfoRowNarrow}>
                {[...Array(2)].map(i => (
                  <SkeletonPlaceholder.Item
                    key={i}
                    marginRight={Metrix.HorizontalSize(100)}>
                    {/* label */}
                    <SkeletonPlaceholder.Item
                      width={Metrix.HorizontalSize(40)}
                      height={Metrix.VerticalSize(10)}
                      borderRadius={3}
                      marginBottom={4}
                    />
                    {/* value */}
                    <SkeletonPlaceholder.Item
                      width={Metrix.HorizontalSize(55)}
                      height={Metrix.VerticalSize(14)}
                      borderRadius={3}
                    />
                  </SkeletonPlaceholder.Item>
                ))}
              </View>
              {/* Info row 2: 2 items */}
              <View style={styles.skeletonInfoRowNarrow}>
                {[...Array(2)].map(i => (
                  <SkeletonPlaceholder.Item key={i}>
                    {/* label */}
                    <SkeletonPlaceholder.Item
                      width={Metrix.HorizontalSize(40)}
                      height={Metrix.VerticalSize(10)}
                      borderRadius={3}
                      marginBottom={4}
                    />
                    {/* value */}
                    <SkeletonPlaceholder.Item
                      width={Metrix.HorizontalSize(55)}
                      height={Metrix.VerticalSize(14)}
                      borderRadius={3}
                    />
                  </SkeletonPlaceholder.Item>
                ))}
              </View>
              {/* Info row 3: 1 item */}
              <View style={styles.skeletonInfoRow}>
                {[...Array(1)].map(i => (
                  <SkeletonPlaceholder.Item
                    key={i}
                    marginRight={Metrix.HorizontalSize(20)}>
                    {/* label */}
                    <SkeletonPlaceholder.Item
                      width={Metrix.HorizontalSize(40)}
                      height={Metrix.VerticalSize(10)}
                      borderRadius={3}
                      marginBottom={4}
                    />
                    {/* value */}
                    <SkeletonPlaceholder.Item
                      width={Metrix.HorizontalSize(55)}
                      height={Metrix.VerticalSize(14)}
                      borderRadius={3}
                    />
                  </SkeletonPlaceholder.Item>
                ))}
              </View>
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        ))}
      </View>
      <View style={styles.skeletonButtonContainer}>
        <SkeletonPlaceholder borderRadius={8}>
          <SkeletonPlaceholder.Item
            width={'100%'}
            height={48}
            borderRadius={8}
          />
        </SkeletonPlaceholder>
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  skeletonMainContainer: {
    paddingBottom: Metrix.VerticalSize(0),
  },
  skeletonListContainer: {
    paddingTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
  skeletonButtonContainer: {
    marginTop: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
  skeletonInfoRowNarrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginVertical: Metrix.VerticalSize(5),
  },
  skeletonInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Metrix.VerticalSize(5),
  },
});
