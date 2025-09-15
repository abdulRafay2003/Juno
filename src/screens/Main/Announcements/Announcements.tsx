import React, {useCallback, useMemo, useState, useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {MainContainer} from '@/components/MainContainer';
import NotificationCard from '@/components/NotificationCard';
import {Metrix, NavigationService} from '@/config';
import AnnouncementCard from '@/components/AnnouncementCard';
import {RouteNames} from '@/config/routes';
import {announcementsData} from '@/constants/dummyData';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Colors from '@/config/colors';

const Announcements = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderItem = useCallback(
    ({item}) => (
      <AnnouncementCard
        title={item.title}
        description={item.description}
        time={item.time}
        style={styles.cardSpacing}
        date={'2025-06-26'}
        isUnread={item.isUnread}
        onPress={() => {
          NavigationService.navigate(RouteNames.HomeRoutes.AnnouncementDetails);
        }}
      />
    ),
    [],
  );

  const keyExtractor = useCallback(item => item?.id, []);

  const announcements = useMemo(() => announcementsData, []);

  if (loading) {
    return (
      <MainContainer isFlatList isHeader heading="Announcements" backArrow>
        <View style={styles.skeletonListContainer}>
          {[...Array(6)].map((_, idx) => (
            <SkeletonPlaceholder borderRadius={8} key={idx}>
              <SkeletonPlaceholder.Item
                width={'100%'}
                borderRadius={Metrix.Radius}
                marginBottom={12}
                padding={Metrix.VerticalSize(15)}
                backgroundColor={Colors.White}
                borderWidth={1}
                borderColor={Colors.TextInputBorderColor}
                flexDirection="column">
                {/* Row 1: Date box + Title */}
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="center"
                  marginBottom={Metrix.VerticalSize(5)}>
                  {/* Date box */}
                  <SkeletonPlaceholder.Item
                    width={Metrix.HorizontalSize(50)}
                    height={Metrix.HorizontalSize(50)}
                    borderRadius={Metrix.LightRadius}
                    marginRight={Metrix.HorizontalSize(10)}>
                    {/* Day */}
                    <SkeletonPlaceholder.Item
                      width={55}
                      height={55}
                      borderRadius={4}
                      marginTop={8}
                      alignSelf="center"
                    />
                  </SkeletonPlaceholder.Item>
                  {/* Title */}
                  <SkeletonPlaceholder.Item
                    width={280}
                    height={30}
                    borderRadius={4}
                  />
                </SkeletonPlaceholder.Item>
                {/* Row 2: Description */}
                <SkeletonPlaceholder.Item
                  width={'100%'}
                  height={14}
                  borderRadius={3}
                  marginTop={Metrix.VerticalSize(15)}
                  marginBottom={Metrix.VerticalSize(5)}
                />
                {/* Row 3: Time */}
                <SkeletonPlaceholder.Item
                  width={60}
                  height={10}
                  borderRadius={3}
                  marginBottom={2}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          ))}
        </View>
      </MainContainer>
    );
  }

  return (
    <MainContainer isFlatList isHeader heading="Announcements" backArrow>
      <FlatList
        data={announcements}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={7}
        windowSize={10}
        removeClippedSubviews={true}
        contentContainerStyle={styles.listContent}
        bounces={false}
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  cardSpacing: {
    marginBottom: Metrix.VerticalSize(5),
  },
  listContent: {paddingTop: Metrix.VerticalSize(10)},
  skeletonListContainer: {
    paddingTop: Metrix.VerticalSize(15),
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
});

export default Announcements;
