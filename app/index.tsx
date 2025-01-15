import { SkiaCanvasRoomLoader } from "@/features/room/skia_loader";
import { SafeAreaView } from "react-native";

export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <SkiaCanvasRoomLoader />
    </SafeAreaView>
  );
}
