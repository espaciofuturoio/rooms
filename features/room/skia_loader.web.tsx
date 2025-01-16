import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { LoadingAnimation } from "@/components/base/LoadingAnimation";

export const SkiaCanvasRoomLoader = () => (
  <WithSkiaWeb
    getComponent={() => import("./canvas")}
    fallback={<LoadingAnimation />}
  />
);

