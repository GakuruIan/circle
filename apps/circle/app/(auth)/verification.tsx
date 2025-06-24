import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// router
import { Link } from "expo-router";

// image

// components
import Button from "@/components/UI/Button";

// OTP component
import { OtpInput } from "react-native-otp-entry";

//color scheme
import { useColorScheme } from "nativewind";

// clerk
// import { useSignUp } from "@clerk/clerk-expo";

const Verification = () => {
  // const { signUp, isLoaded, setActive } = useSignUp();
  const { colorScheme } = useColorScheme();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const styles = StyleSheet.create({
    pinCode: {
      color: colorScheme === "dark" ? "#fff" : "#000",
    },
  });

  // const handleVerification = async () => {
  //   if (!isLoaded) return;
  //   try {
  //     setLoading(true);
  //     const signUpAttempt = await signUp.attemptEmailAddressVerification({
  //       code,
  //     });

  //     if (signUpAttempt.status === "complete") {
  //       await setActive({ session: signUpAttempt.createdSessionId });

  //       router.replace("/(auth)/setup");
  //     } else {
  //       console.error(JSON.stringify(signUpAttempt, null, 2));
  //     }
  //   } catch (error) {
  //     console.error(JSON.stringify(error, null, 2));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
            // onPress={handleVerification}
            loading={loading}
            loadingText="Verifying..."
          />

          <View className="mb-4 items-center justify-center w-full">
            <Text className="font-quicksand text-gray-500 flex items-center gap-x-2">
              Haven&apos;t recieved code yet?{" "}
              <Link
                href="/"
                className="text-gray-400 dark:text-gray-500 text-base font-quicksand "
              >
                Resend
              </Link>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Verification;
