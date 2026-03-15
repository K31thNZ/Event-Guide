import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "@/constants/colors";
import { Event } from "@/contexts/EventsContext";

type Props = {
  event: Event;
  onPress: (event: Event) => void;
  isSelected: boolean;
};

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Social: "people",
  Arts: "color-palette",
  Outdoors: "leaf",
  Tech: "laptop",
  Music: "musical-notes",
  Business: "briefcase",
  Nightlife: "wine",
};

export function EventBubble({ event, onPress, isSelected }: Props) {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onPress(event);
  };

  const isFree = event.priceAmount === 0;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Animated.View
        style={[
          styles.bubble,
          isSelected && styles.bubbleSelected,
          { transform: [{ scale }] },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isSelected
                ? Colors.primary
                : "rgba(232, 51, 74, 0.12)",
            },
          ]}
        >
          <Ionicons
            name={CATEGORY_ICONS[event.category] ?? "calendar"}
            size={16}
            color={isSelected ? "#fff" : Colors.primary}
          />
        </View>
        {isFree && (
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>FREE</Text>
          </View>
        )}
      </Animated.View>
      <View style={styles.labelContainer}>
        <Text style={styles.label} numberOfLines={1}>
          {event.title.split(" ").slice(0, 2).join(" ")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: "transparent",
  },
  bubbleSelected: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  freeBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#2E7D32",
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  freeBadgeText: {
    color: "#fff",
    fontSize: 8,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  labelContainer: {
    marginTop: 4,
    width: 60,
    alignItems: "center",
  },
  label: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: "#1C1C1E",
    textAlign: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 4,
    paddingHorizontal: 3,
    paddingVertical: 1,
    overflow: "hidden",
  },
});
