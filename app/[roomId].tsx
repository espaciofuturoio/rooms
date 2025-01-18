import { SkiaCanvasRoomLoader } from "@/features/room/skia_loader";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RoomPage() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  console.log("roomId", roomId);
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
