import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, FlatList } from "react-native";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  maxSelection?: number;
  selected: string[];
  darkMode: boolean;
}

export function EmojiPicker({ onSelect, maxSelection = 1, selected, darkMode }: EmojiPickerProps) {
  const emojiCategories = {
    Moods: ["😊", "😂", "🥰", "😎", "🤩", "😌", "😴", "🥱", "😤", "😭", "🥺", "😱", "🤔", "😏", "🙃", "😇"],
    Vibes: ["✨", "💫", "⭐", "🌟", "💖", "💕", "💗", "🔥", "⚡", "💥", "🌈", "☀️", "🌙", "🎉", "🎊", "🎈"],
    Activities: ["📱", "🎵", "🎮", "📚", "☕", "🍕", "🛌", "🚗", "✈️", "🎨", "📸", "💅", "🛍️", "🏃", "🧘", "💤"],
    Random: ["🦄", "🐱", "🐶", "🍦", "🌸", "🎭", "👑", "💎", "🎯", "🔮", "🧸", "🎀", "🌺", "🦋", "🌻", "🍓"],
  };

  const [activeCategory, setActiveCategory] = useState<string>("Moods");

  const renderCategoryTabs = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
      {Object.keys(emojiCategories).map((category) => {
        const isActive = activeCategory === category;
        const tabStyle = StyleSheet.flatten([
          styles.tab,
          isActive
            ? { backgroundColor: "#8B5CF6" }
            : darkMode
            ? { backgroundColor: "#4B5563" }
            : { backgroundColor: "#FFFFFF" },
        ]);
        const textStyle = StyleSheet.flatten([
          styles.tabText,
          isActive ? { color: "#FFFFFF" } : darkMode ? { color: "#D1D5DB" } : { color: "#374151" },
        ]);

        return (
          <Pressable key={category} onPress={() => setActiveCategory(category)} style={tabStyle} accessibilityRole="button">
            <Text style={textStyle}>{category}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );

  const renderSelected = () => {
    if (!(maxSelection > 1 && selected.length > 0)) return null;
    const containerStyle = StyleSheet.flatten([
      styles.selectedContainer,
      darkMode ? { backgroundColor: "#4B5563" } : { backgroundColor: "#FFFFFF" },
    ]);
    const labelStyle = StyleSheet.flatten([
      styles.selectedLabel,
      darkMode ? { color: "#D1D5DB" } : { color: "#6B7280" },
    ]);

    return (
      <View style={containerStyle}>
        <View style={styles.selectedRow}>
          <Text style={labelStyle}>Selected ({selected.length}/{maxSelection}):</Text>
          <View style={styles.selectedEmojis}>
            {selected.map((emoji, index) => (
              <Text key={index} style={styles.selectedEmoji}>{emoji}</Text>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const data = emojiCategories[activeCategory as keyof typeof emojiCategories];

  return (
    <View style={StyleSheet.flatten([styles.container, darkMode ? { backgroundColor: "#374151" } : { backgroundColor: "#F9FAFB" }])}>
      {renderCategoryTabs()}
      {renderSelected()}
      <FlatList
        data={data}
        keyExtractor={(item) => item}
        numColumns={8}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          const isSelected = selected.includes(item);
          const canSelect = !isSelected && selected.length < maxSelection;

          const buttonStyle = StyleSheet.flatten([
            styles.emojiButton,
            isSelected
              ? { backgroundColor: "#D8B4FE", transform: [{ scale: 1.05 }] }
              : canSelect
              ? darkMode
                ? { backgroundColor: "transparent" }
                : { backgroundColor: "transparent" }
              : { opacity: 0.3 },
          ]);
          const textStyle = StyleSheet.flatten([styles.emojiText]);

          return (
            <Pressable
              onPress={() => onSelect(item)}
              disabled={!canSelect && !isSelected}
              style={buttonStyle}
              accessibilityRole="button"
            >
              <Text style={textStyle}>{item}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
  },
  tabsContainer: {
    paddingBottom: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    marginRight: 8,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
  },
  selectedContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
  },
  selectedRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginRight: 8,
  },
  selectedEmojis: {
    flexDirection: "row",
  },
  selectedEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  grid: {
    maxHeight: 256,
  },
  emojiButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    flex: 1,
  },
  emojiText: {
    fontSize: 30,
  },
});
