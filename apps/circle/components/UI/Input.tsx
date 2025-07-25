import React, { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

// react hook form
import { Control, Controller } from "react-hook-form";

// icons
import { Eye, EyeClosed } from "lucide-react-native";

// components
import ThemeIcon from "./ThemeIcon";

// theme
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";

interface inputprops extends TextInputProps {
  name: string;
  control: Control<any>;
  placeholder: string;
}

const Input: React.FC<inputprops> = ({
  placeholder,
  control,
  name,
  ...textInputProps
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === "dark";
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View className="mb-4 w-full">
          <View className="relative w-full bg-light-100 dark:bg-dark-100 px-4 py-1 rounded-md mb-1.5">
            <TextInput
              numberOfLines={1}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              className="w-full  text-gray-900 dark:text-gray-300"
              placeholderTextColor={
                isDark ? Colors.dark_gray : Colors.light_gray
              }
              // style={{ color: isDark ? Colors.dark_gray : Colors.light_gray }}
              autoCapitalize="none"
              placeholder={placeholder}
              secureTextEntry={isPasswordVisible}
              {...textInputProps}
            />
            {(name === "password" || name === "confirmPassword") && (
              <Pressable
                className="absolute flex items-center inset-y-3.5 end-3 ps-3.5"
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <ThemeIcon icon={Eye} />
                ) : (
                  <ThemeIcon icon={EyeClosed} />
                )}
              </Pressable>
            )}
          </View>
          {error && (
            <Text className="text-rose-500  text-sm tracking-wide">
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
};

export default Input;
