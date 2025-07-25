import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  View,
  useWindowDimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
// components
import ChatTabScene from "./ChatTabScene";

const categories = ["all", "group", "family", "work", "personal"];

const ChatTabs = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const routes = useMemo(
    () =>
      categories.map((key) => ({
        key,
        title: key.charAt(0).toUpperCase() + key.slice(1),
      })),
    []
  );

  const renderScene = useMemo(() => {
    const scenes: Record<string, () => JSX.Element> = {};
    categories.forEach((category) => {
      scenes[category] = () => <ChatTabScene category={category} />;
    });
    return SceneMap(scenes);
  }, []);

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
          <TabBar
            {...props}
            indicatorStyle={{ height: 0, display: "none" }}
            contentContainerStyle={{
              paddingLeft: 8,
              paddingRight: 30, // ✅ enough space to scroll last item
            }}
            style={{
              borderBottomWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
              backgroundColor: "transparent",
              marginBottom: 12,
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
                      borderColor: focused ? borderColor : "transparent",
                      borderRadius: 20,
                      backgroundColor: focused
                        ? `${borderColor}10`
                        : "transparent",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: focused ? borderColor : "#666",
                      fontWeight: focused ? "600" : "400",
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    {route.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
      />
    </View>
  );
};

export default ChatTabs;
