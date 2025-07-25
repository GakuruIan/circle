import React, { useState, useEffect } from "react";
import { Alert, Dimensions, Text, TouchableOpacity, View } from "react-native";

import {
  FirebaseAuthTypes,
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
} from "@react-native-firebase/auth";

// form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// components
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import Verification from "@/components/Verification/verification";

// country picker
import { CountryPicker } from "react-native-country-codes-picker";

// theming
import { useColorScheme } from "nativewind";

const phoneNumberSchema = z.object({
  phonenumber: z
    .string()
    .trim()
    .min(8, "Phone number too short")
    .max(15, "Phone number too long")
    .regex(/^\+?[0-9]{8,15}$/, "Invalid phone number format")
    .refine((val) => !/(.)\1{5,}/.test(val), {
      message: "Phone number appears to be fake",
    }),
});

type PhonenumberFormData = z.infer<typeof phoneNumberSchema>;

const Signup = () => {
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("");

  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const { height } = Dimensions.get("screen");

  const handleAuthStateChanged = (user: any) => {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
    }
  };

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber;
  }, []);

  const onSubmit = async (values: PhonenumberFormData) => {
    if (!countryCode) {
      Alert.alert("Missing value", "Please select the country code");
      return;
    }

    try {
      let { phonenumber } = values;
      if (phonenumber.startsWith("0")) {
        phonenumber = phonenumber.slice(1);
      }
      const fullPhoneNumber = `${countryCode}${phonenumber}`;

      //  firebase auth
      const confirmation = await signInWithPhoneNumber(
        getAuth(),
        fullPhoneNumber
      );

      setConfirm(confirmation);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An occurred during submission");
    }
  };

  const backgroundColor = isDark ? "#0d0d0d" : "#fff";
  const lightBackgroundColor = isDark ? "#1a1a1a" : "#F8FAFC";
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<PhonenumberFormData>({
    resolver: zodResolver(phoneNumberSchema),
    mode: "onChange",
  });

  if (confirm) {
    return <Verification confirm={confirm} />;
  }

  return (
    <View className="flex-1 bg-white dark:bg-dark-300 px-4">
      <View className="mt-4 mb-4">
        <Text className="text-3xl font-poppins_regular font-semibold tracking-wide dark:text-white mb-2">
          Get Started with Your Number
        </Text>
        <Text className="font-poppins_regular text-base text-gray-500 dark:text-gray-500">
          We’ll send a quick verification code to keep your account safe.
        </Text>
      </View>
      <View className="flex-row gap-x-3 w-full mt-2 mb-2 pr-2 ">
        <TouchableOpacity
          className="bg-light-100 dark:bg-dark-200 flex items-center justify-center p-4 rounded-md h-14 w-24"
          onPress={() => setShow(true)}
        >
          <Text className="text-base dark:text-white font-poppins_regular ">
            {countryCode ? countryCode : "Country Code"}
          </Text>
        </TouchableOpacity>

        <Input
          control={control}
          placeholder="72274321"
          name="phonenumber"
          className="w-full"
        />
      </View>

      <Button
        label="Continue"
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
        className="w-full"
        variant="primary"
      />

      <CountryPicker
        show={show}
        lang="en"
        pickerButtonOnPress={(item) => {
          setCountryCode(item.dial_code);
          setShow(false);
        }}
        onBackdropPress={() => setShow(false)}
        style={{
          modal: {
            height: height * 0.5,
            backgroundColor: backgroundColor,
          },
          textInput: {
            backgroundColor: lightBackgroundColor,
            color: isDark ? "#fff" : "#222",
          },
          searchMessageText: {
            color: isDark ? "#fff" : "#222",
          },
          line: {
            backgroundColor: lightBackgroundColor,
          },
          countryButtonStyles: {
            backgroundColor: "transparent",
          },
          dialCode: {
            color: isDark ? "#fff" : "#222",
          },
          countryName: {
            color: isDark ? "#fff" : "#222",
          },
        }}
      />
    </View>
  );
};

export default Signup;
