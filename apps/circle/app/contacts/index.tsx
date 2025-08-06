import React, { useEffect, useState } from "react";

import { Contacts, User } from "@circle/prisma";

type ContactList = Pick<Contacts, "displayName" | "phonenumber" | "userId"> &
  Pick<User, "about" | "profileImage" | "name">;

import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// safe area
import { useSafeAreaInsets } from "react-native-safe-area-context";

// components
import Avatar from "@/components/UI/Avatar";
import ThemeIcon from "@/components/UI/ThemeIcon";

// icons
import { MoreVertical, MoveLeft } from "lucide-react-native";

// expo router
import { useRouter } from "expo-router";

import * as ExpoContacts from "expo-contacts";

import { useSyncContacts } from "@/hooks/mutations/useSyncContacts";

const ContactList = () => {
  const topPadding = useSafeAreaInsets().top;
  const bottomPadding = useSafeAreaInsets().bottom;

  const { height } = Dimensions.get("screen");

  const router = useRouter();

  const useSyncMutation = useSyncContacts();

  const [contacts, setContacts] = useState<ContactList[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactList[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await ExpoContacts.requestPermissionsAsync();

      if (status === "granted") {
        const { data } = await ExpoContacts.getContactsAsync({
          fields: [
            ExpoContacts.Fields.FirstName,
            ExpoContacts.Fields.PhoneNumbers,
          ],
        });

        const validContacts = data
          .filter((c) => c.name && c.phoneNumbers?.length)
          .map((c) => {
            const primary = c.phoneNumbers?.find((p) => p.isPrimary);

            // If none marked as primary, fallback to first available
            const chosenNumber =
              primary?.number ||
              (c.phoneNumbers && c.phoneNumbers[0]?.number) ||
              "";

            return {
              displayName: c.name,
              phonenumber: chosenNumber,
            };
          })
          .filter((c) => c.phonenumber)
          .sort((a, b) =>
            a.displayName.localeCompare(b.displayName, undefined, {
              sensitivity: "base",
            })
          );

        const formData = new FormData();

        formData.append("contacts", validContacts);
        try {
          const userContacts = await useSyncMutation.mutateAsync(formData);

          setContacts(userContacts);
          setFilteredContacts(userContacts);
        } catch (error) {
          console.error("Failed to sync contacts", error);
        }
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter((c) => {
      const query = searchQuery.toLowerCase();
      return c.displayName.toLowerCase().includes(query);
      // c.phoneNumbers?.some((p) => p?.number.includes(query))
    });
    setFilteredContacts(filtered);
  }, [searchQuery, contacts]);

  return (
    <View className="flex-1 bg-white dark:bg-dark-300 ">
      {/* header */}
      <View style={{ paddingTop: topPadding + 15 }}>
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => router.back()}>
                <ThemeIcon icon={MoveLeft} size={28} />
              </TouchableOpacity>
              <Text className="text-2xl font-poppins_bold dark:text-white ml-6">
                Contacts
              </Text>
            </View>

            <View>
              <TouchableOpacity>
                <ThemeIcon icon={MoreVertical} />
              </TouchableOpacity>
            </View>
          </View>
          <View className="w-full pb-4">
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Seach by name or number"
              className="dark:text-white placeholder:dark:text-gray-400 placeholder:text-gray-500 w-full py-3 px-2 rounded-md dark:bg-dark-200 bg-light-100"
            />
          </View>
        </View>
      </View>
      {/* header */}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#03BD49" />
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          contentContainerStyle={{
            paddingBottom: bottomPadding,
          }}
          keyExtractor={(item) => item.userId!}
          renderItem={({ item }) => (
            <View className="py-3 px-4 flex-row w-full items-center">
              <Avatar variant="md" />
              <View className="flex-1 ml-2">
                <Text className="font-poppins_regular dark:text-white text-base mb-0.5">
                  {item?.displayName}
                </Text>
                <Text className="text-sm text-gray-400 dark:text-gray-500">
                  {item.about}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                height: height * 0.7,
              }}
            >
              <Text className="text-gray-500 dark:text-gray-400 font-poppins_regular text-xl tracking-tight">
                No contacts found.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default ContactList;
