import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "@/constants/colors";
import { Event, useEvents } from "@/contexts/EventsContext";

type Props = {
  event: Event;
  onPress?: (event: Event) => void;
  onAddToItinerary?: (event: Event) => void;
  showAddButton?: boolean;
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

export function EventCard({
  event,
  onPress,
  onAddToItinerary,
  showAddButton = true,
}: Props) {
  const { isInItinerary, addToItinerary, removeFromItinerary } = useEvents();
  const inItinerary = isInItinerary(event.id);

  const handleAddPress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(
        inItinerary
          ? Haptics.ImpactFeedbackStyle.Light
          : Haptics.ImpactFeedbackStyle.Medium
      );
    }
    if (inItinerary) {
      removeFromItinerary(event.id);
    } else {
      addToItinerary(event);
      onAddToItinerary?.(event);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(event)}
      activeOpacity={0.93}
    >
      <View style={[styles.categoryStripe, { backgroundColor: event.imageColor }]}>
        <Ionicons
          name={CATEGORY_ICONS[event.category] ?? "calendar"}
          size={22}
          color={Colors.primary}
        />
        {event.priceAmount === 0 && (
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>FREE</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>
              {event.title}
            </Text>
          </View>
          {showAddButton && (
            <TouchableOpacity
              style={[
                styles.addButton,
                inItinerary && styles.addButtonActive,
              ]}
              onPress={handleAddPress}
            >
              <Ionicons
                name={inItinerary ? "checkmark" : "add"}
                size={18}
                color={inItinerary ? "#fff" : Colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Ionicons name="location" size={13} color={Colors.primary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {event.venue}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="calendar" size={13} color="#8E8E93" />
            <Text style={styles.metaText}>
              {event.date} · {event.time}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.tags}>
            {event.tags.slice(0, 2).map((tag) => (
              <View
                key={tag}
                style={[
                  styles.tag,
                  { backgroundColor: Colors.tags[tag]?.bg ?? "#f0f0f0" },
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    { color: Colors.tags[tag]?.text ?? "#666" },
                  ]}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.price}>{event.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  categoryStripe: {
    width: 64,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  freeBadge: {
    backgroundColor: "#2E7D32",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  freeBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    padding: 12,
    gap: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  titleRow: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#1C1C1E",
    lineHeight: 20,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  addButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  meta: {
    gap: 3,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#636366",
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  tags: {
    flexDirection: "row",
    gap: 5,
    flex: 1,
  },
  tag: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  price: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#1C1C1E",
    marginLeft: 8,
  },
});
