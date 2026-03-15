import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type EventTag =
  | "Free"
  | "Date Night"
  | "Solo Friendly"
  | "Late Night"
  | "Family"
  | "Networking";

export type Event = {
  id: string;
  title: string;
  venue: string;
  address: string;
  description: string;
  date: string;
  time: string;
  price: string;
  priceAmount: number;
  tags: EventTag[];
  category: string;
  latitude: number;
  longitude: number;
  imageColor: string;
  ticketUrl?: string;
};

export type ItineraryItem = {
  event: Event;
  addedAt: string;
  notes?: string;
};

type EventsContextType = {
  events: Event[];
  activeTags: EventTag[];
  toggleTag: (tag: EventTag) => void;
  filteredEvents: Event[];
  itinerary: ItineraryItem[];
  addToItinerary: (event: Event) => void;
  removeFromItinerary: (eventId: string) => void;
  isInItinerary: (eventId: string) => boolean;
};

const ALL_TAGS: EventTag[] = [
  "Free",
  "Date Night",
  "Solo Friendly",
  "Late Night",
  "Family",
  "Networking",
];

const MOSCOW_EVENTS: Event[] = [
  {
    id: "1",
    title: "Expat Networking Brunch",
    venue: "Coffeemania Bolshaya Nikitskaya",
    address: "Bolshaya Nikitskaya St, 13",
    description:
      "Connect with fellow expats over brunch in the heart of Moscow. A relaxed morning event perfect for newcomers and long-time residents alike. Topics include navigating life in Moscow, career opportunities, and making lasting friendships.",
    date: "Sat, Mar 21",
    time: "11:00",
    price: "Free",
    priceAmount: 0,
    tags: ["Free", "Networking", "Solo Friendly"],
    category: "Social",
    latitude: 55.7558,
    longitude: 37.6043,
    imageColor: "#E0F2F1",
    ticketUrl: "https://expat-moscow.ru/events/brunch",
  },
  {
    id: "2",
    title: "Moscow Philharmonic — Rachmaninoff Evening",
    venue: "Moscow Philharmonic Hall",
    address: "Triumfalnaya Pl., 4",
    description:
      "An extraordinary evening of Rachmaninoff performed by the Moscow Philharmonic Orchestra. Experience world-class classical music in one of Moscow's grandest concert halls. Perfect for a special night out.",
    date: "Fri, Mar 20",
    time: "19:00",
    price: "₽2,500",
    priceAmount: 2500,
    tags: ["Date Night"],
    category: "Arts",
    latitude: 55.7694,
    longitude: 37.5944,
    imageColor: "#EDE7F6",
    ticketUrl: "https://mosconcert.com/tickets",
  },
  {
    id: "3",
    title: "Tretyakov Gallery Night Tour",
    venue: "Tretyakov Gallery",
    address: "Lavrushinsky Lane, 10",
    description:
      "Explore Russia's finest collection of Russian fine art in an exclusive after-hours evening tour. Includes guided commentary on masterpieces by Repin, Surikov, and Vasnetsov. Wine reception included.",
    date: "Sat, Mar 22",
    time: "20:00",
    price: "₽3,200",
    priceAmount: 3200,
    tags: ["Date Night", "Solo Friendly"],
    category: "Arts",
    latitude: 55.7414,
    longitude: 37.6208,
    imageColor: "#FCE4EC",
    ticketUrl: "https://tretyakovgallery.ru/en",
  },
  {
    id: "4",
    title: "Gorky Park Family Weekend",
    venue: "Gorky Park",
    address: "Krymsky Val, 9",
    description:
      "A full day of family-friendly activities at Gorky Park including ice skating, art workshops for kids, food stalls with international cuisine, and live music performances throughout the day.",
    date: "Sun, Mar 23",
    time: "10:00",
    price: "Free",
    priceAmount: 0,
    tags: ["Free", "Family"],
    category: "Outdoors",
    latitude: 55.7293,
    longitude: 37.6011,
    imageColor: "#FFF8E1",
    ticketUrl: undefined,
  },
  {
    id: "5",
    title: "Moscow International Tech Meetup",
    venue: "Digital October Center",
    address: "Bersenevskaya Emb., 6/3",
    description:
      "Join the monthly meetup for tech professionals in Moscow. This month's theme: AI & the Future of Work. Speakers from Google, Yandex, and local startups. Open bar and snacks provided.",
    date: "Thu, Mar 19",
    time: "18:30",
    price: "Free",
    priceAmount: 0,
    tags: ["Free", "Networking"],
    category: "Tech",
    latitude: 55.7422,
    longitude: 37.6064,
    imageColor: "#E3F2FD",
    ticketUrl: "https://meetup.com/moscow-tech",
  },
  {
    id: "6",
    title: "Jazz Underground at 16 Tons",
    venue: "16 Tons",
    address: "Presnensky Val, 6",
    description:
      "Late night jazz session featuring the best Moscow jazz musicians. The intimate underground club atmosphere makes this the perfect late-night escape. Craft cocktails and light bites available throughout the evening.",
    date: "Fri, Mar 20",
    time: "22:00",
    price: "₽1,500",
    priceAmount: 1500,
    tags: ["Late Night", "Date Night"],
    category: "Music",
    latitude: 55.7603,
    longitude: 37.5698,
    imageColor: "#E8EAF6",
    ticketUrl: "https://16tons.ru",
  },
  {
    id: "7",
    title: "Russian Language Exchange",
    venue: "Strelka Bar",
    address: "Bersenevskaya Emb., 14/5",
    description:
      "Weekly language exchange where Russians learning English meet expats learning Russian. A fun and relaxed way to practice the language and meet locals. All levels welcome.",
    date: "Wed, Mar 18",
    time: "19:00",
    price: "Free",
    priceAmount: 0,
    tags: ["Free", "Solo Friendly", "Networking"],
    category: "Social",
    latitude: 55.7417,
    longitude: 37.6082,
    imageColor: "#E8F5E9",
    ticketUrl: undefined,
  },
  {
    id: "8",
    title: "Children's Ballet — The Nutcracker",
    venue: "Stanislavsky Music Theatre",
    address: "Bolshaya Dmitrovka, 17",
    description:
      "A magical family performance of The Nutcracker ballet especially designed for children aged 4–12. Features stunning costumes, live orchestra, and an interactive backstage tour after the show.",
    date: "Sun, Mar 23",
    time: "12:00",
    price: "₽1,800",
    priceAmount: 1800,
    tags: ["Family"],
    category: "Arts",
    latitude: 55.7649,
    longitude: 37.617,
    imageColor: "#FFF3E0",
    ticketUrl: "https://stanislavsky.ru/en",
  },
  {
    id: "9",
    title: "Expat Startup Founders Dinner",
    venue: "White Rabbit",
    address: "Smolenskaya Sq., 3",
    description:
      "An exclusive dinner for expat entrepreneurs and startup founders in Moscow. Share your journey, find co-founders, and connect with investors. Hosted by the Moscow International Business Club.",
    date: "Tue, Mar 25",
    time: "20:00",
    price: "₽4,500",
    priceAmount: 4500,
    tags: ["Networking", "Date Night"],
    category: "Business",
    latitude: 55.7466,
    longitude: 37.5852,
    imageColor: "#E8EAF6",
    ticketUrl: "https://whiterabbitmoscow.ru",
  },
  {
    id: "10",
    title: "Midnight Rooftop DJ Set",
    venue: "Mendeleev Bar",
    address: "Neglinnaya St., 1",
    description:
      "Moscow's most exclusive rooftop club opens its doors for a special late-night set featuring international DJs. Panoramic views of the Kremlin. Dress code: smart casual. Age 21+.",
    date: "Sat, Mar 22",
    time: "23:00",
    price: "₽2,000",
    priceAmount: 2000,
    tags: ["Late Night"],
    category: "Nightlife",
    latitude: 55.7627,
    longitude: 37.6223,
    imageColor: "#1A1A2E",
    ticketUrl: "https://mendeleev.bar",
  },
];

const EventsContext = createContext<EventsContextType | null>(null);

const ITINERARY_KEY = "@moscow_events_itinerary";
const TAGS_KEY = "@moscow_events_tags";

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [activeTags, setActiveTags] = useState<EventTag[]>([...ALL_TAGS]);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [savedTags, savedItinerary] = await Promise.all([
          AsyncStorage.getItem(TAGS_KEY),
          AsyncStorage.getItem(ITINERARY_KEY),
        ]);
        if (savedTags) setActiveTags(JSON.parse(savedTags));
        if (savedItinerary) setItinerary(JSON.parse(savedItinerary));
      } catch {}
    })();
  }, []);

  const toggleTag = useCallback(
    (tag: EventTag) => {
      setActiveTags((prev) => {
        const next = prev.includes(tag)
          ? prev.filter((t) => t !== tag)
          : [...prev, tag];
        AsyncStorage.setItem(TAGS_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    []
  );

  const filteredEvents =
    activeTags.length === 0
      ? MOSCOW_EVENTS
      : MOSCOW_EVENTS.filter((e) =>
          e.tags.some((t) => activeTags.includes(t))
        );

  const addToItinerary = useCallback((event: Event) => {
    setItinerary((prev) => {
      if (prev.find((i) => i.event.id === event.id)) return prev;
      const next = [
        ...prev,
        { event, addedAt: new Date().toISOString() },
      ];
      AsyncStorage.setItem(ITINERARY_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const removeFromItinerary = useCallback((eventId: string) => {
    setItinerary((prev) => {
      const next = prev.filter((i) => i.event.id !== eventId);
      AsyncStorage.setItem(ITINERARY_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const isInItinerary = useCallback(
    (eventId: string) => itinerary.some((i) => i.event.id === eventId),
    [itinerary]
  );

  return (
    <EventsContext.Provider
      value={{
        events: MOSCOW_EVENTS,
        activeTags,
        toggleTag,
        filteredEvents,
        itinerary,
        addToItinerary,
        removeFromItinerary,
        isInItinerary,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
}

export { ALL_TAGS };
