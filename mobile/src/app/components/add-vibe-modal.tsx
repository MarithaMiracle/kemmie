import React, { useState } from "react";
import { Modal, View, Text, ScrollView, TextInput, Pressable, Dimensions } from "react-native";
import { X, Plus } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "./ui/button";

type VibeType = "food" | "activity" | "movie" | "shopping" | "plan";

interface AddVibeModalProps {
  darkMode: boolean;
  type: VibeType;
  onClose: () => void;
  onAdd: (data: any) => void;
  currentUserName: string;
}

export function AddVibeModal({ darkMode, type, onClose, onAdd, currentUserName }: AddVibeModalProps) {
  // Food state
  const [foodText, setFoodText] = useState("");
  const [foodType, setFoodType] = useState("craving");
  const [foodEmoji, setFoodEmoji] = useState("🍕");

  // Activity state
  const [activityText, setActivityText] = useState("");
  const [activityType, setActivityType] = useState("idea");
  const [activityEmoji, setActivityEmoji] = useState("🎬");

  // Music state
  const [musicArtist, setMusicArtist] = useState("");
  const [musicSong, setMusicSong] = useState("");
  const [musicStatus, setMusicStatus] = useState("watching");
  const [musicEmoji, setMusicEmoji] = useState("🍿");

  // Shopping state
  const [shoppingItem, setShoppingItem] = useState("");
  const [shoppingStore, setShoppingStore] = useState("");
  const [shoppingPriority, setShoppingPriority] = useState("want");
  const [shoppingEmoji, setShoppingEmoji] = useState("👗");

  // Plan state
  const [planName, setPlanName] = useState("");
  const [planDate, setPlanDate] = useState("");
  const [planLocation, setPlanLocation] = useState("");
  const [planEmoji, setPlanEmoji] = useState("☕");

  const foodEmojis = ["🍕", "🍔", "🍣", "🍜", "🌮", "🧋", "☕", "🍰", "🍦", "🥗"];
  const activityEmojis = ["🎬", "💅", "🛍️", "🎨", "🎮", "🏃", "🧘", "📚", "🎤", "🎯"];
  const musicEmojis = ["🍿", "🎬", "🎥", "📽️", "🎞️", "⭐"];
  const shoppingEmojis = ["👗", "👟", "💄", "👜", "💍", "🕶️", "👠", "🧥"];
  const planEmojis = ["☕", "🎉", "🏖️", "🎬", "🍽️", "🎨", "🛍️", "✈️"];

const Label = ({ children, darkMode }: { children: React.ReactNode; darkMode: boolean }) => (
  <Text style={{ fontSize: 15, fontWeight: '600', marginBottom: 8, color: darkMode ? '#FFFFFF' : '#111827' }}>{children}</Text>
);

const Chip = ({ active, children, onPress, darkMode }: { active: boolean; children: React.ReactNode; onPress: () => void; darkMode: boolean }) => (
  <Pressable onPress={onPress} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999, backgroundColor: active ? '#8B5CF6' : (darkMode ? '#374151' : '#E5E7EB') }}>
    <Text style={{ fontSize: 13, fontWeight: '600', color: active ? '#fff' : (darkMode ? '#D1D5DB' : '#111827') }}>{children}</Text>
  </Pressable>
);

const EmojiButton = ({ emoji, active, onPress }: { emoji: string; active: boolean; onPress: () => void }) => (
  <Pressable onPress={onPress} style={{ padding: 8, borderRadius: 12, backgroundColor: active ? '#D8B4FE' : 'transparent', transform: [{ scale: active ? 1.1 : 1 }] }}>
    <Text style={{ fontSize: 24 }}>{emoji}</Text>
  </Pressable>
);

const Input = ({ value, onChangeText, placeholder, multiline, style, darkMode }: { value: string; onChangeText: (t: string) => void; placeholder: string; multiline?: boolean; style?: any; darkMode: boolean }) => (
  <TextInput
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
    style={{ width:'100%', paddingHorizontal:16, paddingVertical:12, borderRadius:12, borderWidth:1, borderColor: darkMode ? '#4B5563' : '#E5E7EB', backgroundColor: darkMode ? '#374151' : '#F9FAFB', color: darkMode ? '#FFFFFF' : '#111827', fontSize: 15, ...(style || {}) }}
    multiline={multiline}
  />
);

  const handleSubmit = () => {
    let data = {};
    
    if (type === "food") {
      if (!foodText.trim()) return;
      data = { emoji: foodEmoji, text: foodText, type: foodType, time: "Just now", author: currentUserName };
    } else if (type === "activity") {
      if (!activityText.trim()) return;
      data = { emoji: activityEmoji, text: activityText, type: activityType, time: "Just now", author: currentUserName };
    } else if (type === "movie") {
      if (!musicArtist.trim() || !musicSong.trim()) return;
      data = { emoji: musicEmoji, title: musicSong, director: musicArtist, status: musicStatus, time: "Now", author: currentUserName };
    } else if (type === "shopping") {
      if (!shoppingItem.trim()) return;
      data = { emoji: shoppingEmoji, item: shoppingItem, store: shoppingStore, priority: shoppingPriority, author: currentUserName };
    } else if (type === "plan") {
      if (!planName.trim() || !planDate.trim()) return;
      data = { emoji: planEmoji, plan: planName, date: planDate, location: planLocation || "TBD", author: currentUserName };
    }
    
    onAdd(data);
    onClose();
  };

  const getTitle = () => {
    switch (type) {
      case "food": return "Add Food Vibe";
      case "activity": return "Add Activity";
      case "movie": return "Add Movie";
      case "shopping": return "Add to Wishlist";
      case "plan": return "Add Plan";
    }
  };

  return (
    <Modal transparent visible onRequestClose={onClose}>
      <Pressable style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'flex-end'}} onPress={onClose}>
        <View style={{margin:24,borderRadius:24,overflow:'hidden',maxHeight:Dimensions.get('window').height * 0.9,backgroundColor:darkMode?'#1F2937':'#FFFFFF'}}>
          <LinearGradient colors={['#8B5CF6','#EC4899']} style={{paddingHorizontal:24,paddingVertical:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Plus size={24} color="#fff" />
            <Text style={{color:'#fff',fontSize:20,fontWeight:'700',marginLeft:8}}>{getTitle()}</Text>
          </View>
          <Pressable onPress={onClose} hitSlop={8}><X size={24} color="#fff" /></Pressable>
        </LinearGradient>

        <ScrollView contentContainerStyle={{padding:16}}>
          {/* Food Form */}
          {type === "food" && (
            <View>
              <Label darkMode={darkMode}>Pick an emoji:</Label>
              <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>
                {foodEmojis.map((emoji) => (
                  <EmojiButton key={emoji} emoji={emoji} active={foodEmoji===emoji} onPress={() => setFoodEmoji(emoji)} />
                ))}
              </View>
              <Label darkMode={darkMode}>What's the vibe?</Label>
              <Input value={foodText} onChangeText={setFoodText} placeholder="Pizza night is calling our names..." multiline style={{minHeight:96}} darkMode={darkMode} />
              <Label darkMode={darkMode}>Type:</Label>
              <View style={{flexDirection:'row',gap:8}}>
                {["craving","plan","memory"].map((t) => (
                  <Chip key={t} active={foodType===t} onPress={() => setFoodType(t)} darkMode={darkMode}>{t}</Chip>
                ))}
              </View>
            </View>
          )}

          {/* Activity Form */}
          {type === "activity" && (
            <View>
              <Label darkMode={darkMode}>Pick an emoji:</Label>
              <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>
                {activityEmojis.map((emoji) => (
                  <EmojiButton key={emoji} emoji={emoji} active={activityEmoji===emoji} onPress={() => setActivityEmoji(emoji)} />
                ))}
              </View>
              <Label darkMode={darkMode}>What's happening?</Label>
              <Input value={activityText} onChangeText={setActivityText} placeholder="Movie marathon this weekend??" multiline style={{minHeight:96}} darkMode={darkMode} />
              <Label darkMode={darkMode}>Type:</Label>
              <View style={{flexDirection:'row',gap:8}}>
                {["idea","upcoming","memory"].map((t) => (
                  <Chip key={t} active={activityType===t} onPress={() => setActivityType(t)} darkMode={darkMode}>{t}</Chip>
                ))}
              </View>
            </View>
          )}

          {/* Movie Form */}
          {type === "movie" && (
            <View>
              <Label darkMode={darkMode}>Pick an emoji:</Label>
              <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>
                {musicEmojis.map((emoji) => (
                  <EmojiButton key={emoji} emoji={emoji} active={musicEmoji===emoji} onPress={() => setMusicEmoji(emoji)} />
                ))}
              </View>
              <Label darkMode={darkMode}>Title:</Label>
              <Input value={musicSong} onChangeText={setMusicSong} placeholder="Barbie" darkMode={darkMode} />
              <Label darkMode={darkMode}>Director or Platform:</Label>
              <Input value={musicArtist} onChangeText={setMusicArtist} placeholder="Greta Gerwig or Netflix" darkMode={darkMode} />
              <Label darkMode={darkMode}>Status:</Label>
              <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>
                {["watching","to watch","rewatch","favorite"].map((s) => (
                  <Chip key={s} active={musicStatus===s} onPress={() => setMusicStatus(s)} darkMode={darkMode}>{s}</Chip>
                ))}
              </View>
            </View>
          )}

          {/* Shopping Form */}
          {type === "shopping" && (
            <View>
              <Label darkMode={darkMode}>Pick an emoji:</Label>
              <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>
                {shoppingEmojis.map((emoji) => (
                  <EmojiButton key={emoji} emoji={emoji} active={shoppingEmoji===emoji} onPress={() => setShoppingEmoji(emoji)} />
                ))}
              </View>
              <Label darkMode={darkMode}>What do you want?</Label>
              <Input value={shoppingItem} onChangeText={setShoppingItem} placeholder="That dress from the mall" darkMode={darkMode} />
              <Label darkMode={darkMode}>Store (optional):</Label>
              <Input value={shoppingStore} onChangeText={setShoppingStore} placeholder="Zara" darkMode={darkMode} />
              <Label darkMode={darkMode}>Priority:</Label>
              <View style={{flexDirection:'row',gap:8}}>
                {["want","need","obsessed"].map((p) => (
                  <Chip key={p} active={shoppingPriority===p} onPress={() => setShoppingPriority(p)} darkMode={darkMode}>{p}</Chip>
                ))}
              </View>
            </View>
          )}

          {/* Plan Form */}
          {type === "plan" && (
            <View>
              <Label darkMode={darkMode}>Pick an emoji:</Label>
              <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>
                {planEmojis.map((emoji) => (
                  <EmojiButton key={emoji} emoji={emoji} active={planEmoji===emoji} onPress={() => setPlanEmoji(emoji)} />
                ))}
              </View>
              <Label darkMode={darkMode}>Plan name:</Label>
              <Input value={planName} onChangeText={setPlanName} placeholder="Coffee catch-up" darkMode={darkMode} />
              <Label darkMode={darkMode}>Date & Time:</Label>
              <Input value={planDate} onChangeText={setPlanDate} placeholder="Tomorrow 2pm" darkMode={darkMode} />
              <Label darkMode={darkMode}>Location (optional):</Label>
              <Input value={planLocation} onChangeText={setPlanLocation} placeholder="Starbucks" darkMode={darkMode} />
            </View>
          )}

          {/* Submit Button */}
          <View style={{ marginTop: 16 }}>
            <Button onPress={handleSubmit} style={{ height: 48, borderRadius: 9999, backgroundColor: '#8B5CF6' }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Add to Vibes ✨</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    </Pressable>
  </Modal>
  );
}
