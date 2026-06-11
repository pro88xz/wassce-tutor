import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.wasscetutor.app',
  appName: 'WASSCE Tutor',
  webDir: 'dist',
  backgroundColor: '#fafbff',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#fafbff',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#fafbff',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'native',
    },
  },
}

export default config
