import React, {useState} from 'react';
import {View, StyleSheet, Image, Platform} from 'react-native';
import CustomText from '@/components/CustomText';
import {PrimaryButton} from '@/components/PrimaryButton';
import {MainContainer} from '@/components/MainContainer';
import {Colors, FontType, Metrix} from '@/config';
import Images from '@/config/images';
import {Loader, SecondaryButton} from '@/components';
import {downloadInvoice, showToast} from '@/utils/business.helper';
import {APIS} from '@/services/apiMethods';
import {useMutation} from '@tanstack/react-query';
export default function OfferReady({route}) {
  const [btnLoading, setBtnLoading] = useState(null);

  const {document} = route?.params;

  const getSignedUrl = useMutation({
    mutationFn: async (documentId: string) => {
      return await APIS.signedUrl(documentId);
    },
    onSuccess: data => {
      const url = data?.data?.data?.signed_url;
      if (url) {
        if (btnLoading === 'download') {
          downloadInvoice(url, 'Salesoffer');
          showToast('success', 'Success', 'Document downloaded successfully!');
        } else if (btnLoading === 'whatsapp') {
          downloadInvoice(url, 'Salesoffer');
        } else if (btnLoading === 'email') {
          downloadInvoice(url, 'Salesoffer');
        }

        setBtnLoading(null); // Reset selected after download
      } else {
        showToast('error', 'Error', 'Failed to get signed URL');
        setBtnLoading(null); // Reset selected after download
      }
    },
    onError: error => {
      showToast('error', 'Error', error?.message || 'Failed to download');
      setBtnLoading(null); // Reset selected after download
    },
  });

  const onPress = (type: string) => {
    setBtnLoading(type);
    getSignedUrl.mutate(document?.url);
  };

  return (
    <MainContainer isHeader heading="Offer Ready">
      <View style={styles.middleContainer}>
        <Image
          source={Images.Success}
          style={styles.successIcon}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <CustomText.RegularText customStyle={[styles.headingStyle]}>
            Sales Offer Is Ready To{'\n'} Download and Send
          </CustomText.RegularText>
        </View>
      </View>
      <PrimaryButton
        title={'Download & Preview Sales Offer'}
        onPress={() => onPress('download')}
        isLoading={btnLoading === 'download'}
        customTextStyle={styles.downloadButton}
        customStyles={styles.downloadContainer}
        titleIcon={() => (
          <Images.DownloadSVG
            color={Colors.White}
            marginRight={Metrix.HorizontalSize(10)}
          />
        )}
      />
      <SecondaryButton
        title={'Share via WhatsApp'}
        onPress={() => onPress('whatsapp')}
        isLoading={btnLoading === 'whatsapp'}
        titleIcon={() => <Images.WhatsappSVG />}
        customStyles={styles.shareBtn}
        textBold
      />
      <SecondaryButton
        title={'Share via Email'}
        isLoading={btnLoading === 'email'}
        onPress={() => onPress('email')}
        titleIcon={() => <Images.EmailSVG />}
        customStyles={styles.shareEmailBtn}
        textBold
      />
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  middleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieStyle: {
    width: Metrix.HorizontalSize(100),
    height: Metrix.VerticalSize(100),
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Metrix.VerticalSize(10),
  },
  headingStyle: {
    textAlign: 'center',
    fontSize: FontType.FontExtraLarge2,
  },
  subHeading: {textAlign: 'center', width: '100%'},
  successIcon: {
    width: Metrix.HorizontalSize(50),
    height: Metrix.VerticalSize(50),
  },
  detailText: {
    fontSize: FontType.FontRegular,
    paddingTop: Metrix.VerticalSize(10),
    color: Colors.PieChartGray1,
  },
  downloadButton: {
    fontSize: FontType.FontRegular,
  },
  shareBtn: {
    marginVertical: Metrix.HorizontalSize(0),
    marginBottom: Metrix.VerticalSize(15),
    borderColor: Colors.Black,
  },
  shareEmailBtn: {
    marginVertical: Metrix.HorizontalSize(0),
    marginBottom:
      Platform.OS == 'android'
        ? Metrix.VerticalSize(40)
        : Metrix.VerticalSize(0),

    borderColor: Colors.Black,
  },
  shareBtnTextStyle: {
    color: Colors.Black,
  },
  downloadContainer: {
    marginBottom: Metrix.VerticalSize(15),
  },
});
