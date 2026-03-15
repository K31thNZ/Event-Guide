import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";

import Colors from "@/constants/colors";
import { ALL_TAGS, EventTag, useEvents } from "@/contexts/EventsContext";

const TAG_ICONS: Record<EventTag, keyof typeof Ionicons.glyphMap> = {
  Free: "pricetag",
  "Date Night": "heart",
  "Solo Friendly": "person",
  "Late Night": "moon",
  Family: "people",
  Networking: "briefcase",
};

export function FilterTags() {
  const { activeTags, toggleTag } = useEvents();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scroll}
    >
      {ALL_TAGS.map((tag) => {
        const isActive = activeTags.includes(tag);
        const tagStyle = Colors.tags[tag];
        return (
          <TouchableOpacity
            key={tag}
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              toggleTag(tag);
            }}
            style={[
              styles.tag,
              {
                backgroundColor: isActive ? tagStyle.bg : "rgba(255,255,255,0.95)",
                borderColor: isActive ? tagStyle.text : "rgba(0,0,0,0.1)",
              },
            ]}
            activeOpacity={0.75}
          >
            <Ionicons
              name={TAG_ICONS[tag]}
              size={13}
              color={isActive ? tagStyle.text : "#8E8E93"}
              style={styles.icon}
            />
            <Text
              style={[
                styles.tagText,
                { color: isActive ? tagStyle.text : "#8E8E93" },
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: "row",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 5,
  },
  icon: {},
  tagText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.1,
  },
});
