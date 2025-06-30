import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// image

// components
import Button from "@/components/UI/Button";

// OTP component
import { OtpInput } from "react-native-otp-entry";

//color scheme
import { useColorScheme } from "nativewind";

// router
import { useRouter } from "expo-router";

// firebase authentication
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

type VerificationProps = {
  confirm: FirebaseAuthTypes.ConfirmationResult;
};

const Verification = ({ confirm }: VerificationProps) => {
  const { colorScheme } = useColorScheme();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const styles = StyleSheet.create({
    pinCode: {
      color: colorScheme === "dark" ? "#fff" : "#000",
    },
  });

  const handleVerification = async () => {
    try {
      setLoading(true);
      await confirm.confirm(code);

      router.replace("/(auth)/setup");
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-dark-300 px-4">
      <View className="mt-4">
        <View className="items-start justify-center">
          <Text className="dark:text-white font-poppins_regular font-medium mb-1 text-2xl">
            Confirm your number
          </Text>
          <Text className="text-gray-400 dark:text-gray-500 text-base font-quicksand mb-3">
            Enter the code we sent to finish setting up your account.
          </Text>

          <View className="mb-6 mt-3">
            <OtpInput
              numberOfDigits={6}
              onTextChange={(text) => setCode(text)}
              theme={{
                pinCodeTextStyle: styles.pinCode,
              }}
            />
          </View>

          <Button
            label="Verify code"
            variant="primary"
            className="w-full mb-6"
            onPress={handleVerification}
            loading={loading}
            loadingText="Verifying..."
          />

          <View className="mb-4 flex-row gap-x-3 items-center justify-center w-full">
            <Text className="font-quicksand  text-gray-500 flex items-center gap-x-2">
              Haven&apos;t recieved code yet?{" "}
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-primary text-base font-poppins_regular">
                {" "}
                Resend
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Verification;
