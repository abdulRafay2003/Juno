# Deep Linking Setup for Android 12+ Devices

## Overview
This guide explains the fixes implemented to resolve deep linking issues on Android 12+ devices.

## Changes Made

### 1. Android Manifest Updates
- Added separate intent filters for HTTPS and custom scheme
- Set `android:autoVerify="true"` for HTTPS links
- Set `android:autoVerify="false"` for custom scheme links
- Ensured `android:exported="true"` is set

### 2. Build Configuration
- Reduced target SDK from 35 to 34 for better compatibility
- Updated build tools version to 34.0.0

### 3. App Configuration
- Created `app.config.js` with proper deep linking configuration
- Added multiple URL schemes support

### 4. Navigation Updates
- Enhanced deep linking handling in MainStack
- Added Android 12+ specific deep link checks
- Improved URL parsing and navigation logic

## Testing Deep Linking

### 1. Clean Build
```bash
# Clean Android build
yarn clean:android

# Rebuild the app
yarn build:android
```

### 2. Test Deep Links
```bash
# Test HTTPS deep link
adb shell am start -W -a android.intent.action.VIEW -d 'https://beyond-beta.demoz.agency/forgot-password/reset-password?token=test123' com.beyond.broker

# Test custom scheme deep link
adb shell am start -W -a android.intent.action.VIEW -d 'beyond-beta.demoz.agency://forgot-password/reset-password?token=test123' com.beyond.broker
```

### 3. Manual Testing
1. Install the app on an Android 12+ device
2. Open a browser and navigate to: `https://beyond-beta.demoz.agency/forgot-password/reset-password?token=test123`
3. The app should open and navigate to the SetPassword screen

## Important Notes

### Android 12+ Requirements
- HTTPS links require `android:autoVerify="true"`
- Custom schemes require `android:autoVerify="false"`
- All intent filters must have `android:exported="true"`

### Digital Asset Links
- For production, you need to host the `assetlinks.json` file at `https://beyond-beta.demoz.agency/.well-known/assetlinks.json`
- Replace `YOUR_SHA256_FINGERPRINT_HERE` with your actual SHA256 certificate fingerprint

### Getting SHA256 Fingerprint
```bash
# For debug builds
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# For release builds
keytool -list -v -keystore your-release-keystore.jks -alias your-key-alias
```

## Troubleshooting

### Common Issues
1. **App not opening**: Check if the package name matches exactly
2. **Navigation not working**: Ensure the app is fully loaded before testing
3. **HTTPS verification failing**: Verify the assetlinks.json file is accessible

### Debug Steps
1. Check logcat for deep linking events
2. Verify intent filters in AndroidManifest.xml
3. Test with both HTTPS and custom scheme URLs
4. Ensure the app is not in the background when testing

## Production Deployment

1. Update the `assetlinks.json` file with your production certificate fingerprint
2. Host the file at `https://beyond-beta.demoz.agency/.well-known/assetlinks.json`
3. Test on multiple Android 12+ devices
4. Verify both HTTPS and custom scheme deep links work correctly
