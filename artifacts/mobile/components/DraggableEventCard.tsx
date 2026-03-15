import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "@/constants/colors";
import { Event, useEvents } from "@/contexts/EventsContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAG_THRESHOLD = SCREEN_WIDTH * 0.35;

type Props = {
  event: Event;
  onPress: (event: Event) => void;
  onAddToItinerary: (event: Event) => void;
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

export function DraggableEventCard({
  event,
  onPress,
  onAddToItinerary,
}: Props) {
  const { isInItinerary, addToItinerary, removeFromItinerary } = useEvents();
  const inItinerary = isInItinerary(event.id);
  const translateX = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => {
        return Math.abs(gs.dx) > 8 && Math.abs(gs.dx) > Math.abs(gs.dy);
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
        Animated.spring(cardScale, {
          toValue: 0.97,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (_, gs) => {
        if (gs.dx > 0) {
          translateX.setValue(gs.dx);
          setDragProgress(Math.min(gs.dx / DRAG_THRESHOLD, 1));
        }
      },
      onPanResponderRelease: (_, gs) => {
        setIsDragging(false);
        Animated.spring(cardScale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();

        if (gs.dx > DRAG_THRESHOLD && !inItinerary) {
          if (Platform.OS !== "web") {
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            );
          }
          addToItinerary(event);
          onAddToItinerary(event);
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: SCREEN_WIDTH,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start(() => setDragProgress(0));
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            damping: 15,
            useNativeDriver: true,
          }).start(() => setDragProgress(0));
        }
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(cardScale, {
            toValue: 1,
            useNativeDriver: true,
          }),
        ]).start(() => setDragProgress(0));
      },
    })
  ).current;

  const dropZoneOpacity = translateX.interpolate({
    inputRange: [0, DRAG_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const dropZoneScale = translateX.interpolate({
    inputRange: [0, DRAG_THRESHOLD],
    outputRange: [0.95, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.dropZone,
          {
            opacity: dropZoneOpacity,
            transform: [{ scale: dropZoneScale }],
          },
        ]}
      >
        <Ionicons name="calendar-outline" size={20} color="#fff" />
        <Text style={styles.dropZoneText}>Drop to add</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          isDragging && styles.cardDragging,
          {
            transform: [
              { translateX },
              { scale: cardScale },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          onPress={() => onPress(event)}
          activeOpacity={0.93}
          style={styles.touchable}
        >
          <View
            style={[
              styles.categoryStripe,
              { backgroundColor: event.imageColor },
            ]}
          >
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
              <Text style={styles.title} numberOfLines={2}>
                {event.title}
              </Text>
              <View style={styles.dragHint}>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={inItinerary ? Colors.primary : "#C7C7CC"}
                />
                {inItinerary && (
                  <View style={styles.inItineraryDot} />
                )}
              </View>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="location" size={12} color={Colors.primary} />
              <Text style={styles.metaText} numberOfLines={1}>
                {event.venue}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="time" size={12} color="#8E8E93" />
              <Text style={styles.metaText}>
                {event.date} · {event.time}
              </Text>
            </View>

            <View style={styles.footer}>
              <View style={styles.tags}>
                {event.tags.slice(0, 2).map((tag) => (
                  <View
                    key={tag}
                    style={[
                      styles.tag,
                      {
                        backgroundColor:
                          Colors.tags[tag]?.bg ?? "#f0f0f0",
                      },
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
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 6,
    position: "relative",
  },
  dropZone: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  dropZoneText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  cardDragging: {
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  touchable: {
    flexDirection: "row",
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
    gap: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#1C1C1E",
    lineHeight: 20,
    flex: 1,
  },
  dragHint: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  inItineraryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    position: "absolute",
    top: -2,
    right: -2,
  },
  metaRow: {
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
