import localFont from 'next/font/local';

export const Roboto = localFont({
  src: [
    {
      path: '../fonts/Roboto/Roboto-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Roboto/Roboto-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/Roboto/Roboto-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/Roboto/Roboto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/Roboto/Roboto-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../fonts/Roboto/Roboto-Black.woff2',
      weight: '900',
      style: 'normal',
    }
  ],
  variable: '--font-head',
  display: 'swap',
});

export const Inter = localFont({
  src: [
    {
      path: '../fonts/Inter/Inter-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../fonts/Inter/Inter-ExtraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../fonts/Inter/Inter-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/Inter/Inter-Medium.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Inter/Inter-Regular.woff2',
      weight: '500',
      style: 'normal',
    }
    ,
    {
      path: '../fonts/Inter/Inter-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    }
  ],
  variable: '--font-body',
  display: 'swap',
});