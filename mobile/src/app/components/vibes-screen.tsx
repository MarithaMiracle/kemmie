import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Sparkles,
  Pizza,
  Coffee,
  ShoppingBag,
  Gamepad2,
  Popcorn,
  MapPin,
} from "lucide-react-native";
import { AddVibeModal } from "./add-vibe-modal";
import { getToken, fetchVibes, addVibe } from "../lib/api";
const themeGradientMap: Record<string, string[]> = {
  'pink-purple': ['#0F172A', '#111827'],
  'blue-purple': ['#111827', '#1F2937'],
  'pink-orange': ['#0F172A', '#1F2937'],
  'green-blue': ['#064E3B', '#0F172A'],
  'red-pink': ['#3F0D12', '#111827'],
  'purple-indigo': ['#1E1B4B', '#0F172A'],
};

type VibeCategory = "all" | "food" | "activities" | "movies" | "shopping" | "plans";
type VibeType = "food" | "activity" | "movie" | "shopping" | "plan";

interface VibesScreenProps { darkMode: boolean; selectedTheme: string; currentUserName: string; bestieName: string }
export function VibesScreen({ darkMode, selectedTheme, currentUserName, bestieName }: VibesScreenProps) {
  const [activeCategory, setActiveCategory] = useState<VibeCategory>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<VibeType>("food");
  const [authorFilter, setAuthorFilter] = useState<'all' | string>('all');

  const [foodVibes, setFoodVibes] = useState<any[]>([]);
  const [activityVibes, setActivityVibes] = useState<any[]>([]);
  const [movieVibes, setMovieVibes] = useState<any[]>([]);
  const [shoppingWishlist, setShoppingWishlist] = useState<any[]>([]);
  const [upcomingPlans, setUpcomingPlans] = useState<any[]>([]);

  const handleAddVibe = async (data: any) => {
    if (addModalType === "food") setFoodVibes([data, ...foodVibes]);
    else if (addModalType === "activity") setActivityVibes([data, ...activityVibes]);
    else if (addModalType === "movie") setMovieVibes([data, ...movieVibes]);
    else if (addModalType === "shopping") setShoppingWishlist([data, ...shoppingWishlist]);
    else if (addModalType === "plan") setUpcomingPlans([data, ...upcomingPlans]);
    try {
      const token = await getToken();
      if (token) await addVibe(token, addModalType, data);
    } catch {}
  };

  const openAddModal = (type: VibeType) => {
    setAddModalType(type);
    setShowAddModal(true);
  };

  const categories = [
    { id: "all" as VibeCategory, label: "All", icon: Sparkles },
    { id: "food" as VibeCategory, label: "Food", icon: Pizza },
    { id: "activities" as VibeCategory, label: "Activities", icon: Gamepad2 },
    { id: "movies" as VibeCategory, label: "Movies", icon: Popcorn },
    { id: "shopping" as VibeCategory, label: "Shopping", icon: ShoppingBag },
    { id: "plans" as VibeCategory, label: "Plans", icon: MapPin },
  ];

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const [foods, acts, movies, shops, plans] = await Promise.all([
          fetchVibes(token, { category: 'food' }),
          fetchVibes(token, { category: 'activity' }),
          fetchVibes(token, { category: 'movie' }),
          fetchVibes(token, { category: 'shopping' }),
          fetchVibes(token, { category: 'plan' }),
        ]);
        if (Array.isArray(foods)) setFoodVibes(foods);
        if (Array.isArray(acts)) setActivityVibes(acts);
        if (Array.isArray(movies)) setMovieVibes(movies);
        if (Array.isArray(shops)) setShoppingWishlist(shops);
        if (Array.isArray(plans)) setUpcomingPlans(plans);
      } catch {}
    })();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#F3E8FF', paddingBottom: 96 }}>
      <LinearGradient
        colors={themeGradientMap[selectedTheme] ?? (darkMode ? ['#374151', '#374151'] : ['#8B5CF6', '#EC4899'])}
        style={{ paddingHorizontal: 24, paddingVertical: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
      >
        <View style={{ alignItems: "center" }}>
          <Sparkles size={36} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 28, fontWeight: "700", marginTop: 8 }}>Vibes</Text>
          <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 14 }}>Everything you're into right now ✨</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <Pressable
                key={category.id}
                onPress={() => setActiveCategory(category.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 9999,
                  marginRight: 8,
                  backgroundColor: isActive ? "#8B5CF6" : "#fff",
                  borderWidth: isActive ? 0 : 1,
                  borderColor: "#E5E7EB",
                }}
              >
                <Icon size={16} color={isActive ? "#fff" : "#6B7280"} />
                <Text style={{ fontSize: 13, fontWeight: "600", color: isActive ? "#fff" : "#6B7280", marginLeft: 8 }}>
                  {category.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          {['all', currentUserName, bestieName].map((label) => {
            const isActive = authorFilter === label;
            return (
              <Pressable
                key={label}
                onPress={() => setAuthorFilter(label)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 9999,
                  marginRight: 8,
                  backgroundColor: isActive ? '#8B5CF6' : '#fff',
                  borderWidth: isActive ? 0 : 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: isActive ? '#fff' : '#6B7280' }}>
                  {label === 'all' ? 'All' : label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {(activeCategory === "all" || activeCategory === "food") && (
          <View style={{ borderRadius: 16, padding: 16, backgroundColor: "#FFF7ED", borderWidth: 2, borderColor: "#fff", marginTop: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pizza size={20} color="#EA580C" />
                <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: "600", color: "#111827" }}>Food Vibes</Text>
              </View>
              <Pressable onPress={() => openAddModal("food")}>
                <Text style={{ color: "#EA580C", fontSize: 13, fontWeight: "600" }}>+ Add</Text>
              </Pressable>
            </View>
            {foodVibes.filter(v => authorFilter === 'all' || v.author === authorFilter).map((vibe, i) => (
              <View key={i} style={{ backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 12, padding: 12, marginBottom: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <Text style={{ fontSize: 22 }}>{vibe.emoji}</Text>
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={{ color: "#111827", fontSize: 14, fontWeight: "500" }}>{vibe.text}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                      <Text style={{ backgroundColor: "#FED7AA", color: "#9A3412", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999, fontSize: 11, fontWeight: "600" }}>
                        {vibe.type}
                      </Text>
                      <Text style={{ marginLeft: 8, color: "#6B7280", fontSize: 11 }}>{vibe.time}</Text>
                      <Text style={{ marginLeft: 8, backgroundColor: "#E5E7EB", color: "#374151", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999, fontSize: 11, fontWeight: "600" }}>
                        {vibe.author}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {(activeCategory === "all" || activeCategory === "activities") && (
          <View style={{ borderRadius: 16, padding: 16, backgroundColor: "#fff", borderWidth: 1, borderColor: "#E9D5FF", marginTop: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Gamepad2 size={20} color="#7C3AED" />
                <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: "600", color: "#111827" }}>Recent Activities</Text>
              </View>
              <Pressable onPress={() => openAddModal("activity")}>
                <Text style={{ color: "#7C3AED", fontSize: 13, fontWeight: "600" }}>+ Add</Text>
              </Pressable>
            </View>
            {activityVibes.filter(v => authorFilter === 'all' || v.author === authorFilter).map((vibe, i) => (
              <View key={i} style={{ backgroundColor: "#F3E8FF", borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: "#DDD6FE" }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <Text style={{ fontSize: 22 }}>{vibe.emoji}</Text>
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={{ color: "#111827", fontSize: 14, fontWeight: "500" }}>{vibe.text}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                      <Text style={{ backgroundColor: "#E9D5FF", color: "#6D28D9", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999, fontSize: 11, fontWeight: "600" }}>
                        {vibe.type}
                      </Text>
                      <Text style={{ marginLeft: 8, color: "#6B7280", fontSize: 11 }}>{vibe.time}</Text>
                      <Text style={{ marginLeft: 8, backgroundColor: "#E5E7EB", color: "#374151", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999, fontSize: 11, fontWeight: "600" }}>
                        {vibe.author}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {(activeCategory === "all" || activeCategory === "movies") && (
          <LinearGradient colors={["#34D399", "#60A5FA"]} style={{ borderRadius: 16, padding: 16, marginTop: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Popcorn size={24} color="#fff" />
                <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: "600", color: "#fff" }}>Movies</Text>
              </View>
              <Pressable onPress={() => openAddModal("movie")}>
                <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: "600" }}>+ Add</Text>
              </Pressable>
            </View>
            {movieVibes.filter(v => authorFilter === 'all' || v.author === authorFilter).map((vibe, i) => (
              <View key={i} style={{ backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 12, padding: 12, marginBottom: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <Text style={{ fontSize: 22, color: "#fff" }}>{vibe.emoji}</Text>
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>{vibe.title ?? vibe.song}</Text>
                    <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{vibe.director ?? vibe.platform ?? vibe.artist}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                      <Text style={{ backgroundColor: "rgba(255,255,255,0.35)", color: "#fff", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999, fontSize: 11, fontWeight: "600" }}>
                        {vibe.status}
                      </Text>
                      <Text style={{ marginLeft: 8, color: "rgba(255,255,255,0.8)", fontSize: 11 }}>{vibe.time}</Text>
                      <Text style={{ marginLeft: 8, backgroundColor: "rgba(255,255,255,0.35)", color: "#fff", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999, fontSize: 11, fontWeight: "600" }}>
                        {vibe.author}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </LinearGradient>
        )}

        {(activeCategory === "all" || activeCategory === "shopping") && (
          <View style={{ borderRadius: 16, padding: 16, backgroundColor: "#FDF2F8", marginTop: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ShoppingBag size={20} color="#DB2777" />
                <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: "600", color: "#111827" }}>Wishlist</Text>
              </View>
              <Pressable onPress={() => openAddModal("shopping")}>
                <Text style={{ color: "#DB2777", fontSize: 13, fontWeight: "600" }}>+ Add</Text>
              </Pressable>
            </View>
            {shoppingWishlist.filter(v => authorFilter === 'all' || v.author === authorFilter).map((item, i) => (
              <View key={i} style={{ backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={{ color: "#111827", fontSize: 14, fontWeight: "500" }}>{item.item}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                      <Text style={{ color: "#6B7280", fontSize: 12 }}>{item.store}</Text>
                      <Text style={{ marginLeft: 8, backgroundColor: "#FBCFE8", color: "#BE185D", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999, fontSize: 11, fontWeight: "600" }}>
                        {item.priority}
                      </Text>
                      <Text style={{ marginLeft: 8, backgroundColor: "#E5E7EB", color: "#374151", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999, fontSize: 11, fontWeight: "600" }}>
                        {item.author}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {(activeCategory === "all" || activeCategory === "plans") && (
          <View style={{ borderRadius: 16, padding: 16, backgroundColor: "#fff", borderWidth: 2, borderColor: "#DDD6FE", marginTop: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MapPin size={20} color="#2563EB" />
                <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: "600", color: "#111827" }}>Upcoming Plans</Text>
              </View>
              <Pressable onPress={() => openAddModal("plan")}>
                <Text style={{ color: "#2563EB", fontSize: 13, fontWeight: "600" }}>+ Add</Text>
              </Pressable>
            </View>
            {upcomingPlans.filter(v => authorFilter === 'all' || v.author === authorFilter).map((plan, i) => (
              <View key={i} style={{ backgroundColor: "#EFF6FF", borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: "#DBEAFE" }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <Text style={{ fontSize: 22 }}>{plan.emoji}</Text>
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={{ color: "#111827", fontSize: 15, fontWeight: "600" }}>{plan.plan}</Text>
                    <Text style={{ color: "#374151", fontSize: 13, marginTop: 4 }}>📅 {plan.date}</Text>
                    <Text style={{ color: "#6B7280", fontSize: 12 }}>📍 {plan.location}</Text>
                    <Text style={{ marginTop: 4, alignSelf: 'flex-start', backgroundColor: "#E5E7EB", color: "#374151", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999, fontSize: 11, fontWeight: "600" }}>
                      {plan.author}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ flexDirection: "row", marginTop: 12 }}>
          <Pressable
            onPress={() => openAddModal("food")}
            style={{ flex: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#FED7AA", alignItems: "center", marginRight: 8 }}
          >
            <Coffee size={24} color="#EA580C" />
            <Text style={{ marginTop: 6, fontSize: 11, fontWeight: "600", color: "#111827" }}>Food</Text>
          </Pressable>
          <Pressable
            onPress={() => openAddModal("activity")}
            style={{ flex: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#DDD6FE", alignItems: "center", marginLeft: 8, marginRight: 8 }}
          >
            <Popcorn size={24} color="#7C3AED" />
            <Text style={{ marginTop: 6, fontSize: 11, fontWeight: "600", color: "#111827" }}>Activity</Text>
          </Pressable>
          <Pressable
            onPress={() => openAddModal("shopping")}
            style={{ flex: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#FBCFE8", alignItems: "center", marginLeft: 8 }}
          >
            <ShoppingBag size={24} color="#DB2777" />
            <Text style={{ marginTop: 6, fontSize: 11, fontWeight: "600", color: "#111827" }}>Shopping</Text>
          </Pressable>
        </View>
      </ScrollView>

      {showAddModal && (
        <AddVibeModal
          darkMode={darkMode}
          type={addModalType}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddVibe}
          currentUserName={currentUserName}
        />
      )}
    </View>
  );
}