import type { CapacitorConfig } from "@capacitor/cli";

const serverUrl = process.env.CAPACITOR_SERVER_URL || "http://10.0.2.2:3000";

const config: CapacitorConfig = {
  appId: "com.rentalmanager.app",
  appName: "Rental Manager",
  webDir: "public",
  server: {
    url: serverUrl,
    cleartext: true,
    androidScheme: "https",
  },
  android: {
    allowMixedContent: true,
    backgroundColor: "#1565C0",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1565C0",
      showSpinner: false,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#1565C0",
    },
  },
};

export default config;
