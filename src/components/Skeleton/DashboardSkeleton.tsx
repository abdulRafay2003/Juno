import {
  Images,
  NavigationService,
  Metrix,
  Colors,
  FONT_FAMILY,
  FontType,
} from '@/config';
import {RouteNames} from '@/config/routes';
import {ScrollView, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {MainContainer} from '../MainContainer';

export default () => {
  return (
    <MainContainer
      isHeader
      isFlatList
      heading="Dashboard"
      backArrow={false}
      firstIcon={() => <Images.NotificationSVG />}
      firstIconPress={() => {
        NavigationService.navigate(RouteNames.HomeRoutes.Notification);
      }}
      secondIcon={() => <Images.UserPlaceholderSVG />}
      secondIconPress={() => {
        NavigationService.navigate(RouteNames.HomeRoutes.User);
      }}
      customeStyle={styles.mainContainerPadding}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}>
        {/* Welcome Banner Skeleton - just a bar */}
        <SkeletonPlaceholder borderRadius={12}>
          <SkeletonPlaceholder.Item
            width={'100%'}
            height={48}
            borderRadius={Metrix.LightRadius}
            marginTop={Metrix.VerticalSize(15)}
            marginBottom={Metrix.VerticalSize(15)}
          />
        </SkeletonPlaceholder>

        {/* Stats Grid Skeleton (4 boxes only) */}
        <SkeletonPlaceholder borderRadius={12}>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            // flexWrap="wrap"
            justifyContent="space-between"
            width={'100%'}
            marginBottom={Metrix.VerticalSize(10)}>
            {[0, 1, 2, 3]?.map((_, idx) => (
              <SkeletonPlaceholder.Item
                key={idx}
                width={Metrix.HorizontalSize(120)}
                height={90}
                borderRadius={Metrix.Radius}
                marginBottom={Metrix.VerticalSize(15)}
                marginRight={Metrix.HorizontalSize(10)}
              />
            ))}
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>

        {/* Yearly Sales Line Chart Skeleton */}
        <SkeletonPlaceholder borderRadius={12}>
          <SkeletonPlaceholder.Item
            width={'100%'}
            borderRadius={Metrix.Radius}
            padding={15}
            marginBottom={Metrix.VerticalSize(20)}
            backgroundColor={Colors.White}>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              marginBottom={10}>
              <SkeletonPlaceholder.Item
                width={110}
                height={18}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                width={60}
                height={28}
                borderRadius={6}
              />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              width={'100%'}
              height={Metrix.VerticalSize(245)}
              borderRadius={8}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>

        {/* Leads Stage Pie Chart Section Skeleton */}
        <SkeletonPlaceholder borderRadius={12}>
          <SkeletonPlaceholder.Item
            width={'100%'}
            borderRadius={Metrix.Radius}
            padding={15}
            marginBottom={Metrix.VerticalSize(20)}
            backgroundColor={Colors.White}>
            <SkeletonPlaceholder.Item
              width={120}
              height={18}
              borderRadius={4}
              marginBottom={10}
            />
            <SkeletonPlaceholder.Item
              alignSelf="center"
              width={180}
              height={180}
              borderRadius={90}
              marginVertical={10}
            />
            <SkeletonPlaceholder.Item
              flexDirection="row"
              justifyContent="center"
              marginTop={10}>
              {[0, 1, 2]?.map((_, idx) => (
                <SkeletonPlaceholder.Item
                  key={idx}
                  flexDirection="row"
                  alignItems="center"
                  marginHorizontal={7}>
                  <SkeletonPlaceholder.Item
                    width={10}
                    height={10}
                    borderRadius={5}
                    marginRight={5}
                  />
                  <SkeletonPlaceholder.Item
                    width={60}
                    height={12}
                    borderRadius={4}
                  />
                </SkeletonPlaceholder.Item>
              ))}
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </ScrollView>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  mainContainerPadding: {
    paddingHorizontal: Metrix.HorizontalSize(20),
  },
  scrollContentContainer: {
    paddingBottom: Metrix.VerticalSize(40),
    flexGrow: 1,
  },
});
