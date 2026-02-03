import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Pressable } from "react-native";
import { Send, Smile, Image as ImageIcon, Gift, Heart } from "lucide-react-native";
import { getToken, fetchMessages, sendMessage, updateMessageReaction } from "../lib/api";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: string;
  reaction?: string;
}

const sampleMessages: Message[] = [];

const quickEmojis = ["❤️", "😂", "😭", "💀", "✨", "🔥", "💅", "👑"];
const quickStickers = ["🎉", "🌟", "💕", "🦋", "🌈", "☀️", "🌙", "⚡"];

interface ChatScreenProps { darkMode: boolean }
export function ChatScreen({ darkMode }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) { setMessages([]); return; }
        const serverMsgs = await fetchMessages(token, { limit: 50 });
        if (Array.isArray(serverMsgs)) {
          const formatted: Message[] = serverMsgs.map(m => ({ id: String(m.id), text: m.text, sender: m.sender, timestamp: new Date(m.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), reaction: m.reaction }));
          setMessages(formatted);
        }
      } catch { setMessages([]); }
    })();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const nowLabel = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    try {
      const token = await getToken();
      if (token) {
        const sent = await sendMessage(token, inputText.trim());
        setMessages(prev => [...prev, { id: String(sent.id), text: sent.text, sender: sent.sender, timestamp: new Date(sent.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }]);
      } else {
        setMessages(prev => [...prev, { id: String(prev.length + 1), text: inputText.trim(), sender: 'me', timestamp: nowLabel }]);
      }
    } catch {
      setMessages(prev => [...prev, { id: String(prev.length + 1), text: inputText.trim(), sender: 'me', timestamp: nowLabel }]);
    }
    setInputText("");
    setShowEmojiPicker(false);
    setShowStickerPicker(false);
  };



  const handleAddReaction = async (messageId: string, emoji: string) => {
    setMessages(prev => prev.map((msg) => (
      msg.id === messageId ? { ...msg, reaction: emoji } : msg
    )));
    try {
      const token = await getToken();
      if (token) await updateMessageReaction(token, messageId, emoji);
    } catch {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#FDF2F8', paddingBottom: 96 }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: darkMode ? '#374151' : '#C44569' }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 40, height: 40, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#fff", fontSize: 18 }}>💕</Text>
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "600" }}>Kemmie</Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>Your bestie ✨</Text>
            </View>
          </View>
          <Heart size={24} color="#fff" fill="#fff" />
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(m) => String(m.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
        renderItem={({ item }) => (
          <View style={{ alignItems: item.sender === "me" ? "flex-end" : "flex-start", marginBottom: 12 }}>
            <View style={{ maxWidth: '75%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, backgroundColor: item.sender === 'me' ? (darkMode ? '#7C3AED' : '#C44569') : (darkMode ? '#1F2937' : '#fff'), borderWidth: item.sender === 'me' ? 0 : 1, borderColor: darkMode ? '#4B5563' : '#FBCFE8' }}>
              <Text style={{ color: item.sender === 'me' ? '#fff' : (darkMode ? '#FFFFFF' : '#111827'), fontSize: 15 }}>{item.text}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4, justifyContent: item.sender === "me" ? "flex-end" : "flex-start" }}>
              <Text style={{ color: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}>{item.timestamp}</Text>
              {item.reaction && (<Text style={{ fontSize: 16, backgroundColor: darkMode ? '#1F2937' : '#fff', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: darkMode ? '#4B5563' : '#FBCFE8', color: darkMode ? '#FFFFFF' : '#111827' }}>{item.reaction}</Text>)}
            </View>
          </View>
        )}
      />

      <View style={{ borderTopWidth: 1, borderTopColor: "#FBCFE8", backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 12 }}>
        {showEmojiPicker && (
          <View style={{ marginBottom: 12, backgroundColor: "#FFF1F2", borderWidth: 1, borderColor: "#FBCFE8", borderRadius: 16, padding: 12 }}>
            <Text style={{ color: "#6B7280", fontSize: 12, fontWeight: "600", marginBottom: 8 }}>Quick Emojis</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {quickEmojis.map((emoji) => (
                <Pressable key={emoji} onPress={() => { setInputText(inputText + emoji); setShowEmojiPicker(false); }} style={{ backgroundColor: "#fff", borderRadius: 8, padding: 8 }}>
                  <Text style={{ fontSize: 22 }}>{emoji}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        {showStickerPicker && (
          <View style={{ marginBottom: 12, backgroundColor: "#FEF3C7", borderWidth: 1, borderColor: "#FDE68A", borderRadius: 16, padding: 12 }}>
            <Text style={{ color: "#6B7280", fontSize: 12, fontWeight: "600", marginBottom: 8 }}>Stickers</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {quickStickers.map((sticker) => (
                <Pressable key={sticker} onPress={() => { setInputText(inputText + sticker); setShowStickerPicker(false); }} style={{ backgroundColor: "#fff", borderRadius: 8, padding: 8 }}>
                  <Text style={{ fontSize: 24 }}>{sticker}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8 }}>
          <Pressable onPress={() => { setShowEmojiPicker(!showEmojiPicker); setShowStickerPicker(false); }} style={{ padding: 8, borderRadius: 16, backgroundColor: showEmojiPicker ? "#FCE7F3" : "transparent" }}>
            <Smile size={22} color="#EC4899" />
          </Pressable>
          <Pressable onPress={() => { setShowStickerPicker(!showStickerPicker); setShowEmojiPicker(false); }} style={{ padding: 8, borderRadius: 16, backgroundColor: showStickerPicker ? "#E9D5FF" : "transparent" }}>
            <Gift size={22} color="#8B5CF6" />
          </Pressable>
          <Pressable style={{ padding: 8, borderRadius: 16 }}>
            <ImageIcon size={22} color="#3B82F6" />
          </Pressable>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: darkMode ? '#4B5563' : '#FBCFE8', borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: darkMode ? '#1F2937' : '#FFF1F2' }}>
            <TextInput value={inputText} onChangeText={setInputText} placeholder="Type something..." placeholderTextColor="#9CA3AF" style={{ flex: 1, color: darkMode ? '#FFFFFF' : '#111827', fontSize: 15 }} onSubmitEditing={handleSend} />
          </View>
          <Pressable onPress={handleSend} disabled={!inputText.trim()} style={{ padding: 10, borderRadius: 20, backgroundColor: inputText.trim() ? (darkMode ? '#7C3AED' : '#C44569') : (darkMode ? '#4B5563' : '#E5E7EB') }}>
            <Send size={20} color={inputText.trim() ? "#fff" : "#9CA3AF"} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}