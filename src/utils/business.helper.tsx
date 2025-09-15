import {toastRef} from '@/components/ToastProvider/ToastProvider';
import {
  setFilterPayload,
  setTokens,
  setUserDetail,
} from '@/redux/slice/UserSlice/userSlice';
import {store} from '@/redux/store';
import {APIS} from '@/services/apiMethods';
import moment from 'moment';
import {Linking, Platform, PermissionsAndroid} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';

export const timeHumanize = (time: string): string => {
  let current_time: any = moment().format('x');
  let to_local = moment(time).format('YYYY-MM-DD HH:mm:ss');
  let that_time: any = moment(to_local).format('x');
  let diff = current_time - that_time;

  var final_time = Math.floor(diff / 1000 / 60);
  if (final_time < 1) {
    return 'just now';
  } else if (final_time >= 1 && final_time < 60) {
    if (final_time < 2) {
      return `${final_time} min ago`;
    } else {
      return `${final_time} min ago`;
    }
  } else if (final_time >= 60 && final_time < 1440) {
    let new_hour = Math.floor(final_time / 60);
    if (new_hour <= 1) {
      return `${new_hour} hour ago`;
    } else {
      return `${new_hour} hours ago`;
    }
  } else {
    return moment(time).calendar(null, {
      lastDay: `[yesterday ${moment(time).format('hh:mm A')}]`,
      lastWeek: `[${moment(time).format('DD, MMM YYYY  hh:mm A')}]`,
      sameElse: `[${moment(time).format('DD, MMM YYYY  hh:mm A')}]`,
    });
  }
};
export const downloadCommisionInvoice = async (
  source,
  name,
  setSelected?: any,
) => {
  APIS.signedUrl(source)
    .then(resp => {
      let dirs = ReactNativeBlobUtil?.fs?.dirs;
      let extention = getFileExtensionFromUrl(source)?.toLowerCase();
      ReactNativeBlobUtil.config({
        fileCache: true,
        appendExt: extention,
        path: `${dirs.DocumentDir}/${'name'}.${extention}`,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: name,
          description: 'File downloaded by download manager.',
          mime:
            extention == 'pdf'
              ? 'application/pdf'
              : extention == 'png'
                ? 'image/png'
                : extention == 'heic'
                  ? 'image/heic'
                  : 'image/jpeg',
          // path: `${dirs.DownloadDir}/${name}.${extention}`,
        },
      })

        .fetch('GET', resp?.data?.data?.signed_url)
        .then(async res => {
          const filePath = res.path();
          let options = {};
          if (Platform.OS === 'android') {
            options = {
              type:
                extention == 'pdf'
                  ? 'application/pdf'
                  : extention == 'png'
                    ? 'image/png'
                    : 'image/jpeg',
              url: `file://${filePath}`,
              showAppsToView: true,
              failOnCancel: false,
            };
          } else {
            options = {
              type: 'application/pdf',
              url: filePath,
            };
          }

          setSelected(null);
          Share.open(options)
            .then(resp => console.log(resp))
            .catch(err => console.log(err.response?.errorMessage || err));
        })
        .catch(err => console.log('BLOB ERROR -> ', err));
    })
    .catch(err => console.log('SINGNED ERROR -> ', err.response));
};
export const downloadInvoice = async (source, name) => {
  let dirs = ReactNativeBlobUtil.fs.dirs;
  ReactNativeBlobUtil.config({
    fileCache: true,
    appendExt: 'pdf',
    path: `${dirs.DocumentDir}/${name}.pdf`,
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      title: name,
      description: 'File downloaded by download manager.',
      mime: 'application/pdf',
      path: `${dirs.DownloadDir}/${name}.pdf`,
    },
  })
    .fetch('GET', source)
    .then(async res => {
      if (Platform.OS === 'ios') {
        const filePath = res.path();
        let options = {
          type: 'application/pdf',
          url: filePath,
        };
        Share.open(options)
          .then(resp => console.log(resp))
          .catch(err => console.log(err));
      } else {
        const filePath = res.path();
        let options = {
          type: 'application/pdf',
          url: `file://${filePath}`,
          showAppsToView: true,
          failOnCancel: false,
        };
        Share.open(options)
          .then(resp => console.log(resp))
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log('BLOB ERROR -> ', err));
};

export const findCountryByCode = (input: any) => {
  const cleanInput = input.startsWith('+') ? input.slice(1) : input;

  const found = store
    .getState()
    .user.dropdownData.mobile_country_code.find(
      entry => entry.key === cleanInput,
    );
  if (found) {
    return found?.id;
  } else {
    return `Country not found for code: ${input}`;
  }
};

export const getCountryDialCode = apiString => {
  if (!apiString) return '';
  const parts = apiString.split(':');
  if (parts.length !== 2) return '';
  const code = parts[1].trim();
  return `+${code}`;
};

const getFilePath = (name: string) => {
  const dirs = ReactNativeBlobUtil.fs.dirs;
  return `${dirs.DocumentDir}/${name}.pdf`;
};

const downloadTempPDF = async (
  source: string,
  name: string,
): Promise<string> => {
  const path = getFilePath(name);

  const res = await ReactNativeBlobUtil.config({
    fileCache: true,
    appendExt: 'pdf',
    path,
  }).fetch('GET', source);

  return res.path();
};

export const showToast = (
  type: 'error' | 'success' | 'alert',
  title: string,
  subTitle: string,
) => {
  toastRef.show({
    type: type,
    message: title,
    subMessage: subTitle,
  });
};

// Request phone permissions for Android
const requestPhonePermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        {
          title: 'Phone Permission',
          message: 'This app needs access to make phone calls.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Error requesting phone permission:', err);
      return false;
    }
  }
  return true;
};

export const openDialer = async (phoneNumber: string) => {
  try {
    const hasPermission = await requestPhonePermissions();
    if (!hasPermission) {
      showToast('error', 'Permission Denied', 'Phone permission is required');
      return;
    }

    let cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
    const dialerUrl =
      Platform.OS === 'android' ? `tel:${cleanNumber}` : `tel://${cleanNumber}`;

    await Linking.openURL(dialerUrl);
  } catch (error) {
    console.error('Error in openDialer:', error);
    showToast('error', 'Error', 'Failed to open phone dialer');
  }
};

export const openWhatsApp = async (
  phoneNumber: string,
  message: string = '',
) => {
  try {
    // Clean the phone number - remove any non-digit characters except +
    let cleanNumber = phoneNumber.replace(/[^\d+]/g, '');

    // Ensure the number starts with + for international format
    if (!cleanNumber.startsWith('+')) {
      // If it's a local number, add the country code (assuming UAE +971)
      // cleanNumber = '+971' + cleanNumber.replace(/^0+/, '');
    }

    // // Remove the + for WhatsApp API
    const whatsappNumber = cleanNumber.replace('+', '');

    // Create WhatsApp URL
    const whatsappUrl = message
      ? `whatsapp://send?phone=${cleanNumber}&text=${encodeURIComponent(message)}`
      : `whatsapp://send?phone=${cleanNumber}`;

    const supported = await Linking.canOpenURL(whatsappUrl);

    if (supported) {
      await Linking.openURL(whatsappUrl);
    } else {
      // Fallback to web WhatsApp if app is not installed
      const webWhatsappUrl = message
        ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
        : `https://wa.me/${whatsappNumber}`;

      await Linking.openURL(webWhatsappUrl);
    }
  } catch (error) {
    console.error('Error in openWhatsApp:', error);
    showToast('error', 'Error', 'Failed to open WhatsApp');
  }
};

export const openMapAddress = (address: string) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  Linking.openURL(url).catch(err => console.error(err));
};
export const getAccountStatus = () => {
  const userDetails = store.getState().user.userDetail as any;
  if (userDetails?.status === 'PENDING') {
    return true;
  } else {
    return false;
  }
};

export const formatLargeNumbers = value => {
  const num = Number(value);
  if (isNaN(num)) return value;
  if (Math.abs(num) >= 1_000_000_000)
    return (
      (num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 1) + 'B'
    );
  if (Math.abs(num) >= 1_000_000)
    return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + 'M';
  if (Math.abs(num) >= 1_000)
    return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + 'K';
  return num.toString();
};

export const formatPricing = (value, currency = 'AED') => {
  const num = Number(value);
  if (isNaN(num)) return value;

  let formatted = '';

  if (Math.abs(num) >= 1_000_000_000) {
    formatted =
      (num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 1) + 'B';
  } else if (Math.abs(num) >= 1_000_000) {
    formatted = (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + 'M';
  } else if (Math.abs(num) >= 1_000) {
    formatted = (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + 'K';
  } else {
    formatted = num.toString();
  }

  return `${formatted}`;
};

export function formatDate(dateInput: Date | string): string {
  // const date = new Date(dateInput);
  // const day = date.getDate();
  // const month = date.toLocaleString('en-US', {month: 'short'});
  // const year = date.getFullYear();
  return moment(dateInput).format('YYYY-MM-DD');
}

export function hasAnyValue(obj: any): boolean {
  return Object.values(obj).some(value => value !== null && value !== '');
}

// Helper function to fill missing months with 0
export const getFullYearChartData = chartData => {
  const months = [
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
  ];
  const dataMap = {};
  chartData?.forEach(item => {
    dataMap[item.key] = item.value;
  });
  return months.map(month => ({
    key: month,
    value: dataMap[month] ?? 0,
  }));
};

export const getStatusBadgeColors = (status: string, statusBadges: any) => {
  if (!status || !statusBadges) {
    return {
      primary_hex: '#7A7C7E', // Default grey color
      secondary_hex: '#EEEEEE', // Default light grey background
    };
  }

  const matchedBadge = statusBadges.find((badge: any) => badge?.key === status);

  const defaultBadge = statusBadges.find(
    (badge: any) => badge?.key === 'Default',
  );

  if (matchedBadge) {
    return {
      primary_hex: matchedBadge.value?.primary_hex,
      secondary_hex: matchedBadge.value?.secondary_hex,
    };
  } else {
    // If no match found, look for Default badge in this category
    if (defaultBadge) {
      return {
        primary_hex: defaultBadge.value?.primary_hex || '#7A7C7E',
        secondary_hex: defaultBadge.value?.secondary_hex || '#EEEEEE',
      };
    }
  }
};

export const getStatusColorsFromItem = (
  itemStatus: string,
  statusBadges: any,
) => {
  return getStatusBadgeColors(itemStatus, statusBadges);
};

export const findConditionStatus = (id, data) => {
  const find = data?.find(item => {
    return item?.id === id || item?.value === id;
  });
  return find?.value;
};

export function getFileExtensionFromUrl(url) {
  try {
    const path = (new URL(url) as any)?.pathname; // safer for real URLs
    const fileName = path.split('/').pop(); // get last segment
    const extension = fileName.includes('.') ? fileName.split('.').pop() : '';
    return extension.toLowerCase(); // return in lowercase (optional)
  } catch (error) {
    // fallback if not a valid URL
    const fallbackPath = url.split('/').pop();
    return fallbackPath && fallbackPath.includes('.')
      ? fallbackPath.split('.').pop().toLowerCase()
      : '';
  }
}

/**
 * Check user status from me API and handle logout logic
 * If API returns 403, continue on pending state
 * If API returns success with approved status, logout user
 * @returns Promise<void>
 */
export const checkUserStatusAndHandleLogout = async (): Promise<void> => {
  try {
    const response = await APIS.getMeDetails();
    const userVerified = response?.data?.data?.is_sf_verified;

    // If user status is APPROVED, show success toast and logout the user
    if (userVerified === true) {
      // Show success toast
      toastRef.show({
        type: 'alert',
        message: 'Account Approved!',
        subMessage: 'Your account has been approved. Please login again.',
      });

      // Wait a bit for toast to show, then logout
      setTimeout(async () => {
        const {loginSucces, setAuthPayload} = await import(
          '@/redux/slice/AuthSlice/authSlice'
        );
        const {dispatchToStore} = await import('@/redux/store');
        dispatchToStore(setUserDetail({}));
        dispatchToStore(setTokens({}));
        dispatchToStore(setFilterPayload({}));
        dispatchToStore(setAuthPayload({}));
        dispatchToStore(loginSucces(false));
      }, 5000);

      return;
    }

    // If still pending or any other status, continue (no action needed)
  } catch (error: any) {
    // If API returns 403 (Forbidden), continue on pending state
    if (error?.response?.status === 403) {
      return;
    }

    // For other errors, log but don't take action
    console.log(
      'Error checking user status:',
      error?.response?.status || error?.message,
    );
  }
};

export const DateModifier = date => {
  if (
    date != undefined &&
    date != null &&
    date != '' &&
    date != 'invalid' &&
    date != false
  ) {
    return moment(date).format('DD-MM-YYYY');
  } else {
    return '-';
  }
};

export const sanitizeFileName = (name: string) => {
  return name.trim().replace(/\s+/g, '_');
};
