import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { Event, useEvents } from "@/contexts/EventsContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  event: Event | null;
  visible: boolean;
  onClose: () => void;
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

export function EventDetailSheet({ event, visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { isInItinerary, addToItinerary, removeFromItinerary } = useEvents();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          damping: 20,
          stiffness: 150,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!event) return null;

  const inItinerary = isInItinerary(event.id);

  const handleToggleItinerary = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(
        inItinerary
          ? Haptics.ImpactFeedbackStyle.Light
          : Haptics.ImpactFeedbackStyle.Heavy
      );
    }
    if (inItinerary) {
      removeFromItinerary(event.id);
    } else {
      addToItinerary(event);
    }
  };

  const handleTickets = () => {
    if (event.ticketUrl) {
      Linking.openURL(event.ticketUrl);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            activeOpacity={1}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY }],
              paddingBottom: insets.bottom + 16,
            },
          ]}
        >
          <View style={styles.handle} />

          <View
            style={[
              styles.headerBanner,
              { backgroundColor: event.imageColor },
            ]}
          >
            <View style={styles.categoryPill}>
              <Ionicons
                name={CATEGORY_ICONS[event.category] ?? "calendar"}
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color="#1C1C1E" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>{event.title}</Text>

            <View style={styles.metaGrid}>
              <View style={styles.metaItem}>
                <Ionicons name="location" size={16} color={Colors.primary} />
                <View>
                  <Text style={styles.metaLabel}>Venue</Text>
                  <Text style={styles.metaValue}>{event.venue}</Text>
                  <Text style={styles.metaSubValue}>{event.address}</Text>
                </View>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="calendar" size={16} color={Colors.primary} />
                <View>
                  <Text style={styles.metaLabel}>When</Text>
                  <Text style={styles.metaValue}>{event.date}</Text>
                  <Text style={styles.metaSubValue}>{event.time}</Text>
                </View>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="pricetag" size={16} color={Colors.primary} />
                <View>
                  <Text style={styles.metaLabel}>Price</Text>
                  <Text style={styles.metaValue}>{event.price}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.descriptionTitle}>About this event</Text>
            <Text style={styles.description}>{event.description}</Text>

            <View style={styles.tagsRow}>
              {event.tags.map((tag) => (
                <View
                  key={tag}
                  style={[
                    styles.tag,
                    { backgroundColor: Colors.tags[tag]?.bg ?? "#f0f0f0" },
                  ]}
                >
                  <Ionicons
                    name={
                      (Colors.tags[tag]?.icon as keyof typeof Ionicons.glyphMap) ??
                      "tag"
                    }
                    size={12}
                    color={Colors.tags[tag]?.text ?? "#666"}
                  />
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
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.itineraryButton,
                inItinerary && styles.itineraryButtonActive,
              ]}
              onPress={handleToggleItinerary}
            >
              <Ionicons
                name={inItinerary ? "checkmark-circle" : "add-circle"}
                size={20}
                color={inItinerary ? "#fff" : Colors.primary}
              />
              <Text
                style={[
                  styles.actionButtonText,
                  inItinerary && styles.actionButtonTextActive,
                ]}
              >
                {inItinerary ? "In Itinerary" : "Add to Itinerary"}
              </Text>
            </TouchableOpacity>

            {event.ticketUrl && (
              <TouchableOpacity
                style={[styles.actionButton, styles.ticketButton]}
                onPress={handleTickets}
              >
                <Ionicons name="ticket" size={20} color="#fff" />
                <Text style={[styles.actionButtonText, styles.ticketButtonText]}>
                  Get Tickets
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.88,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: "#E5E5EA",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  headerBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    maxHeight: SCREEN_HEIGHT * 0.45,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#1C1C1E",
    marginBottom: 16,
    lineHeight: 28,
    marginTop: 4,
  },
  metaGrid: {
    gap: 12,
    marginBottom: 20,
    backgroundColor: "#F5F5F7",
    borderRadius: 16,
    padding: 16,
  },
  metaItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  metaLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#1C1C1E",
    marginTop: 1,
  },
  metaSubValue: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#636366",
    marginTop: 1,
  },
  descriptionTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#3C3C43",
    lineHeight: 22,
    marginBottom: 16,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5EA",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  itineraryButton: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: "transparent",
  },
  itineraryButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  ticketButton: {
    backgroundColor: Colors.accent,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
  },
  actionButtonTextActive: {
    color: "#fff",
  },
  ticketButtonText: {
    color: "#fff",
  },
});
