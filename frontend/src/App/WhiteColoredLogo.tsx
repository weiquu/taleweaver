import { chakra, forwardRef, ImageProps } from '@chakra-ui/react';
import * as React from 'react';

import logo from '/src/images/taleweaver_logo_color_light.svg';

interface WhiteColoredLogoProps extends ImageProps {
  width?: string; // Allow custom width via props
}

export const WhiteColoredLogo = forwardRef<WhiteColoredLogoProps, 'img'>(
  ({ width = '160px', ...props }, ref) => {
    return <chakra.img src={logo} ref={ref} width={width} {...props} />;
  },
);
