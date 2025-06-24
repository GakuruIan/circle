import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

//color scheme
import { useColorScheme } from "nativewind";

import {
  CircleX,
  Folder,
  MoveLeft,
  SwitchCamera,
  Zap,
  ZapOff,
} from "lucide-react-native";

// components
import ImagePreview from "@/components/ImagePreview/ImagePreview";

import ThemeIcon from "@/components/UI/ThemeIcon";

// expo
import {
  Camera,
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
} from "expo-camera";

// bottom sheet
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

// expo media library
import * as MediaLibrary from "expo-media-library";

// util function
import { PickMediaFromLibrary } from "@/utils/FilePicker";

// router
import { router } from "expo-router";

const StatusCameraForm = () => {
  const cameraRef = useRef<CameraView | null>(null);

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const backgroundColor = isDark ? "#141414" : "#F2F3F5";

  // bottomsheet
  const snapPoints = useMemo(() => ["30%", "50%"], []);
  const sheetRef = useRef<BottomSheet>(null);

  // camera permissions
  const [hasPermission, setHasPermission] = useCameraPermissions();

  // bottomsheet state
  const [sheetIndex, setSheetIndex] = useState(-1);

  // camera type state
  const [facing, setFacing] = useState<CameraType>("back");
  // camera flash state
  const [flash, setFlash] = useState<FlashMode>("off");
  // camera capture state
  const [isRecording, setIsRecording] = useState(false);
  // image preview state
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [mediaType, setMediaType] = useState<"photo" | "video" | null>(null);

  // getting latest media
  const [latestAsset, setLatestAsset] = useState<MediaLibrary.Asset | null>(
    null
  );

  // record progress
  const [recordProgress, setRecordProgress] = useState(0);

  const longPressTimer = useRef<number | null>(null);

  useEffect(() => {
    // !! fix by having the request to all permissions in a promise
    const FetchLatestAsset = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your media library."
        );
        return;
      }

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: ["photo", "video"],
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        first: 1,
      });

      if (media.totalCount > 0) {
        setLatestAsset(media.assets[0]);
      }
    };

    FetchLatestAsset();

    return () => {
      if (longPressTimer.current) {
        clearInterval(longPressTimer.current);
      }

      if (isRecording && cameraRef.current) {
        cameraRef.current.stopRecording();
      }
    };
  }, [isRecording]);

  // media library permissions
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();

  // switching camera
  const toggleCamera = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // toggle camera flashlight
  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  // allow camera access
  const handleCameraAccess = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    sheetRef.current?.snapToIndex(-1);
  };

  // saving the photo
  const savePhotoToDevice = async () => {
    if (!capturedMedia) return;

    try {
      if (mediaLibraryPermission?.status !== "granted") {
        const permission = await requestMediaLibraryPermission();
        if (permission.status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Please grant media library access to save photos."
          );
          return;
        }
      }

      // saving the image
      const asset = await MediaLibrary.saveToLibraryAsync(capturedMedia);

      Alert.alert("Success", "Photo saved to your gallery!");
      setShowPreview(true);
    } catch (error) {}
  };

  // move to the next step
  const acceptImage = () => {};

  // retake photo
  const retakePhoto = () => {
    setCapturedMedia(null);
    setShowPreview(false);
  };

  // handling capture
  const handleCapture = async () => {
    if (!cameraRef.current || isRecording) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });
      setCapturedMedia(photo.uri);
      setShowPreview(true);
      setMediaType("photo");
      // console.log("Photo URI:", photo.uri);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRecording = async () => {
    if (!cameraRef.current || isRecording) return;

    let progress = 0;

    longPressTimer.current = setInterval(() => {
      progress += 1;
      setRecordProgress(progress / 30 / 100);
    }, 1000);

    try {
      setIsRecording(true);
      setRecordProgress(0);

      const video = await cameraRef.current.recordAsync({
        maxDuration: 30,
      });

      setCapturedMedia(video?.uri);
      setMediaType("video");
      setShowPreview(true);
      setIsRecording(false);
    } catch (error) {
      console.log(error);
      setIsRecording(false);
      Alert.alert("Error", "Failed to record video. Please try again.");
    } finally {
      setIsRecording(false);
      clearInterval(longPressTimer.current!);
      setRecordProgress(0);
    }
  };

  // handle stop recording
  const handleStopRecording = async () => {
    if (!cameraRef.current || !isRecording) return;

    try {
      cameraRef.current.stopRecording();
    } catch (error) {
      console.log("Error stopping recording:", error);
      setIsRecording(false);
    }
  };

  if (!hasPermission?.granted) {
    sheetRef.current?.snapToIndex(0);
  }

  const handleFilePick = async () => {
    try {
      const uri = await PickMediaFromLibrary(["videos", "images"]);
      console.log("Picked file URI:", uri);
    } catch (error) {
      console.log("Error:", error?.message);
    }
  };

  return (
    <View className=" relative flex-1 px-0 bg-white dark:bg-dark-300">
      {/* camera action button */}
      {!showPreview && (
        <View className="flex-1 w-full">
          <View className="flex-row items-center justify-between absolute top-10 z-10 w-full mt-4 px-4">
            <TouchableOpacity className="" onPress={() => router.back()}>
              <ThemeIcon
                icon={MoveLeft}
                size={28}
                darkColor="#fff"
                lightColor="#fff"
              />
            </TouchableOpacity>

            <View className="flex flex-row gap-x-14 items-center">
              <TouchableOpacity className="" onPress={toggleFlash}>
                <ThemeIcon
                  icon={flash === "off" ? ZapOff : Zap}
                  size={25}
                  darkColor="#fff"
                  lightColor="#fff"
                />
              </TouchableOpacity>

              <TouchableOpacity className="" onPress={toggleCamera}>
                <ThemeIcon
                  icon={SwitchCamera}
                  size={25}
                  darkColor="#fff"
                  lightColor="#fff"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="flex flex-row items-center">
              <ThemeIcon
                icon={CircleX}
                size={25}
                darkColor="#fff"
                lightColor="#fff"
              />
            </TouchableOpacity>
          </View>

          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            facing={facing}
            flash={flash}
          />

          <View className="absolute bottom-18 left-0 right-0 px-4 w-full">
            <View className="flex-row justify-between items-center w-full">
              {/* file picker */}
              <TouchableOpacity onPress={handleFilePick}>
                <View className="size-14 object-cover rounded-md">
                  {latestAsset ? (
                    <Image
                      source={{ uri: latestAsset?.uri }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 8,
                        borderWidth: 2,
                        borderColor: "#fff",
                      }}
                    />
                  ) : (
                    <ThemeIcon icon={Folder} darkColor="#fff" />
                  )}
                </View>
              </TouchableOpacity>
              {/* file picker */}
              <TouchableOpacity
                className="border border-white rounded-full p-0 flex items-center justify-center size-18"
                onPress={handleCapture}
                onLongPress={handleRecording}
                onPressOut={handleStopRecording}
              >
                <View className="bg-rose-600 rounded-full size-20" />
              </TouchableOpacity>

              <View />
            </View>
          </View>
        </View>
      )}

      {showPreview && capturedMedia && (
        <ImagePreview
          imageUrl={capturedMedia}
          retake={retakePhoto}
          save={savePhotoToDevice}
          done={acceptImage}
          discard={retakePhoto}
        />
      )}

      {/* bottom sheet to allow permissions */}
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        index={sheetIndex}
        onChange={(index) => setSheetIndex(index)}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: backgroundColor }}
        handleIndicatorStyle={{
          backgroundColor: isDark ? "#F2F3F5" : "#141414",
        }}
      >
        <BottomSheetView className="flex-1 p-4">
          <Text className="text-center dark:text-white text-xl font-semibold font-poppins tracking-wide mb-4">
            Permissions
          </Text>

          <TouchableOpacity
            onPress={handleCameraAccess}
            className="w-full py-2 px-2"
          >
            <Text className="dark:text-white font-poppins_light ">
              Allow Camera access
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default StatusCameraForm;
