import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { DraggableEventCard } from "@/components/DraggableEventCard";
import { EventDetailSheet } from "@/components/EventDetailSheet";
import { FilterTags } from "@/components/FilterTags";
import { Event, useEvents } from "@/contexts/EventsContext";

type SortOption = "date" | "price" | "name";

export default function ListScreen() {
  const insets = useSafeAreaInsets();
  const { filteredEvents, itinerary } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [addedEventId, setAddedEventId] = useState<string | null>(null);

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === "price") return a.priceAmount - b.priceAmount;
    if (sortBy === "name") return a.title.localeCompare(b.title);
    return 0;
  });

  const handleAddToItinerary = (event: Event) => {
    setAddedEventId(event.id);
    setTimeout(() => setAddedEventId(null), 2000);
  };

  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.headerTitle}>All Events</Text>
          <Text style={styles.eventCount}>{filteredEvents.length}</Text>
        </View>
        <FilterTags />
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          {(["date", "price", "name"] as SortOption[]).map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.sortChip,
                sortBy === opt && styles.sortChipActive,
              ]}
              onPress={() => setSortBy(opt)}
            >
              <Text
                style={[
                  styles.sortChipText,
                  sortBy === opt && styles.sortChipTextActive,
                ]}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {addedEventId && (
        <View style={styles.addedToast}>
          <Ionicons name="checkmark-circle" size={18} color="#fff" />
          <Text style={styles.addedToastText}>Added to itinerary!</Text>
        </View>
      )}

      <FlatList
        data={sortedEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DraggableEventCard
            event={item}
            onPress={(e) => {
              setSelectedEvent(e);
              setSheetVisible(true);
            }}
            onAddToItinerary={handleAddToItinerary}
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
            <Ionicons name="search" size={40} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your filters
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.dragHintBanner}>
            <Ionicons
              name="arrow-forward-circle"
              size={16}
              color={Colors.primary}
            />
            <Text style={styles.dragHintText}>
              Swipe right on an event to add it to your itinerary
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
    paddingBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#1C1C1E",
  },
  eventCount: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: "hidden",
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
  },
  sortLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#8E8E93",
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#F5F5F7",
  },
  sortChipActive: {
    backgroundColor: Colors.primary,
  },
  sortChipText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "#636366",
  },
  sortChipTextActive: {
    color: "#fff",
  },
  listContent: {
    paddingTop: 8,
  },
  dragHintBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(232,51,74,0.08)",
    marginHorizontal: 16,
    marginVertical: 4,
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dragHintText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.primary,
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#636366",
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
  },
  addedToast: {
    position: "absolute",
    top: 130,
    alignSelf: "center",
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  addedToastText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
});
