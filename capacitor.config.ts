import type { CapacitorConfig } from '@capacitor/cli';
import { Style } from '@capacitor/status-bar';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Tasky',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchFadeOutDuration: 0,   // to view the splash screen immediately
      launchAutoHide: false,
      // androidScaleType: 'FIT_XY',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: Style.Dark,
      overlaysWebView: true,
      // backgroundColor: '#5f33e1',
    }
  }
};

export default config;
