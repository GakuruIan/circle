import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

type AllowedTypes = "livePhotos" | "images" | "videos";

export async function PickMediaFromLibrary(
  mediaTypes: AllowedTypes[],
  options: { maxSizeMB: number; maxSizeBytes: number } = {
    maxSizeMB: 10,
    maxSizeBytes: 10 * 1024 * 1024,
  }
): Promise<string> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Permission to access media library was denied.");
  }

  // Map to ImagePicker.MediaType strings
  const pickerMediaTypes: ("images" | "videos")[] = [];

  if (mediaTypes.includes("images") || mediaTypes.includes("livePhotos")) {
    pickerMediaTypes.push("images");
  }

  if (mediaTypes.includes("videos")) {
    pickerMediaTypes.push("videos");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: pickerMediaTypes,
    allowsEditing: true,
    aspect: [14, 16],
    quality: 1,
    selectionLimit: 1,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    throw new Error("No media selected.");
  }

  const uri = result.assets[0].uri;

  const fileInfo = await FileSystem.getInfoAsync(uri);

  if (fileInfo.exists) {
    if (fileInfo.size && fileInfo.size > options.maxSizeBytes) {
      throw new Error(`File size exceeds ${options.maxSizeMB}MB`);
    }
  }

  return uri;
}
