import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { EventDetailSheet } from "@/components/EventDetailSheet";
import { FilterTags } from "@/components/FilterTags";
import { Event, useEvents } from "@/contexts/EventsContext";
import { EventBubble } from "@/components/EventBubble";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MOSCOW_REGION = {
  latitude: 55.7522,
  longitude: 37.6156,
  latitudeDelta: 0.075,
  longitudeDelta: 0.075,
};

let MapView: any = null;
let Marker: any = null;
let PROVIDER_DEFAULT: any = null;

if (Platform.OS !== "web") {
  const maps = require("react-native-maps");
  MapView = maps.default;
  Marker = maps.Marker;
  PROVIDER_DEFAULT = maps.PROVIDER_DEFAULT;
}

function WebMapPlaceholder({
  filteredEvents,
  onEventPress,
  selectedEventId,
}: {
  filteredEvents: Event[];
  onEventPress: (e: Event) => void;
  selectedEventId: string | null;
}) {
  return (
    <View style={styles.webMapContainer}>
      <View style={styles.webMapInner}>
        <Ionicons name="map" size={48} color={Colors.primary} />
        <Text style={styles.webMapTitle}>Map View</Text>
        <Text style={styles.webMapSubtitle}>
          Map is available in the Expo Go app
        </Text>
        <Text style={styles.webMapNote}>
          {filteredEvents.length} events displayed below
        </Text>
        <View style={styles.webEventDots}>
          {filteredEvents.slice(0, 6).map((e) => (
            <View
              key={e.id}
              style={[
                styles.webEventDot,
                { backgroundColor: e.imageColor },
                selectedEventId === e.id && styles.webEventDotSelected,
              ]}
            >
              <Text style={styles.webEventDotText} numberOfLines={1}>
                {e.title.split(" ")[0]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { filteredEvents, itinerary } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const mapRef = useRef<any>(null);

  const handleEventPress = useCallback((event: Event) => {
    setSelectedEvent(event);
    setSheetVisible(true);
    if (mapRef.current && Platform.OS !== "web") {
      mapRef.current.animateToRegion(
        {
          latitude: event.latitude - 0.008,
          longitude: event.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        },
        600
      );
    }
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSheetVisible(false);
    if (mapRef.current && Platform.OS !== "web") {
      setTimeout(() => {
        mapRef.current?.animateToRegion(MOSCOW_REGION, 600);
      }, 300);
    }
  }, []);

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={styles.container}>
      {Platform.OS !== "web" && MapView ? (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={MOSCOW_REGION}
          provider={PROVIDER_DEFAULT}
          showsUserLocation
          showsCompass={false}
          showsScale={false}
        >
          {filteredEvents.map((event) => (
            <Marker
              key={event.id}
              coordinate={{
                latitude: event.latitude,
                longitude: event.longitude,
              }}
              anchor={{ x: 0.5, y: 1 }}
              onPress={() => handleEventPress(event)}
            >
              <EventBubble
                event={event}
                onPress={handleEventPress}
                isSelected={selectedEvent?.id === event.id}
              />
            </Marker>
          ))}
        </MapView>
      ) : (
        <WebMapPlaceholder
          filteredEvents={filteredEvents}
          onEventPress={handleEventPress}
          selectedEventId={selectedEvent?.id ?? null}
        />
      )}

      <Animated.View
        style={[
          styles.header,
          { paddingTop: topInset + 8 },
        ]}
      >
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.headerTitle}>Moscow Events</Text>
            <Text style={styles.headerSubtitle}>
              {filteredEvents.length} events near you
            </Text>
          </View>
          <View style={styles.headerRight}>
            {itinerary.length > 0 && (
              <View style={styles.itineraryBadge}>
                <Ionicons name="calendar" size={14} color="#fff" />
                <Text style={styles.itineraryBadgeText}>
                  {itinerary.length}
                </Text>
              </View>
            )}
          </View>
        </View>
        <FilterTags />
      </Animated.View>

      {filteredEvents.length === 0 && (
        <View style={styles.emptyOverlay}>
          <Ionicons name="search" size={28} color="#8E8E93" />
          <Text style={styles.emptyText}>No events match your filters</Text>
        </View>
      )}

      <EventDetailSheet
        event={selectedEvent}
        visible={sheetVisible}
        onClose={handleCloseSheet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6D3D1",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.96)",
    paddingBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#1C1C1E",
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    marginTop: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itineraryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  itineraryBadgeText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  emptyOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -100 }, { translateY: 20 }],
    width: 200,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#8E8E93",
    textAlign: "center",
  },
  webMapContainer: {
    flex: 1,
    backgroundColor: "#E8E4DF",
    alignItems: "center",
    justifyContent: "center",
  },
  webMapInner: {
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  webMapTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#1C1C1E",
  },
  webMapSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#636366",
    textAlign: "center",
  },
  webMapNote: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.primary,
    marginTop: 4,
  },
  webEventDots: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
    justifyContent: "center",
  },
  webEventDot: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    maxWidth: 100,
  },
  webEventDotSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  webEventDotText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "#1C1C1E",
  },
});
