import React from 'react';
import { Text } from 'react-native';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

export const SkiaCanvasRoomLoader = () => (
  <WithSkiaWeb
    getComponent={() => import('./canvas')}
    fallback={<Text>Loading Skia...</Text>}
  />
);

