import {MainContainer} from '@/components';
import {Colors, Images, Metrix} from '@/config';
import {getFileExtensionFromUrl} from '@/utils/business.helper';
import React, {useState} from 'react';
import Pdf from 'react-native-pdf';
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

const FloorPlan = ({route}) => {
  const {url} = route.params;

  const [loading, setLoading] = useState(true);

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

  return (
    <MainContainer isHeader heading="Floor Plan">
      {getFileExtensionFromUrl(url).toLowerCase() == 'pdf' ? (
        <View style={styles.pdfContainer}>
          <Pdf
            showsVerticalScrollIndicator={false}
            trustAllCerts={false}
            source={{
              uri: url,
              cache: true,
            }}
            onLoadComplete={onLoadComplete}
            onPageChanged={onPageChanged}
            onError={onError}
            onPressLink={onPressLink}
            style={styles.pdf}
            enableDoubleTapZoom
            onPageSingleTap={onPageSingleTap}
          />
        </View>
      ) : (
        <View style={[styles.container, loading && {justifyContent: 'center'}]}>
          <Image
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            source={{uri: url}}
            resizeMode="contain"
            style={!loading && styles.floorPlanImage}
          />
          {loading && <ActivityIndicator size="large" color={Colors.Black} />}
        </View>
      )}

      {/* Commented in case client changes their mind */}
      {/* <View style={styles.alignBtn}>
        <PrimaryButton
          titleIcon={Images.Download}
          title={'Download Floor Plan'}
          customStyles={globalStyles.buttonSpacing}
          onPress={() => downloadInvoice(pdfLink, pdfName)}
        />
      </View> */}
    </MainContainer>
  );
};
export default FloorPlan;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: Metrix.VerticalSize(10),
  },
  pdfContainer: {
    flex: 0.7,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: Metrix.VerticalSize(20),
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: Metrix.VerticalSize(455),
    backgroundColor: Colors.PieChartGray1,
  },
  alignBtn: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom:
      Platform.OS == 'android'
        ? Metrix.VerticalSize(20)
        : Metrix.VerticalSize(0),
  },
  floorPlanImage: {width: '100%', height: '100%'},
});
