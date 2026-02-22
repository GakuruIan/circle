import React, { useMemo, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";
import { useLabelMutations } from "@/hooks/mutations/useLabelMutations";

// form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

interface CreateLabelSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
  onClose: () => void;
}

const labelSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name must be at most 20 characters long"),
});

type LabelFormData = z.infer<typeof labelSchema>;

const CreateLabelSheet = ({ sheetRef, onClose }: CreateLabelSheetProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const { createLabel } = useLabelMutations();

  const snapPoints = useMemo(() => ["60%"], []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<LabelFormData>({
    resolver: zodResolver(labelSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: LabelFormData) => {
    try {
      await createLabel.mutateAsync(values.name.trim());
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create label:", error);
    }
  };

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      index={-1}
      enablePanDownToClose={true}
      onClose={() => {
        reset();
        onClose();
      }}
      backgroundStyle={{
        backgroundColor: isDark ? "#141618" : "#F3F6FE",
      }}
      handleIndicatorStyle={{
        backgroundColor: isDark ? "#171a1c" : "#CCC",
      }}
    >
      <BottomSheetView className="flex-1 p-6 bg-light-200 dark:bg-dark-200">
        <Text className="text-xl font-bold dark:text-white mb-8 text-center tracking-tight">
          New Label
        </Text>

        <View className="mb-8">
          <Text className="text-sm tracking-wide font-semibold text-gray-600 dark:text-gray-400 mb-3 ml-1 uppercase">
            Label Name
          </Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter label name (e.g., Work, Family)"
                placeholderTextColor={isDark ? "#555" : "#999"}
                className={`bg-gray-300/30 dark:bg-dark-100 p-4 rounded-2xl dark:text-white text-lg border-2 ${
                  errors.name
                    ? "border-red-500"
                    : value.length > 0
                      ? "border-primary"
                      : "border-transparent"
                }`}
                autoFocus
              />
            )}
          />
          {errors.name && (
            <Text className="text-red-500 text-sm mt-2 ml-1">
              {errors.name.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid || createLabel.isPending}
          className={`py-4 rounded-2xl items-center flex-row justify-center shadow-sm ${
            !isValid || createLabel.isPending ? "bg-[#0F9445]" : "bg-primary"
          }`}
        >
          {createLabel.isPending ? (
            <ActivityIndicator color="#fff" size="small" className="mr-2" />
          ) : null}
          <Text className="text-white font-bold text-lg tracking-wide">
            {createLabel.isPending ? "Creating..." : "Create Label"}
          </Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default CreateLabelSheet;
