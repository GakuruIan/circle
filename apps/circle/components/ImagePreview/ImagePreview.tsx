import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

// icons
import { Check, Download, RotateCcw, Trash } from "lucide-react-native";

// component
import ThemeIcon from "../UI/ThemeIcon";

interface ImagePreviewProps {
  imageUrl: string;
  retake: () => void;
  save: () => void;
  discard: () => void;
  done: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  retake,
  save,
  discard,
  done,
}) => {
  if (!imageUrl) return;

  return (
    <View className="flex-1 relative">
      <Image
        source={{ uri: imageUrl }}
        style={{ flex: 1, aspectRatio: 1 }}
        resizeMode="contain"
      />

      <View className="flex-row items-center justify-between w-full absolute bottom-10 px-8">
        <TouchableOpacity
          onPress={retake}
          className="flex items-center justify-center border border-gray-500 dark:border-gray-400 rounded-full p-2.5"
        >
          <ThemeIcon
            icon={RotateCcw}
            darkColor="#fff"
            lightColor="#fff"
            size={20}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={save}
          className="flex items-center justify-center border border-gray-500 dark:border-gray-400 rounded-full p-2.5"
        >
          <ThemeIcon
            icon={Download}
            darkColor="#fff"
            lightColor="#fff"
            size={20}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={discard}
          className="flex items-center justify-center border border-gray-500 dark:border-gray-400 rounded-full p-2.5"
        >
          <ThemeIcon
            icon={Trash}
            darkColor="#fff"
            lightColor="#fff"
            size={20}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={done}
          className="flex items-center justify-center border border-gray-500 dark:border-gray-400 rounded-full p-2.5"
        >
          <ThemeIcon
            icon={Check}
            darkColor="#fff"
            lightColor="#fff"
            size={20}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ImagePreview;
