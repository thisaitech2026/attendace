const appJson = require('./app.json');

/** @type {import('expo/config').ExpoConfig} */
module.exports = ({ config }) => {
  const origin = process.env.EXPO_ROUTER_ORIGIN || process.env.EXPO_PUBLIC_SITE_URL;

  return {
    ...appJson.expo,
    ...config,
    extra: {
      ...appJson.expo.extra,
      ...config?.extra,
      router: {
        ...appJson.expo.extra?.router,
        ...config?.extra?.router,
        ...(origin
          ? {
              origin,
              headOrigin: process.env.EXPO_ROUTER_HEAD_ORIGIN || origin,
            }
          : {}),
      },
    },
  };
};
