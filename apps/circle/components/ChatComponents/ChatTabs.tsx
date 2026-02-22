import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  View,
  useWindowDimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { Plus } from "lucide-react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";

// components
import ChatTabScene from "./ChatTabScene";
import CreateLabelSheet from "./CreateLabelSheet";

// hooks
import { useFetchLabels } from "@/hooks/queries/useFetchLabels";

const ChatTabs = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const sheetRef = useRef<BottomSheet>(null);

  const { data: labels, isLoading } = useFetchLabels();

  const categories = useMemo(() => {
    const base = ["all"];
    if (labels) {
      return [...base, ...labels.map((l: any) => l.name)];
    }
    return base;
  }, [labels]);

  const routes = useMemo(
    () =>
      categories.map((key) => ({
        key,
        title: key.charAt(0).toUpperCase() + key.slice(1),
      })),
    [categories],
  );

  const renderScene = useMemo(() => {
    const scenes: Record<string, () => JSX.Element> = {};
    categories.forEach((category) => {
      scenes[category] = () => <ChatTabScene category={category} />;
    });
    return SceneMap(scenes);
  }, [categories]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-dark-300">
        <ActivityIndicator size="large" color="#25D366" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-dark-300 px-2">
      <TabView
        lazy
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderLazyPlaceholder={() => (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#25D366" />
          </View>
        )}
        renderTabBar={(props) => (
          <View className="flex-row items-center">
            <TabBar
              {...props}
              indicatorStyle={{ height: 0, display: "none" }}
              contentContainerStyle={{
                paddingLeft: 8,
                paddingRight: 8,
              }}
              style={{
                borderBottomWidth: 0,
                elevation: 0,
                shadowOpacity: 0,
                backgroundColor: "transparent",
                marginBottom: 12,
                flex: 1,
              }}
              scrollEnabled={true}
              tabStyle={{
                borderRadius: 20,
                marginHorizontal: 3,
                paddingVertical: 4,
                paddingHorizontal: 12,
                width: "auto",
                minWidth: 80,
              }}
              renderTabBarItem={(props) => {
                const { key, route, navigationState, style, ...rest } = props;
                const focused =
                  props.navigationState.index ===
                  props.navigationState.routes.indexOf(route);
                const borderColor = "#25D366";
                return (
                  <TouchableOpacity
                    key={key}
                    {...rest}
                    style={[
                      props.style,
                      {
                        borderWidth: 1,
                        borderColor: focused
                          ? borderColor
                          : isDark
                            ? "#222"
                            : "#EEE",
                        borderRadius: 25,
                        backgroundColor: focused
                          ? `${borderColor}15`
                          : "transparent",
                        paddingHorizontal: 8,
                        paddingVertical: 5,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: focused ? borderColor : isDark ? "#888" : "#666",
                        fontWeight: focused ? "700" : "500",
                        fontSize: 14,
                        textAlign: "center",
                        letterSpacing: 0.5,
                      }}
                    >
                      {route.title}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              onPress={() => sheetRef.current?.snapToIndex(0)}
              className="bg-gray-100 dark:bg-dark-100 p-2 rounded-full mb-3 mr-2"
            >
              <Plus size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}
      />

      <CreateLabelSheet
        sheetRef={sheetRef}
        onClose={() => sheetRef.current?.close()}
      />
    </View>
  );
};

export default ChatTabs;
