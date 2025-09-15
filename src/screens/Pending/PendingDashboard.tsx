import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, ScrollView} from 'react-native';
import {MainContainer} from '@/components/MainContainer';
import {
  Images,
  NavigationService,
  Metrix,
  Colors,
  FontType,
  FONT_FAMILY,
} from '@/config';
import {RouteNames} from '@/config/routes';
import CustomText from '@/components/CustomText';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import PendingAccessCard from '@/components/PendingAccessCard';
import {getAccountStatus} from '@/utils/business.helper';
import {LineChart} from 'react-native-gifted-charts';
import {usePendingStatusCheck} from '@/hooks/usePendingStatusCheck';

const PendingDashboard = props => {
  const [loading, setLoading] = useState(true);

  // Check user status on every screen focus
  usePendingStatusCheck();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const dashboardStats = [
    {
      icon: () => <Images.UnitsSoldSVG color={Colors.PieChartGray1} />,
      label: 'Total Unit Sold',
      value: 0,
    },
    {
      icon: () => <Images.CustomerSVG color={Colors.PieChartGray1} />,
      label: 'Total Customers',
      value: 0,
    },
    {
      icon: () => <Images.SoldValueSVG color={Colors.PieChartGray1} />,
      label: 'Total Sold Value',
      value: 0,
    },
    {
      icon: () => (
        <Images.CommissionDashboardSVG color={Colors.PieChartGray1} />
      ),
      label: 'Total Commission',
      value: 0,
    },
  ];

  if (loading) {
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
        customeStyle={{paddingHorizontal: Metrix.HorizontalSize(20)}}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
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
              flexWrap="wrap"
              justifyContent="space-between"
              width={'100%'}
              marginBottom={Metrix.VerticalSize(10)}>
              {[0, 1, 2, 3].map((_, idx) => (
                <SkeletonPlaceholder.Item
                  key={idx}
                  width={'48%'}
                  height={90}
                  borderRadius={Metrix.Radius}
                  marginBottom={Metrix.VerticalSize(15)}
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
                height={120}
                borderRadius={8}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>

          {/* Announcements Section Skeleton */}
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
                  width={120}
                  height={18}
                  borderRadius={4}
                />
                <SkeletonPlaceholder.Item
                  width={50}
                  height={14}
                  borderRadius={4}
                />
              </SkeletonPlaceholder.Item>
              {/* Unread Announcement (filled) */}
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={60}
                borderRadius={Metrix.Radius}
                marginBottom={10}
                backgroundColor={Colors.TransparentGrey}
              />
              {/* Read Announcement (outlined) */}
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={60}
                borderRadius={Metrix.Radius}
                borderWidth={1}
                borderColor={Colors.LightGrey}
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
                {[0, 1, 2].map((_, idx) => (
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
  }

  return (
    <MainContainer
      isHeader
      heading="Dashboard"
      isFlatList
      backArrow={false}
      firstIcon={() => <Images.NotificationSVG />}
      firstIconPress={() => {
        NavigationService.navigate(
          RouteNames.PendingRoutes.PendingNotification,
        );
      }}
      secondIcon={() => <Images.UserPlaceholderSVG />}
      secondIconPress={() => {
        NavigationService.navigate(RouteNames.PendingRoutes.PendingUser);
      }}
      customeStyle={{
        paddingHorizontal: Metrix.HorizontalSize(20),
        flex: 1,
      }}>
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.pendingAcessCardContainer}
        showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        {/* <PendingAccessCard /> */}
        <View style={styles.statsGrid}>
          {dashboardStats?.map((item, index) => (
            <View key={index?.toString()} style={styles.statCard}>
              {item.icon()}
              <CustomText.RegularText customStyle={styles.statLabel}>
                {item.label}
              </CustomText.RegularText>
              <CustomText.LargeSemiBoldText customStyle={styles.statValue}>
                {item.value}
              </CustomText.LargeSemiBoldText>
            </View>
          ))}
        </View>
        <View style={styles.dashboardWhiteCard}>
          <CustomText.LargeSemiBoldText>
            Yearly Sales
          </CustomText.LargeSemiBoldText>
          {/* <PendingAccessCard /> */}
          <View style={styles.lineChartContainer}>
            <LineChart
              data={[]}
              thickness={4}
              color={Colors.LightBlack}
              curved
              focusEnabled
              showDataPointOnFocus
              showDataPointLabelOnFocus
              showValuesAsDataPointsText
              textColor1={Colors.LightBlack}
              textFontSize1={FontType.FontSemiRegular}
              showTextOnFocus
              areaChart={false}
              yAxisThickness={1}
              xAxisThickness={1}
              xAxisColor={Colors.LightGrey}
              yAxisColor={Colors.LightGrey}
              xAxisLabelTextStyle={styles.monthTextStyle}
              yAxisTextStyle={styles.monthTextStyle}
              noOfSections={5}
              maxValue={100}
              rulesType="solid"
              rulesColor={Colors.LightGrey}
              rulesThickness={1}
              spacing={55}
              initialSpacing={15}
              xAxisLabelTexts={[
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ]}
              // formatYLabel={formatLargeNumbers}
              xAxisLabelsVerticalShift={10}
              height={210}
              showVerticalLines={true}
              verticalLinesColor={Colors.LightGrey}
              verticalLinesThickness={StyleSheet.hairlineWidth}
              endSpacing={-5}
              isAnimated={true}
              animationDuration={1200}
            />
          </View>
        </View>
        <View style={styles.dashboardWhiteCard}>
          <CustomText.LargeSemiBoldText>
            Leads Stage
          </CustomText.LargeSemiBoldText>
          <View
            style={{
              paddingVertical: Metrix.VerticalSize(10),
              alignItems: 'center',
            }}>
            <View
              style={{
                height: Metrix.VerticalSize(150),
                width: Metrix.HorizontalSize(150),
                backgroundColor: Colors.TextInputBorderColor,
                borderRadius: Metrix.RoundRadius,
              }}
            />
          </View>
          {/* <PendingAccessCard /> */}
        </View>

        <View />
      </ScrollView>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  welcomeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.TransparentGrey,
    borderRadius: Metrix.LightRadius,
    paddingVertical: Metrix.VerticalSize(7),
    paddingHorizontal: Metrix.VerticalSize(12),
    marginTop: Metrix.VerticalSize(15),
  },
  verifiedBadge: {
    width: Metrix.HorizontalSize(20),
    height: Metrix.HorizontalSize(20),
    marginTop: Metrix.HorizontalSize(4),
  },
  pendingAcessCardContainer: {
    flexGrow: 1,
    paddingBottom: Metrix.VerticalSize(40),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: Metrix.VerticalSize(30),
  },
  statCard: {
    backgroundColor: Colors.TextInputBorderColor,
    borderRadius: Metrix.Radius,
    width: '48%',
    marginBottom: Metrix.VerticalSize(15),
    paddingVertical: Metrix.VerticalSize(8),
    paddingHorizontal: Metrix.VerticalSize(10),
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: FontType.FontSemiRegular,
    marginBottom: Metrix.VerticalSize(2),
    color: Colors.PieChartGray1,
  },
  statValue: {
    fontSize: FontType.FontMedium,
    marginTop: Metrix.VerticalSize(0),
    color: Colors.PieChartGray1,
  },
  dashboardWhiteCard: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    padding: Metrix.VerticalSize(15),
    marginBottom: Metrix.VerticalSize(20),
  },
  monthTextStyle: {
    color: Colors.Grey,
    fontSize: FontType.FontExtraSmall,
    fontFamily: FONT_FAMILY?.InterRegular,
  },
  lineChartContainer: {
    marginTop: Metrix.VerticalSize(10),
  },
});

export default PendingDashboard;
