import {MainContainer, PrimaryButton} from '@/components';
import {Colors, Images, Metrix} from '@/config';
import {globalStyles} from '@/constants/globalStyles';
import {APIS} from '@/services/apiMethods';
import {
  downloadInvoice,
  getFileExtensionFromUrl,
} from '@/utils/business.helper';
import {useMutation} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';
import Pdf from 'react-native-pdf';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const ViewInvoice = ({route}) => {
  const {doc} = route.params;
  const [isLoadingSignedUrl, setIsLoadingSignedUrl] = useState(true);
  const [source, setSource] = useState({
    uri: '',
    cache: true,
  });

  const getSignedUrl = useMutation({
    mutationFn: async (documentId: string) => {
      return await APIS?.signedUrl(documentId);
    },
    onSuccess: data => {
      setSource({
        uri: data?.data?.data?.signed_url,
        cache: true,
      });
      setIsLoadingSignedUrl(false);
    },
    onError: error => {
      setIsLoadingSignedUrl(false);
    },
  });

  useEffect(() => {
    getSignedUrl.mutate(doc?.url);
  }, []);
  const onLoadComplete = (numberOfPages, filePath) => {
    console.log(`number of pages: ${numberOfPages}`);
    console.log(`file path: ${filePath}`);
  };
  const onPageChanged = (page, numberOfPages) => {
    console.log(`current page: ${page}`);
    console.log(`number of pages: ${numberOfPages}`);
  };
  const onError = error => {
    console.error(`Error while loading PDF: ${error}`);
  };
  const onPressLink = uri => {
    console.log(`Link pressed: ${uri}`);
  };
  const onPageSingleTap = pdf => {
    console.log(`Single Tap ${pdf}`);
  };

  if (!isLoadingSignedUrl) {
    return (
      <MainContainer
        isHeader
        isFlatList
        customeStyle={{flex: 1}}
        heading="View Invoice">
        <View style={styles.container}>
          {/* PDF Viewer Skeleton */}
          <SkeletonPlaceholder borderRadius={Metrix.Radius}>
            <View style={styles.pdfSkeleton}>
              {/* PDF Loading Placeholder - Large central area */}
              <View style={styles.pdfContentSkeleton}>
                {/* PDF Document Icon Skeleton */}
                <View style={styles.pdfIconSkeleton} />
                {/* Loading Text Skeleton */}
                <View style={styles.loadingTextSkeleton} />
                {/* Progress Bar Skeleton */}
                <View style={styles.progressBarSkeleton} />
              </View>
            </View>
          </SkeletonPlaceholder>
        </View>
        <View style={styles.alignBtn}>
          {/* Download Button Skeleton */}
          <SkeletonPlaceholder borderRadius={8}>
            <View style={styles.buttonSkeleton} />
          </SkeletonPlaceholder>
        </View>
      </MainContainer>
    );
  }

  return (
    <MainContainer
      customeStyle={{flex: 1}}
      isHeader
      isFlatList
      heading="View Invoice">
      <View style={styles.container}>
        {getFileExtensionFromUrl(doc?.url).toLowerCase() == 'pdf' ? (
          <Pdf
            showsVerticalScrollIndicator={false}
            trustAllCerts={false}
            source={source}
            onLoadComplete={onLoadComplete}
            onPageChanged={onPageChanged}
            onError={onError}
            onPressLink={onPressLink}
            style={styles.pdf}
            enableDoubleTapZoom
            onPageSingleTap={onPageSingleTap}
          />
        ) : (
          <Image
            source={{uri: source.uri}}
            style={styles.pdf}
            resizeMode="contain"
          />
        )}
      </View>
      <View style={styles.alignBtn}>
        <PrimaryButton
          titleIcon={() => <Images.DownloadSVG color={Colors.White} />}
          title={'Download Invoice'}
          customStyles={globalStyles.buttonSpacing}
          onPress={() => downloadInvoice(source?.uri, doc?.type)}
        />
      </View>
    </MainContainer>
  );
};
export default ViewInvoice;
const styles = StyleSheet.create({
  container: {
    flex: 0.7,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: Metrix.VerticalSize(20),
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.PieChartGray1,
  },
  alignBtn: {
    flex: 0.3,
    justifyContent: 'flex-end',
  },
  // Skeleton Styles
  pdfSkeleton: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.PieChartGray1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfContentSkeleton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfIconSkeleton: {
    width: Metrix.HorizontalSize(80),
    height: Metrix.VerticalSize(80),
    borderRadius: Metrix.Radius,
    backgroundColor: Colors.LightGrey,
    marginBottom: Metrix.VerticalSize(20),
  },
  loadingTextSkeleton: {
    width: Metrix.HorizontalSize(120),
    height: Metrix.VerticalSize(16),
    borderRadius: Metrix.LightRadius,
    backgroundColor: Colors.LightGrey,
    marginBottom: Metrix.VerticalSize(15),
  },
  progressBarSkeleton: {
    width: Metrix.HorizontalSize(200),
    height: Metrix.VerticalSize(4),
    borderRadius: Metrix.LightRadius,
    backgroundColor: Colors.LightGrey,
  },
  buttonSkeleton: {
    width: '100%',
    height: Metrix.VerticalSize(48),
    borderRadius: Metrix.Radius,
    backgroundColor: Colors.LightGrey,
  },
});
