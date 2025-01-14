import { SkiaCanvasRoomLoader } from "@/features/room/skia_loader";
import { View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SkiaCanvasRoomLoader />
    </View>
  );
}
