import {Colors, FontType, Metrix} from '@/config';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default () => (
  <>
    {/* Details / info Skeleton */}
    <View style={{marginTop: Metrix.VerticalSize(20)}}>
      {Array.from({length: 5}).map(() => (
        <SkeletonPlaceholder borderRadius={Metrix.Radius}>
          <View style={styles.skeletonDetailCard}>
            <View style={styles.skeletonHeading} />
            {Array.from({length: 5}).map((_, i) => (
              <View key={i} style={styles.skeletonRow}>
                <View style={styles.skeletonLeftText} />
                <View style={styles.skeletonRightText} />
              </View>
            ))}
          </View>
        </SkeletonPlaceholder>
      ))}
    </View>

    {/* docs Skeleton */}
    <SkeletonPlaceholder borderRadius={Metrix.Radius}>
      <View style={styles.skeletonDetailCard}>
        {[1, 2].map(() => (
          <View style={styles.documentItem}>
            <View style={styles.documentItemText}>
              <SkeletonPlaceholder borderRadius={8}>
                <SkeletonPlaceholder.Item
                  width={32}
                  height={32}
                  borderRadius={8}
                />
              </SkeletonPlaceholder>
              <View style={styles.documentItemTextContainer}>
                <SkeletonPlaceholder borderRadius={8}>
                  <SkeletonPlaceholder.Item
                    width={90}
                    height={16}
                    borderRadius={4}
                  />
                  <SkeletonPlaceholder.Item
                    width={70}
                    height={12}
                    borderRadius={4}
                    style={{marginTop: 6}}
                  />
                </SkeletonPlaceholder>
              </View>
            </View>
            <View style={styles.documentItemUpdateContainer}>
              <SkeletonPlaceholder borderRadius={8}>
                <SkeletonPlaceholder.Item
                  width={50}
                  height={16}
                  borderRadius={4}
                />
              </SkeletonPlaceholder>
              <SkeletonPlaceholder borderRadius={8}>
                <SkeletonPlaceholder.Item
                  width={27}
                  height={27}
                  borderRadius={6}
                />
              </SkeletonPlaceholder>
            </View>
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  </>
);
const styles = StyleSheet.create({
  skeletonDetailCard: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    paddingHorizontal: Metrix.VerticalSize(14),
    paddingVertical: Metrix.VerticalSize(20),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    marginVertical: Metrix.VerticalSize(6),
  },
  skeletonHeading: {
    width: Metrix.HorizontalSize(180),
    height: Metrix.VerticalSize(22),
    marginBottom: Metrix.VerticalSize(10),
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Metrix.VerticalSize(15),
  },
  skeletonLeftText: {
    width: Metrix.HorizontalSize(130),
    height: Metrix.VerticalSize(18),
  },
  skeletonRightText: {
    width: Metrix.HorizontalSize(90),
    height: Metrix.VerticalSize(18),
  },
  documentItem: {
    flexDirection: 'row',
    marginTop: Metrix.VerticalSize(10),
  },
  documentItemText: {
    flexDirection: 'row',
    width: '70%',
    gap: Metrix.HorizontalSize(10),
  },
  documentItemUpdateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '30%',
    gap: Metrix.HorizontalSize(10),
    alignItems: 'center',
  },
  documentItemTextContainer: {
    width: '70%',
    justifyContent: 'space-between',
    marginVertical: Metrix.VerticalSize(2),
  },
});
