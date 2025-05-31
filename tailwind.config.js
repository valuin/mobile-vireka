/** @type {import('tailwindcss').Config} */
import { platformSelect } from 'nativewind/theme';

module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'manrope-extralight': platformSelect({
          android: 'Manrope_200ExtraLight',
          ios: 'Manrope-ExtraLight',
        }),
        'manrope-light': platformSelect({
          android: 'Manrope_300Light',
          ios: 'Manrope-Light',
        }),
        'manrope-regular': platformSelect({
          android: 'Manrope_400Regular',
          ios: 'Manrope-Regular',
        }),
        'manrope-medium': platformSelect({
          android: 'Manrope_500Medium',
          ios: 'Manrope-Medium',
        }),
        'manrope-semibold': platformSelect({
          android: 'Manrope_600SemiBold',
          ios: 'Manrope-SemiBold',
        }),
        'manrope-bold': platformSelect({
          android: 'Manrope_700Bold',
          ios: 'Manrope-Bold',
        }),
        'manrope-extrabold': platformSelect({
          android: 'Manrope_800ExtraBold',
          ios: 'Manrope-ExtraBold',
        }),
        system: platformSelect({
          ios: 'Manrope',
          android: 'sans-serif',
          default: 'ui-sans-serif',
        }),
      },
    },
  },
  plugins: [],
};
