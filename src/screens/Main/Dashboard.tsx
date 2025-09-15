import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Animated,
  Easing,
  FlatList,
} from 'react-native';
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
import {CurveType, LineChart, PieChart} from 'react-native-gifted-charts';
import {ACTIVE_OPACITY} from '@/constants/globalConst';
import {dashboardLineChartData} from '@/constants/dummyData';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useMutation, useQuery} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import {
  formatLargeNumbers,
  formatPricing,
  getFullYearChartData,
} from '@/utils/business.helper';
import {useSelector} from 'react-redux';
import {
  setDropDownData,
  setStatusBadges,
  setUserDetail,
} from '@/redux/slice/UserSlice/userSlice';
import {dispatchToStore, RootState} from '@/redux/store';
import ListEmpty from '@/components/ListEmpty';
import {useFocusEffect} from '@react-navigation/native';
import DashboardSkeleton from '@/components/Skeleton/DashboardSkeleton';

const lineChartData = dashboardLineChartData;

const Dashboard = props => {
  const dropDownData = useSelector(
    (state: RootState) => state?.user?.dropdownData,
  );
  const leadsDataColors = useSelector(
    (state: RootState) => state?.user?.statusBadges?.lead,
  );
  const agency = useSelector((state: any) => state?.user?.userDetail?.agency);

  const agent = useSelector((state: any) => state?.user?.userDetail?.agent);
  const isAgent = useSelector((state: RootState) => state?.user?.agent);
  const [dashboardCardData, setDashboardCardData] = useState<any>();
  const [leadsChartData, setLeadsChartData] = useState<any>([]);
  const [lineChartData, setLineChartData] = useState<any>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [yearDropdownVisible, setYearDropdownVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const yearList = Array.from(
    {length: 12},
    (_, i) => new Date().getFullYear() - i,
  );
  const dropdownAnim = useRef(new Animated.Value(0)).current; // 0: closed, 1: open

  const values = lineChartData?.map(item => item?.value) || [];
  const maxYValue = values.length ? Math.max(...values) : 0;
  // Find the minimum (most negative) value
  const mostNegativeValue = Math.min(...values);
  // If all values are >= 0, fallback to 0
  const safeMinValue = mostNegativeValue < 0 ? mostNegativeValue : 0;

  const getNotifications = useMutation({
    mutationFn: () => APIS.getNotifications(),
    onSuccess: resp => {},
    onError: error => {},
  });
  useFocusEffect(
    useCallback(() => {
      getNotifications.mutate();
    }, []),
  );

  const {
    data: dashboardData,
    isFetching: dashboardDataLoading,
    isError: dashboardDataError,
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => APIS?.getDashboardData(),
  });

  const getProfile = useMutation({
    mutationFn: () => APIS.getProfileDetails(),
    onSuccess: resp => {
      dispatchToStore(setUserDetail(resp.data.data.details));
    },
    onError: error => {},
  });

  const {
    data: yearlySales,
    isError: yearlySalesError,
    refetch: yearlySalesRefetch,
    isFetching: chartLoading,
  } = useQuery({
    queryKey: ['yearlySale'],
    queryFn: () => APIS?.getYearlySales(String(selectedYear)),
    staleTime: 0, // 5 minutes cache time
  });

  // Dropdown data query
  const {data: dropdownData} = useQuery({
    queryKey: ['dropdownData'],
    queryFn: () => APIS.getDropDownData(),
    staleTime: 0,
  });

  // Common status query
  const {data: statusBadgeData} = useQuery({
    queryKey: ['statusBadgeData'],
    queryFn: () => APIS.getStatusBadgeData(),
    staleTime: 0,
  });

  useEffect(() => {
    if (dashboardData) {
      setDashboardCardData(dashboardData?.data?.data?.cards);
      setLeadsChartData(dashboardData?.data?.data?.charts?.leads);
    }
  }, [dashboardData]);

  useEffect(() => {
    if (yearlySales) {
      const chart = yearlySales?.data?.data?.chart || [];
      setLineChartData(getFullYearChartData(chart));
    }
  }, [yearlySales]);

  useEffect(() => {
    if (dropdownData) {
      dispatchToStore(setDropDownData(dropdownData?.data?.data?.dropdowns));
    }
  }, [dropdownData]);

  useEffect(() => {
    if (statusBadgeData) {
      dispatchToStore(setStatusBadges(statusBadgeData?.data?.data));
    }
  }, [statusBadgeData]);

  useEffect(() => {
    getProfile.mutate();
  }, []);

  const dashboardStats = [
    {
      icon: () => (
        <Images.UnitsSoldSVG
          color={Colors.White}
          height={Metrix.VerticalSize(30)}
          width={Metrix.HorizontalSize(30)}
        />
      ),
      label: 'Unit Sold',
      value: dashboardCardData?.units_sold || 0,
      onPress: () => {
        NavigationService.navigate(RouteNames.HomeRoutes.Overview);
      },
    },
    {
      icon: () => (
        <Images.CustomerSVG
          color={Colors.White}
          height={Metrix.VerticalSize(30)}
          width={Metrix.HorizontalSize(30)}
        />
      ),
      label: 'Customers',
      value: dashboardCardData?.customers ?? 0,
      onPress: () => {
        NavigationService.navigate(RouteNames.HomeRoutes.Overview);
      },
    },
    {
      icon: () => (
        <Images.SoldValueSVG
          color={Colors.White}
          height={Metrix.VerticalSize(30)}
          width={Metrix.HorizontalSize(30)}
        />
      ),
      label: 'Sold Value',
      value: formatPricing(dashboardCardData?.sold_value) ?? 0,
      onPress: () => {
        NavigationService.navigate(RouteNames.HomeRoutes.Overview);
      },
    },
    // {
    //   icon: () => <Images.CommissionDashboardSVG color={Colors.White} />,
    //   label: 'Paid Commission',
    //   value: formatPricing(cardData?.commission) ?? 0,
    //   onPress: () => {
    //     NavigationService.navigate('TabStack', {
    //       screen: 'Menu',
    //       params: {screen: 'Commissions'},
    //     });
    //   },
    // },
  ];

  const leadsPieData = leadsChartData?.map((item, idx) => {
    // Find the matching color from leadsDataColors based on the item key
    const matchingColor = leadsDataColors?.find(
      colorItem => colorItem?.key === item?.key,
    );

    // Use the primary_hex color from the matching status badge, or fallback to default colors
    const color =
      matchingColor?.value?.primary_hex ||
      [Colors.LightBlack, Colors.PieChartGray1, Colors.PieChartGray2][idx];

    return {...item, color};
  });

  // Helper to split array into two rows for legend
  // const getLegendRows = (data, itemsPerRow = 3) => {
  //   const firstRow = data.slice(0, itemsPerRow);
  //   const secondRow = data.slice(itemsPerRow);
  //   return [firstRow, secondRow];
  // };
  // const [legendRow1, legendRow2] = getLegendRows(leadsPieData || [], 3);
  const getLegendRows = (data, itemsPerRow = 3, maxRows = 3) => {
    const rows = [];
    for (let i = 0; i < maxRows; i++) {
      rows.push(data.slice(i * itemsPerRow, (i + 1) * itemsPerRow));
    }
    return rows;
  };

  // Example usage
  const [legendRow1, legendRow2, legendRow3] = getLegendRows(
    leadsPieData || [],
    3,
    3,
  );

  useEffect(() => {
    if (yearDropdownVisible) {
      setIsDropdownVisible(true);
      Animated.timing(dropdownAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => setIsDropdownVisible(false));
    }
  }, [yearDropdownVisible]);

  const dropdownStyle = {
    opacity: dropdownAnim,
    transform: [
      {
        translateY: dropdownAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-30, 0],
        }),
      },
    ],
  };

  const getTitle = () => {
    if (isAgent) {
      return `${agent?.first_name} ${agent?.last_name}`;
    } else {
      if (
        agency?.company?.category == 'UAE Freelancer' ||
        agency?.company?.category == 'International Freelancer'
      ) {
        return `${agency?.signatory?.first_name} ${agency?.signatory?.last_name}`;
      } else {
        return agency?.company?.name;
      }
    }
  };

  if (dashboardDataLoading || getProfile?.isPending) {
    return <DashboardSkeleton />;
  }

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
      notificationData={getNotifications?.data?.data?.data}
      customeStyle={styles.mainContainerPadding}
      onStartShouldSetResponder={() => {
        setYearDropdownVisible(false);
      }}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}>
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <CustomText.RegularText customStyle={styles.welcomeText}>
            Welcome,
          </CustomText.RegularText>
          <CustomText.LargeSemiBoldText customStyle={styles.welcomeNameText}>
            {getTitle()}
            <View>
              <Image
                source={Images.GreenShield}
                style={styles.verifiedBadge}
                resizeMode="contain"
              />
            </View>
          </CustomText.LargeSemiBoldText>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <FlatList
            keyExtractor={(_, idx) => idx?.toString()}
            data={dashboardStats}
            horizontal
            bounces={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <Pressable
                  onPress={item?.onPress}
                  key={index?.toString()}
                  style={[styles.statCard, styles.statCardHorizontal]}>
                  {item.icon()}
                  <CustomText.RegularText
                    isWhiteColor
                    customStyle={styles.statLabel}>
                    {item.label}
                  </CustomText.RegularText>
                  <CustomText.LargeSemiBoldText
                    isWhiteColor
                    customStyle={styles.statValue}>
                    {item.value}
                  </CustomText.LargeSemiBoldText>
                </Pressable>
              );
            }}
          />
        </View>

        {/* Yearly Sales Line Chart */}
        <View style={styles.dashboardWhiteCard}>
          <View style={styles.salesHeader}>
            <CustomText.LargeSemiBoldText>
              Yearly Sales
            </CustomText.LargeSemiBoldText>
            <TouchableOpacity
              onPress={() => {
                setYearDropdownVisible(prev => !prev);
              }}
              activeOpacity={ACTIVE_OPACITY}
              style={styles.yearSelector}>
              <CustomText.MediumText customStyle={styles.yearText}>
                {selectedYear}
              </CustomText.MediumText>
              <Image
                source={Images.Calendar}
                style={styles.calendarIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            {isDropdownVisible && (
              <Animated.View style={[styles.calendarContainer, dropdownStyle]}>
                {yearList?.map((item, index) => (
                  <TouchableOpacity
                    activeOpacity={ACTIVE_OPACITY}
                    onPress={() => {
                      setSelectedYear(item);
                      setYearDropdownVisible(false);
                      setTimeout(() => {
                        yearlySalesRefetch();
                      }, 1000);
                    }}
                    key={index?.toString()}
                    style={[
                      styles.calendarGridItem,
                      selectedYear === item && styles.selectedYearItem,
                    ]}>
                    <CustomText.RegularText customStyle={styles.yearItemText}>
                      {item}
                    </CustomText.RegularText>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}
          </View>
          <View style={styles.lineChartContainer}>
            {chartLoading ? (
              <SkeletonPlaceholder>
                <View style={styles.chartSkeletonBox} />
              </SkeletonPlaceholder>
            ) : (
              <LineChart
                data={lineChartData}
                thickness={4}
                color={Colors.LightBlack}
                curved
                curveType={CurveType.QUADRATIC}
                focusEnabled
                showDataPointOnFocus
                showDataPointLabelOnFocus
                showValuesAsDataPointsText
                yAxisLabelWidth={45}
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
                // maxValue={100000000}
                maxValue={maxYValue}
                mostNegativeValue={safeMinValue}
                // mostNegativeValue={-50000000}
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
                formatYLabel={formatLargeNumbers}
                xAxisLabelsVerticalShift={10}
                height={210}
                showVerticalLines={true}
                verticalLinesColor={Colors.LightGrey}
                verticalLinesThickness={StyleSheet.hairlineWidth}
                endSpacing={-5}
                isAnimated={true}
                animationDuration={1200}
              />
            )}
          </View>
        </View>

        {/* Leads Stage Pie Chart Section */}
        <View style={styles.dashboardWhiteCard}>
          <CustomText.LargeSemiBoldText>
            Leads Stage
          </CustomText.LargeSemiBoldText>
          {leadsPieData?.length == 0 ? (
            <View style={styles.noDataFound}>
              <ListEmpty />
            </View>
          ) : (
            <>
              <View style={styles.pieChartContainer}>
                <PieChart
                  data={leadsPieData?.map(item => ({
                    value: item.value,
                    color: item.color,
                    // text: String(item?.value),
                  }))}
                  textColor={Colors.White}
                  textSize={18}
                  fontWeight="500"
                  radius={110}
                  innerRadius={0}
                  showText={true}
                  isAnimated
                  animationDuration={1200}
                  focusOnPress
                />
              </View>
              <View style={styles.pieLegendRow}>
                {legendRow1?.map((item, index) => (
                  <View key={index?.toString()} style={styles.pieLegendItem}>
                    <View
                      style={[
                        styles.pieLegendDot,
                        {backgroundColor: item.color},
                      ]}
                    />
                    <CustomText.RegularText customStyle={styles.extraSmallText}>
                      {item.key}
                      {` (${item?.value})`}
                    </CustomText.RegularText>
                  </View>
                ))}
              </View>
              {legendRow2.length > 0 && (
                <View style={styles.pieLegendRow}>
                  {legendRow2?.map((item, index) => (
                    <View key={index?.toString()} style={styles.pieLegendItem}>
                      <View
                        style={[
                          styles.pieLegendDot,
                          {backgroundColor: item.color},
                        ]}
                      />
                      <CustomText.RegularText
                        customStyle={styles.extraSmallText}>
                        {item.key}
                        {` (${item?.value})`}
                      </CustomText.RegularText>
                    </View>
                  ))}
                </View>
              )}
              {legendRow3.length > 0 && (
                <View style={styles.pieLegendRow}>
                  {legendRow3?.map((item, index) => (
                    <View key={index?.toString()} style={styles.pieLegendItem}>
                      <View
                        style={[
                          styles.pieLegendDot,
                          {backgroundColor: item.color},
                        ]}
                      />
                      <CustomText.RegularText
                        customStyle={styles.extraSmallText}>
                        {item.key}
                        {` (${item?.value})`}
                      </CustomText.RegularText>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  mainContainerPadding: {
    paddingHorizontal: Metrix.HorizontalSize(20),
  },
  welcomeBanner: {
    alignItems: 'flex-start',
    backgroundColor: Colors.TransparentGrey,
    borderRadius: Metrix.LightRadius,
    paddingVertical: Metrix.VerticalSize(7),
    paddingHorizontal: Metrix.VerticalSize(12),
    marginTop: Metrix.VerticalSize(15),
  },
  verifiedBadge: {
    width: Metrix.HorizontalSize(20),
    height: Metrix.HorizontalSize(20),
    top: Metrix.VerticalSize(3),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: Metrix.VerticalSize(15),
  },
  statCard: {
    backgroundColor: Colors.LightBlack,
    borderRadius: Metrix.Radius,
    width: '48%',
    marginBottom: Metrix.VerticalSize(15),
    paddingVertical: Metrix.VerticalSize(8),
    paddingHorizontal: Metrix.VerticalSize(10),
    alignItems: 'flex-start',
  },
  iconCircle: {
    backgroundColor: Colors.DarkGrey,
    borderRadius: Metrix.RoundRadius,
    width: Metrix.HorizontalSize(30),
    height: Metrix.HorizontalSize(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Metrix.VerticalSize(5),
  },
  statIcon: {
    width: Metrix.HorizontalSize(16),
    height: Metrix.HorizontalSize(16),
  },
  statLabel: {
    fontSize: FontType.FontSemiRegular,
    marginBottom: Metrix.VerticalSize(2),
  },
  statValue: {
    fontSize: FontType.FontMedium,
    marginTop: Metrix.VerticalSize(0),
  },
  calendarContainer: {
    position: 'absolute',
    zIndex: 20,
    width: '100%',
    top: Metrix.VerticalSize(40),
    backgroundColor: Colors.UnreadColor,
    borderRadius: Metrix.Radius,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingTop: Metrix.VerticalSize(10),
  },
  calendarGridItem: {
    width: '30%',
    marginBottom: Metrix.VerticalSize(5),
    paddingVertical: Metrix.VerticalSize(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Metrix.LightRadius,
  },
  dashboardWhiteCard: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    padding: Metrix.VerticalSize(15),
    marginBottom: Metrix.VerticalSize(20),
  },
  noDataFound: {
    height: Metrix.VerticalSize(150),
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieChartContainer: {
    alignSelf: 'center',
    marginVertical: Metrix.VerticalSize(10),
  },
  salesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Metrix.VerticalSize(10),
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    borderRadius: Metrix.LightRadius,
    paddingHorizontal: Metrix.HorizontalSize(8),
    paddingVertical: Metrix.VerticalSize(5),
    backgroundColor: Colors.White,
  },
  yearText: {
    color: Colors.DarkGrey,
    marginRight: Metrix.HorizontalSize(7),
    fontSize: FontType.FontSmall,
  },
  calendarIcon: {
    width: Metrix.HorizontalSize(14),
    height: Metrix.HorizontalSize(14),
    tintColor: Colors.Grey,
  },
  announcementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Metrix.VerticalSize(10),
  },
  announcementCard: {
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
    paddingHorizontal: Metrix.VerticalSize(15),
    paddingVertical: Metrix.VerticalSize(12),
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    marginVertical: Metrix.VerticalSize(5),
  },
  title: {
    fontSize: FontType.FontSmall,
    marginBottom: Metrix.VerticalSize(5),
  },
  description: {
    fontSize: FontType.FontSmall,
    marginBottom: Metrix.VerticalSize(5),
  },
  leadsStageTitle: {
    marginBottom: Metrix.VerticalSize(10),
  },
  pieLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Metrix.VerticalSize(10),
  },
  pieLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Metrix.HorizontalSize(7),
  },
  pieLegendDot: {
    width: Metrix.HorizontalSize(10),
    height: Metrix.HorizontalSize(10),
    borderRadius: Metrix.RoundRadius,
    marginRight: Metrix.HorizontalSize(5),
  },
  pieLegendLabel: {
    // color: Colors.DarkGrey,
  },
  statCardHorizontal: {
    width: Metrix.HorizontalSize(120),
    height: Metrix.VerticalSize(90),
    marginRight: Metrix.HorizontalSize(10),
  },
  monthTextStyle: {
    color: Colors.Grey,
    fontSize: FontType.FontSuperSmall,
    fontFamily: FONT_FAMILY?.InterRegular,
  },
  headerIconStyle: {
    width: Metrix.HorizontalSize(26),
    height: Metrix.VerticalSize(26),
  },
  welcomeText: {
    fontSize: FontType.FontLarge,
    padding: Metrix.VerticalSize(0),
    marginVertical: 0,
    width: '95%',
  },
  welcomeNameText: {
    fontSize: FontType.FontLarge,
    padding: Metrix.VerticalSize(0),
    marginVertical: 0,
  },
  lineChartContainer: {
    marginTop: Metrix.VerticalSize(10),
  },
  chartSkeletonBox: {
    height: Metrix.VerticalSize(245),
    borderRadius: Metrix.Radius,
  },
  selectedYearItem: {
    backgroundColor: Colors.White,
  },
  yearItemText: {
    fontSize: FontType.FontSemiRegular,
  },
  extraSmallText: {
    fontSize: FontType.FontExtraSmall,
  },
  buttonContainer: {
    paddingHorizontal: Metrix.VerticalSize(15),
  },
  scrollContentContainer: {
    paddingBottom: Metrix.VerticalSize(40),
    flexGrow: 1,
  },
});

export default Dashboard;
