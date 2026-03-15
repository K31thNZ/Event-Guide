import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { EventDetailSheet } from "@/components/EventDetailSheet";
import { Event, useEvents } from "@/contexts/EventsContext";

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Social: "people",
  Arts: "color-palette",
  Outdoors: "leaf",
  Tech: "laptop",
  Music: "musical-notes",
  Business: "briefcase",
  Nightlife: "wine",
};

function ItineraryItem({
  event,
  onPress,
  onRemove,
}: {
  event: Event;
  onPress: (e: Event) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <TouchableOpacity
      style={styles.itineraryCard}
      onPress={() => onPress(event)}
      activeOpacity={0.93}
    >
      <View
        style={[styles.timelineBar, { backgroundColor: Colors.primary }]}
      />

      <View
        style={[
          styles.cardIcon,
          { backgroundColor: event.imageColor },
        ]}
      >
        <Ionicons
          name={CATEGORY_ICONS[event.category] ?? "calendar"}
          size={18}
          color={Colors.primary}
        />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleArea}>
            <Text style={styles.cardTime}>{event.time}</Text>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {event.title}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              onRemove(event.id);
            }}
          >
            <Ionicons name="close" size={16} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardMeta}>
          <Ionicons name="location" size={12} color={Colors.primary} />
          <Text style={styles.cardVenue} numberOfLines={1}>
            {event.venue}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.cardDate}>
            <Ionicons name="calendar-outline" size={12} color="#8E8E93" />
            <Text style={styles.cardDateText}>{event.date}</Text>
          </View>
          <Text
            style={[
              styles.cardPrice,
              event.priceAmount === 0 && styles.cardPriceFree,
            ]}
          >
            {event.price}
          </Text>
          {event.ticketUrl && (
            <TouchableOpacity
              style={styles.ticketButton}
              onPress={() => {
                if (event.ticketUrl) Linking.openURL(event.ticketUrl);
              }}
            >
              <Ionicons name="ticket-outline" size={12} color="#fff" />
              <Text style={styles.ticketButtonText}>Tickets</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ItineraryScreen() {
  const insets = useSafeAreaInsets();
  const { itinerary, removeFromItinerary } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const sortedItinerary = [...itinerary].sort((a, b) =>
    a.event.date.localeCompare(b.event.date)
  );

  const totalCost = itinerary.reduce(
    (sum, item) => sum + item.event.priceAmount,
    0
  );
  const freeCount = itinerary.filter(
    (item) => item.event.priceAmount === 0
  ).length;

  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Itinerary</Text>
        {itinerary.length > 0 && (
          <View style={styles.summaryRow}>
            <View style={styles.summaryChip}>
              <Ionicons name="calendar" size={14} color={Colors.primary} />
              <Text style={styles.summaryText}>
                {itinerary.length} event{itinerary.length !== 1 ? "s" : ""}
              </Text>
            </View>
            {freeCount > 0 && (
              <View
                style={[
                  styles.summaryChip,
                  { backgroundColor: "#E8F5E9" },
                ]}
              >
                <Ionicons name="pricetag" size={14} color="#2E7D32" />
                <Text style={[styles.summaryText, { color: "#2E7D32" }]}>
                  {freeCount} free
                </Text>
              </View>
            )}
            {totalCost > 0 && (
              <View
                style={[
                  styles.summaryChip,
                  { backgroundColor: "#EDE7F6" },
                ]}
              >
                <Ionicons name="wallet" size={14} color="#4527A0" />
                <Text style={[styles.summaryText, { color: "#4527A0" }]}>
                  ₽{totalCost.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <FlatList
        data={sortedItinerary}
        keyExtractor={(item) => item.event.id}
        renderItem={({ item }) => (
          <ItineraryItem
            event={item.event}
            onPress={(e) => {
              setSelectedEvent(e);
              setSheetVisible(true);
            }}
            onRemove={removeFromItinerary}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          Platform.OS === "web"
            ? { paddingBottom: 84 + 34 }
            : { paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconRing}>
              <Ionicons
                name="calendar-outline"
                size={36}
                color={Colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>Your itinerary is empty</Text>
            <Text style={styles.emptySubtitle}>
              Browse events on the Map or List tab{"\n"}and swipe right to add them here
            </Text>
          </View>
        }
      />

      <EventDetailSheet
        event={selectedEvent}
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#1C1C1E",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  summaryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(232,51,74,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  summaryText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
  },
  listContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  itineraryCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 10,
    padding: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  timelineBar: {
    width: 3,
    borderRadius: 2,
    alignSelf: "stretch",
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitleArea: {
    flex: 1,
    gap: 1,
  },
  cardTime: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#1C1C1E",
    lineHeight: 20,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F5F5F7",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    flexShrink: 0,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardVenue: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#636366",
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  cardDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  cardDateText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
  },
  cardPrice: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#1C1C1E",
  },
  cardPriceFree: {
    color: "#2E7D32",
  },
  ticketButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  ticketButtonText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(232,51,74,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#636366",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 20,
  },
});
