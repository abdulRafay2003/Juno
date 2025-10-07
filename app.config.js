module.exports = {
  name: 'Juno',
  displayName: 'Juno',
  scheme: 'Juno', // Add custom URL scheme for deep linking
  android: {
    package: 'com.beyond.broker',
    intentFilters: [
      {
        action: 'android.intent.action.VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: 'beyond-beta.demoz.agency',
          },
        ],
        category: [
          'android.intent.category.DEFAULT',
          'android.intent.category.BROWSABLE',
        ],
      },
      // Add custom scheme intent filter for direct deep linking
      {
        action: 'android.intent.action.VIEW',
        autoVerify: false,
        data: [
          {
            scheme: 'Juno',
          },
        ],
        category: [
          'android.intent.category.DEFAULT',
          'android.intent.category.BROWSABLE',
        ],
      },
    ],
  },
  ios: {
    bundleIdentifier: 'com.beyond.broker',
    associatedDomains: ['applinks:beyond-beta.demoz.agency'],
  },
  plugins: [
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 34,
          targetSdkVersion: 34,
          buildToolsVersion: '34.0.0',
        },
      },
    ],
  ],
};
