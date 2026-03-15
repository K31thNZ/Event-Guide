const primary = "#E8334A";
const primaryDark = "#C0253A";
const accent = "#1A3A5C";
const accentLight = "#2E5F8F";
const gold = "#F5A623";
const surface = "#FFFFFF";
const surfaceDark = "#1C1C1E";
const backgroundLight = "#F5F5F7";
const backgroundDark = "#000000";
const textPrimary = "#1C1C1E";
const textSecondary = "#8E8E93";
const textInverse = "#FFFFFF";
const border = "#E5E5EA";
const borderDark = "#2C2C2E";
const mapOverlay = "rgba(26, 58, 92, 0.85)";

export default {
  primary,
  primaryDark,
  accent,
  accentLight,
  gold,
  light: {
    text: textPrimary,
    textSecondary,
    background: backgroundLight,
    surface,
    tint: primary,
    tabIconDefault: "#8E8E93",
    tabIconSelected: primary,
    border,
    mapOverlay,
  },
  dark: {
    text: textInverse,
    textSecondary: "#AEAEB2",
    background: backgroundDark,
    surface: surfaceDark,
    tint: primary,
    tabIconDefault: "#636366",
    tabIconSelected: primary,
    border: borderDark,
    mapOverlay,
  },
  tags: {
    Free: { bg: "#E8F5E9", text: "#2E7D32", icon: "tag" },
    "Date Night": { bg: "#FCE4EC", text: "#C2185B", icon: "heart" },
    "Solo Friendly": { bg: "#E3F2FD", text: "#1565C0", icon: "person" },
    "Late Night": { bg: "#EDE7F6", text: "#4527A0", icon: "moon" },
    Family: { bg: "#FFF8E1", text: "#F57F17", icon: "people" },
    Networking: { bg: "#E0F2F1", text: "#00695C", icon: "briefcase" },
  },
};
