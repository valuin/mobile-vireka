import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cn } from '~/lib/utils';

interface TextProps extends RNTextProps {
  variant?: 'default' | 'heading' | 'subheading' | 'body' | 'caption' | 'button';
  weight?: 'extralight' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
}

const Text: React.FC<TextProps> = ({
  className,
  variant = '',
  weight = 'regular',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'heading':
        return 'text-2xl font-manrope-bold text-gray-900';
      case 'subheading':
        return 'text-lg font-manrope-semibold text-gray-800';
      case 'body':
        return 'text-base font-manrope-regular text-gray-700';
      case 'caption':
        return 'text-sm font-manrope-regular text-gray-600';
      case 'button':
        return 'text-sm font-manrope-medium text-white';
      default:
        return 'font-manrope-regular text-gray-900';
    }
  };

  const getWeightClass = () => {
    return `font-manrope-${weight}`;
  };

  return (
    <RNText
      className={cn(getVariantStyles(), weight !== 'regular' && getWeightClass(), className)}
      {...props}
    />
  );
};

export default Text;
