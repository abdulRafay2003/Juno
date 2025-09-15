import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HAS_LAUNCHED_KEY = 'hasLaunchedBefore';
const CREDENTIALS_KEY = 'savedCredentials';

const rnBiometrics = new ReactNativeBiometrics();

export async function saveCredentials(username, password) {
  // Save credentials in AsyncStorage (not secure as Keychain, but enough for demo)
  // In production, you might encrypt this
  await AsyncStorage.setItem(
    CREDENTIALS_KEY,
    JSON.stringify({username, password}),
  );
  await AsyncStorage.setItem(HAS_LAUNCHED_KEY, 'true');
}

export async function isFirstLaunch() {
  const hasLaunched = await AsyncStorage.getItem(HAS_LAUNCHED_KEY);
  return !hasLaunched;
}

export async function getBiometryType() {
  const {available, biometryType} = await rnBiometrics.isSensorAvailable();
  if (!available) return null;
  return biometryType;
}

export async function promptBiometricAuth() {
  const biometryType = await getBiometryType();
  if (!biometryType) return null;

  const promptMessage =
    biometryType === BiometryTypes.FaceID
      ? 'Login with Face ID'
      : biometryType === BiometryTypes.TouchID
        ? 'Login with Touch ID'
        : 'Login with Fingerprint';

  const {success} = await rnBiometrics.simplePrompt({promptMessage});
  if (success) {
    const credsString = await AsyncStorage.getItem(CREDENTIALS_KEY);
    return credsString ? JSON.parse(credsString) : null;
  }
  return null;
}

export async function clearCredentials() {
  await AsyncStorage.removeItem(CREDENTIALS_KEY);
  await AsyncStorage.removeItem(HAS_LAUNCHED_KEY);
}
