import {Colors, FontType, Metrix} from '@/config';
import {Platform, StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default () => (
  <>
    <SkeletonPlaceholder borderRadius={Metrix.Radius}>
      <View style={styles.skeletonCard}>
        <View style={styles.rowSkeleton}>
          <View style={styles.skeletonIdText} />
          <View style={styles.skeletonStatusBadge} />
        </View>
      </View>
    </SkeletonPlaceholder>
    {Array.from({length: 5}).map(() => (
      <SkeletonPlaceholder borderRadius={Metrix.Radius}>
        <View style={styles.skeletonDetailCard}>
          <View style={styles.skeletonHeading} />
          {[1, 2, 3, 4, 5].map((_, i) => (
            <View key={i} style={styles.skeletonRow}>
              <View style={styles.skeletonLeftText} />
              <View style={styles.skeletonRightText} />
            </View>
          ))}
        </View>
      </SkeletonPlaceholder>
    ))}
  </>
);
const styles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: Colors.White,
    marginTop: Metrix.VerticalSize(10),
    borderRadius: Metrix.Radius,
    paddingHorizontal: Metrix.VerticalSize(14),
    paddingVertical: Metrix.VerticalSize(20),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    marginVertical: Metrix.VerticalSize(6),
  },

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
  rowSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonIdText: {
    width: Metrix.HorizontalSize(100),
    height: Metrix.VerticalSize(20),
  },
  skeletonStatusBadge: {
    width: Metrix.HorizontalSize(80),
    height: Metrix.VerticalSize(24),
    borderRadius: Metrix.Radius,
  },
});
