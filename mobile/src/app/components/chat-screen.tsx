import React, { useEffect, useState, useRef } from "react";
import EmojiPicker from 'rn-emoji-keyboard';
import { View, Text, FlatList, TextInput, Pressable, Share, Image, Alert, Modal } from "react-native";
import { Send, Smile, Image as ImageIcon, Gift, Heart, Reply, Edit, Trash, Copy, Pin, CheckSquare, X, Mic, Phone } from "lucide-react-native";
import { getToken, fetchMessages, sendMessage, updateMessageReaction, restoreMessage, unpinAllMessages, editMessage, deleteMessage, pinMessage, sendSticker } from "../lib/api";
import { Audio } from "expo-av";
import { CallScreen } from "./call-screen";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from 'expo-secure-store';

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  createdAt: string;
  timestamp: string;
  reaction?: string;
  pinned?: boolean;
  replyToId?: string | null;
  replyTo?: { id: string; text: string; sender: "me" | "them" };
  editedAt?: string;
}

const sampleMessages: Message[] = [];

const emojiPack: Record<string, string[]> = {
  Smileys: ["😀","😁","😂","🤣","😊","😍","😘","😜","🤗","🥹"],
  Gestures: ["👍","👎","👏","🙏","✌️","👌","🤌","🙌","💪","🫶"],
  Hearts: ["❤️","🩷","💛","💚","💙","💜","🖤","🤍","❤️‍🔥","💖"],
  Animals: ["🐶","🐱","🐻","🐼","🐨","🐯","🐷","🐸","🦄","🐥"],
  Food: ["🍎","🍓","🍍","🍔","🍟","🍕","🌮","🍣","🍜","🧋"],
  Activities: ["🎉","🎁","🎂","🎶","🎸","🎮","🏀","⚽️","🏖️","✈️"],
  Objects: ["📸","📱","💻","⌚️","🎧","🧸","🌸","🌙","⭐️","🌈"],
  Symbols: ["✨","🔥","💥","⚡️","✅","❌","♾️","™️","©️","®️"],
};
const stickerPack: string[] = ["❤️‍🔥","💖✨","🎉🥳","🌈✨","🐶💗","☕️💬","📸✨","🎶💃","🏖️🌞","🧋💗","💪🔥","🫶✨"];

interface ChatScreenProps { darkMode: boolean }
export function ChatScreen({ darkMode }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState<string>('Smileys');
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const playersRef = useRef<Map<string, Audio.Sound>>(new Map());
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [skinTone, setSkinTone] = useState<string>("");
  const [showCall, setShowCall] = useState(false);
  const SKIN_TONES = ["", "🏻", "🏼", "🏽", "🏾", "🏿"];

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) { setMessages([]); return; }
        const serverMsgs = await fetchMessages(token, { limit: 50 });
        if (Array.isArray(serverMsgs)) {
          const formatted: Message[] = serverMsgs.map(m => {
            const createdAtISO = (m as any).createdAt ?? new Date().toISOString();
            const timeLabel = (m as any).timestamp ?? new Date(createdAtISO).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            const replyTo = (m as any).replyTo ? { id: String((m as any).replyTo.id), text: (m as any).replyTo.text, sender: (m as any).replyTo.sender } : undefined;
            return { id: String((m as any).id), text: (m as any).text, sender: (m as any).sender, createdAt: createdAtISO, timestamp: timeLabel, reaction: (m as any).reaction, pinned: (m as any).pinned, replyToId: (m as any).replyToId, replyTo, editedAt: (m as any).editedAt };
          });
          setMessages(formatted);
        }
      } catch { setMessages([]); }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync('emojiRecents');
      if (stored) { try { setRecentEmojis(JSON.parse(stored)); } catch {} }
    })();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const nowLabel = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    try {
      const token = await getToken();
      if (token) {
        if (editingId) {
          const updated = await editMessage(token, editingId, inputText.trim());
          setMessages(prev => prev.map(m => m.id === editingId ? { ...m, text: (updated as any)?.text ?? inputText.trim(), editedAt: (updated as any)?.editedAt ?? new Date().toISOString() } : m));
          setEditingId(null);
        } else {
          const sent = await sendMessage(token, inputText.trim(), replyTo?.id || undefined);
          const createdAtISO = (sent as any).createdAt ?? new Date().toISOString();
          const timeLabel = (sent as any).timestamp ?? new Date(createdAtISO).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          setMessages(prev => [...prev, { id: String((sent as any).id), text: (sent as any).text, sender: (sent as any).sender, createdAt: createdAtISO, timestamp: timeLabel, reaction: (sent as any).reaction, replyToId: (sent as any).replyToId, pinned: (sent as any).pinned }]);
        }
      } else {
        setMessages(prev => [...prev, { id: String(prev.length + 1), text: inputText.trim(), sender: 'me', createdAt: new Date().toISOString(), timestamp: nowLabel }]);
      }
    } catch {
      setMessages(prev => [...prev, { id: String(prev.length + 1), text: inputText.trim(), sender: 'me', createdAt: new Date().toISOString(), timestamp: nowLabel }]);
    }
    setInputText("");
    setReplyTo(null);
    setActiveMessageId(null);
    setShowEmojiPicker(false);
    setShowStickerPicker(false);
  };



  const handleStartRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) return;
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
      setIsRecording(true);
    } catch {}
  };

  const handleStopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsRecording(false);
      setRecording(null);
      if (!uri) return;
      const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      if (!cloudName || !uploadPreset) { Alert.alert('Upload not configured', 'Set Cloudinary env variables.'); return; }
      setUploadingAudio(true);
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
      const form = new FormData();
      form.append('file', { uri, name: `voice.m4a`, type: 'audio/m4a' } as any);
      form.append('upload_preset', uploadPreset);
      const resp = await fetch(uploadUrl, { method: 'POST', body: form as any });
      const data = await resp.json();
      if (data.secure_url) {
        const token = await getToken();
        if (token) {
          const sent = await sendMessage(token, data.secure_url, (replyTo as any)?.id || undefined);
          const createdAtISO = (sent as any).createdAt ?? new Date().toISOString();
          const timeLabel = (sent as any).timestamp ?? new Date(createdAtISO).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          setMessages(prev => [...prev, { id: String((sent as any).id), text: (sent as any).text, sender: (sent as any).sender, createdAt: createdAtISO, timestamp: timeLabel, pinned: (sent as any).pinned, replyToId: (sent as any).replyToId }]);
        }
      } else {
        Alert.alert('Upload failed', data.error?.message || 'Unknown error');
      }
    } catch {}
    setUploadingAudio(false);
    setShowVoiceRecorder(false);
    setReplyTo(null);
  };

  const togglePlayAudio = async (id: string, url: string) => {
    try {
      const existing = playersRef.current.get(id);
      if (existing) {
        const status: any = await existing.getStatusAsync();
        if (status.isPlaying) {
          await existing.pauseAsync();
          setPlayingId(null);
        } else {
          await existing.playAsync();
          setPlayingId(id);
        }
        return;
      }
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      playersRef.current.set(id, sound);
      sound.setOnPlaybackStatusUpdate(async (s: any) => {
        if (s.didJustFinish || s.isLoaded === false) {
          try { await sound.unloadAsync(); } catch {}
          playersRef.current.delete(id);
          setPlayingId(null);
        }
      });
      await sound.playAsync();
      setPlayingId(id);
    } catch {}
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

  const handleSendSticker = async (sticker: string) => {
    try {
      const token = await getToken();
      if (token) {
        const sent = await sendSticker(token, sticker, (replyTo as any)?.id || undefined);
        const createdAtISO = (sent as any).createdAt ?? new Date().toISOString();
        const timeLabel = (sent as any).timestamp ?? new Date(createdAtISO).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        setMessages(prev => [...prev, { id: String((sent as any).id), text: (sent as any).text, sender: (sent as any).sender, createdAt: createdAtISO, timestamp: timeLabel, pinned: (sent as any).pinned, replyToId: (sent as any).replyToId, replyTo: (sent as any).replyTo }]);
      } else {
        setInputText(inputText + sticker);
      }
    } catch {
      setInputText(inputText + sticker);
    }
    setShowStickerPicker(false);
    setReplyTo(null);
  };

  const handlePickMedia = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 0.9 });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset) return;
      const resType = asset.type === 'video' ? 'video' : 'image';
      const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      if (!cloudName || !uploadPreset) { Alert.alert('Upload not configured', 'Set Cloudinary env variables.'); return; }
      setUploadingMedia(true);
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resType}/upload`;
      const form = new FormData();
      form.append('file', { uri: asset.uri, name: asset.fileName || `chat.${(asset.uri.split('.').pop() || (resType === 'image' ? 'jpg' : 'mp4'))}`, type: asset.mimeType || (resType === 'image' ? 'image/jpeg' : 'video/mp4') } as any);
      form.append('upload_preset', uploadPreset);
      const resp = await fetch(uploadUrl, { method: 'POST', body: form as any });
      const data = await resp.json();
      if (data.secure_url) {
        const token = await getToken();
        if (token) {
          const sent = await sendMessage(token, data.secure_url, (replyTo as any)?.id || undefined);
          const createdAtISO = (sent as any).createdAt ?? new Date().toISOString();
          const timeLabel = (sent as any).timestamp ?? new Date(createdAtISO).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          setMessages(prev => [...prev, { id: String((sent as any).id), text: (sent as any).text, sender: (sent as any).sender, createdAt: createdAtISO, timestamp: timeLabel, pinned: (sent as any).pinned, replyToId: (sent as any).replyToId }]);
        } else {
          setInputText(prev => prev + data.secure_url);
        }
      } else {
        Alert.alert('Upload failed', data.error?.message || 'Unknown error');
      }
    } catch {}
    setUploadingMedia(false);
    setShowMediaPicker(false);
    setReplyTo(null);
  };

  const handleCaptureMedia = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return;
      const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 0.9 });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset) return;
      const resType = asset.type === 'video' ? 'video' : 'image';
      const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      if (!cloudName || !uploadPreset) { Alert.alert('Upload not configured', 'Set Cloudinary env variables.'); return; }
      setUploadingMedia(true);
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resType}/upload`;
      const form = new FormData();
      form.append('file', { uri: asset.uri, name: asset.fileName || `chat.${(asset.uri.split('.').pop() || (resType === 'image' ? 'jpg' : 'mp4'))}`, type: asset.mimeType || (resType === 'image' ? 'image/jpeg' : 'video/mp4') } as any);
      form.append('upload_preset', uploadPreset);
      const resp = await fetch(uploadUrl, { method: 'POST', body: form as any });
      const data = await resp.json();
      if (data.secure_url) {
        const token = await getToken();
        if (token) {
          const sent = await sendMessage(token, data.secure_url, (replyTo as any)?.id || undefined);
          const createdAtISO = (sent as any).createdAt ?? new Date().toISOString();
          const timeLabel = (sent as any).timestamp ?? new Date(createdAtISO).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          setMessages(prev => [...prev, { id: String((sent as any).id), text: (sent as any).text, sender: (sent as any).sender, createdAt: createdAtISO, timestamp: timeLabel, pinned: (sent as any).pinned, replyToId: (sent as any).replyToId }]);
        } else {
          setInputText(prev => prev + data.secure_url);
        }
      } else {
        Alert.alert('Upload failed', data.error?.message || 'Unknown error');
      }
    } catch {}
    setUploadingMedia(false);
    setShowMediaPicker(false);
    setReplyTo(null);
  };

  const handleTogglePin = async (messageId: string, current: boolean) => {
    try {
      const token = await getToken();
      if (token) {
        const res = await pinMessage(token, messageId, !current);
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, pinned: (res as any).pinned } : m));
      } else {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, pinned: !current } : m));
      }
    } catch {}
  };

  const handleStartEdit = (m: Message) => { setEditingId(m.id); setInputText(m.text); };

  const handleDelete = async (messageId: string) => {
    try {
      const token = await getToken();
      if (token) await deleteMessage(token, messageId);
    } catch {}
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  const handleCopy = async (text: string) => { try { await Share.share({ message: text }); } catch {} };
  const handleStartReply = (m: Message) => setReplyTo(m);
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const groupedData = React.useMemo(() => {
    const items: Array<any> = [];
    let lastKey: string | null = null;
    const now = new Date();
    const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    const labelForDate = (d: Date) => {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (isSameDay(d, now)) return 'Today';
      if (isSameDay(d, yesterday)) return 'Yesterday';
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    };
    for (const msg of messages) {
      const d = new Date(msg.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (key !== lastKey) {
        items.push({ type: 'header', id: `header-${key}`, label: labelForDate(d) });
        lastKey = key;
      }
      items.push({ type: 'message', id: msg.id, data: msg });
    }
    return items;
  }, [messages]);

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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Heart size={24} color="#fff" fill="#fff" />
            <Pressable onPress={() => setShowCall(true)} style={{ padding: 6, borderRadius: 9999, backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <Phone size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>

      {showCall && (
        <Modal transparent={false} visible onRequestClose={() => setShowCall(false)}>
          <CallScreen darkMode={darkMode} onClose={() => setShowCall(false)} onOpenVoiceNote={() => { setShowCall(false); setShowVoiceRecorder(true); }} />
        </Modal>
      )}

      <FlatList
        data={groupedData}
        keyExtractor={(it) => String(it.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
        renderItem={({ item }) => (
          item.type === 'header' ? (
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ backgroundColor: darkMode ? '#1F2937' : '#FFF1F2', color: darkMode ? '#FFFFFF' : '#111827', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999, borderWidth: 1, borderColor: darkMode ? '#4B5563' : '#FBCFE8', fontSize: 12, fontWeight: '600' }}>{item.label}</Text>
            </View>
          ) : (
            <Pressable onLongPress={() => setActiveMessageId(item.data.id)} style={{ alignItems: item.data.sender === "me" ? "flex-end" : "flex-start", marginBottom: 12 }}>
              <View style={{ maxWidth: '75%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, backgroundColor: item.data.sender === 'me' ? (darkMode ? '#7C3AED' : '#C44569') : (darkMode ? '#1F2937' : '#fff'), borderWidth: item.data.sender === 'me' ? 0 : 1, borderColor: darkMode ? '#4B5563' : '#FBCFE8' }}>
                {item.data.replyTo && (
                  <View style={{ marginBottom: 6, padding: 8, borderRadius: 8, backgroundColor: darkMode ? '#111827' : '#FFF7F9', borderWidth: 1, borderColor: darkMode ? '#374151' : '#FBCFE8' }}>
                    <Text style={{ color: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}>Replying to {item.data.replyTo.sender === 'me' ? 'you' : 'bestie'}</Text>
                    <Text numberOfLines={2} style={{ color: darkMode ? '#FFFFFF' : '#111827', fontSize: 12 }}>{item.data.replyTo.text}</Text>
                  </View>
                )}
                {/^https?:\/\/.*\.(png|jpg|jpeg|webp|gif)$/i.test(item.data.text) ? (
                  <Image source={{ uri: item.data.text }} style={{ width: 220, height: 220, borderRadius: 12 }} />
                ) : (/^https?:\/\/.*\.(m4a|aac|mp3|wav|ogg|caf)$/i.test(item.data.text) ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Pressable onPress={() => togglePlayAudio(item.data.id, item.data.text)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9999, backgroundColor: darkMode ? '#111827' : '#FFF7F9', borderWidth: 1, borderColor: darkMode ? '#374151' : '#FBCFE8' }}>
                      <Text style={{ color: darkMode ? '#FFFFFF' : '#111827', fontWeight: '600' }}>{playingId === item.data.id ? 'Pause' : 'Play'}</Text>
                    </Pressable>
                    <Text style={{ color: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}>Voice note</Text>
                  </View>
                ) : (
                  <Text style={{ color: item.data.sender === 'me' ? '#fff' : (darkMode ? '#FFFFFF' : '#111827'), fontSize: 15 }}>{item.data.text}</Text>
                ))}
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4, justifyContent: item.data.sender === "me" ? "flex-end" : "flex-start" }}>
                <Text style={{ color: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}>{item.data.timestamp}{item.data.editedAt ? " · edited" : ""}</Text>
                {item.data.pinned && (<Text style={{ color: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}>📌</Text>)}
                {item.data.reaction && (<Text style={{ fontSize: 16, backgroundColor: darkMode ? '#1F2937' : '#fff', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: darkMode ? '#4B5563' : '#FBCFE8', color: darkMode ? '#FFFFFF' : '#111827' }}>{item.data.reaction}</Text>)}
              </View>
              {activeMessageId === item.data.id && (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  <Pressable onPress={() => handleStartReply(item.data)} style={{ padding: 6, borderRadius: 12, backgroundColor: '#FFF1F2', borderWidth: 1, borderColor: '#FBCFE8' }}><Reply size={16} color="#EC4899" /></Pressable>
                  <Pressable onPress={() => handleCopy(item.data.text)} style={{ padding: 6, borderRadius: 12, backgroundColor: '#DBEAFE', borderWidth: 1, borderColor: '#93C5FD' }}><Copy size={16} color="#3B82F6" /></Pressable>
                  <Pressable onPress={() => handleTogglePin(item.data.id, !!item.data.pinned)} style={{ padding: 6, borderRadius: 12, backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FDE68A' }}><Pin size={16} color="#D97706" /></Pressable>
                  <Pressable onPress={() => handleToggleSelect(item.data.id)} style={{ padding: 6, borderRadius: 12, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#D1D5DB' }}><CheckSquare size={16} color={selectedIds.has(item.data.id) ? "#10B981" : "#6B7280"} /></Pressable>
                  {item.data.sender === 'me' && (<Pressable onPress={() => handleStartEdit(item.data)} style={{ padding: 6, borderRadius: 12, backgroundColor: '#EDE9FE', borderWidth: 1, borderColor: '#C4B5FD' }}><Edit size={16} color="#7C3AED" /></Pressable>)}
                  {item.data.sender === 'me' && (<Pressable onPress={() => handleDelete(item.data.id)} style={{ padding: 6, borderRadius: 12, backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FCA5A5' }}><Trash size={16} color="#EF4444" /></Pressable>)}
                  <Pressable onPress={() => setActiveMessageId(null)} style={{ padding: 6, borderRadius: 12, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#D1D5DB' }}><X size={16} color="#6B7280" /></Pressable>
                </View>
              )}
            </Pressable>
          )
        )}
      />

      <View style={{ borderTopWidth: 1, borderTopColor: "#FBCFE8", backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 12 }}>
        {/* Selection / bulk actions toolbar */}
        {selectedIds.size > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: '#6B7280', fontSize: 12 }}>{selectedIds.size} selected</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable onPress={async () => { const token = await getToken(); for (const id of Array.from(selectedIds)) { try { if (token) await deleteMessage(token, id); } catch {} } setMessages(prev => prev.filter(m => !selectedIds.has(m.id))); setSelectedIds(new Set()); }} style={{ padding: 6, borderRadius: 8, backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FCA5A5' }}><Trash size={16} color="#EF4444" /></Pressable>
              <Pressable onPress={async () => { const token = await getToken(); for (const id of Array.from(selectedIds)) { try { if (token) await pinMessage(token, id, true); } catch {} } setMessages(prev => prev.map(m => selectedIds.has(m.id) ? { ...m, pinned: true } : m)); setSelectedIds(new Set()); }} style={{ padding: 6, borderRadius: 8, backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FDE68A' }}><Pin size={16} color="#D97706" /></Pressable>
              <Pressable onPress={async () => { const token = await getToken(); if (token) await unpinAllMessages(token); setMessages(prev => prev.map(m => ({ ...m, pinned: false }))); }} style={{ padding: 6, borderRadius: 8, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#D1D5DB' }}><Text style={{ color: '#6B7280', fontSize: 12 }}>Unpin all</Text></Pressable>
              <Pressable onPress={() => setSelectedIds(new Set())} style={{ padding: 6, borderRadius: 8 }}><X size={16} color="#6B7280" /></Pressable>
            </View>
          </View>
        )}
        {showEmojiPicker && (
          <View style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Text style={{ color: '#6B7280', fontSize: 12 }}>Skin tone</Text>
              {SKIN_TONES.map((t) => (
                <Pressable key={t || 'default'} onPress={() => setSkinTone(t)} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9999, backgroundColor: skinTone === t ? '#FCE7F3' : '#fff', borderWidth: 1, borderColor: '#FBCFE8' }}>
                  <Text style={{ fontSize: 14 }}>{t || 'Default'}</Text>
                </Pressable>
              ))}
            </View>
            {recentEmojis.length > 0 && (
              <View style={{ marginBottom: 8 }}>
                <Text style={{ color: '#6B7280', fontSize: 12, marginBottom: 4 }}>Recents</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {recentEmojis.map((e) => (
                    <Pressable key={e} onPress={() => { const chosen = skinTone ? e + skinTone : e; setInputText((prev) => prev + chosen); setShowEmojiPicker(false); }} style={{ backgroundColor: '#fff', borderRadius: 8, padding: 8 }}>
                      <Text style={{ fontSize: 22 }}>{e}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
        <EmojiPicker
          open={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onEmojiSelected={async (emoji) => { const base = emoji.emoji; const chosen = skinTone ? base + skinTone : base; setInputText((prev) => prev + chosen); setShowEmojiPicker(false); setRecentEmojis((prev) => { const next = [base, ...prev.filter(e => e !== base)].slice(0, 24); SecureStore.setItemAsync('emojiRecents', JSON.stringify(next)); return next; }); }}
          enableSearchBar
          categoryPosition="top"
        />
        {showStickerPicker && (
          <View style={{ marginBottom: 12, backgroundColor: "#FEF3C7", borderWidth: 1, borderColor: "#FDE68A", borderRadius: 16, padding: 12 }}>
            <Text style={{ color: "#6B7280", fontSize: 12, fontWeight: "600", marginBottom: 8 }}>Stickers</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {stickerPack.map((sticker) => (
                <Pressable key={sticker} onPress={() => { handleSendSticker(sticker); }} style={{ backgroundColor: "#fff", borderRadius: 8, padding: 8 }}>
                  <Text style={{ fontSize: 26 }}>{sticker}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        {showMediaPicker && (
          <View style={{ marginBottom: 12, backgroundColor: "#DBEAFE", borderWidth: 1, borderColor: "#93C5FD", borderRadius: 16, padding: 12 }}>
            <Text style={{ color: "#1F2937", fontSize: 12, fontWeight: "600", marginBottom: 8 }}>Add Media</Text>
            {uploadingMedia ? (
              <Text style={{ color: "#6B7280", fontSize: 12 }}>Uploading...</Text>
            ) : (
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pressable onPress={handlePickMedia} style={{ padding: 8, borderRadius: 12, backgroundColor: "#3B82F6" }}>
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Library</Text>
                </Pressable>
                <Pressable onPress={handleCaptureMedia} style={{ padding: 8, borderRadius: 12, backgroundColor: "#8B5CF6" }}>
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Camera</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
        {showVoiceRecorder && (
          <View style={{ marginBottom: 12, backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0", borderRadius: 16, padding: 12 }}>
            <Text style={{ color: "#065F46", fontSize: 12, fontWeight: "600", marginBottom: 8 }}>Voice note</Text>
            {uploadingAudio ? (
              <Text style={{ color: "#6B7280", fontSize: 12 }}>Uploading...</Text>
            ) : (
              <View style={{ flexDirection: "row", gap: 8 }}>
                {!isRecording ? (
                  <Pressable onPress={handleStartRecording} style={{ padding: 8, borderRadius: 12, backgroundColor: "#10B981" }}>
                    <Text style={{ color: "#fff", fontWeight: "600" }}>Record</Text>
                  </Pressable>
                ) : (
                  <Pressable onPress={handleStopRecording} style={{ padding: 8, borderRadius: 12, backgroundColor: "#F59E0B" }}>
                    <Text style={{ color: "#fff", fontWeight: "600" }}>Stop</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8 }}>
          <Pressable onPress={() => { setShowEmojiPicker(!showEmojiPicker); setShowStickerPicker(false); }} style={{ padding: 8, borderRadius: 16, backgroundColor: showEmojiPicker ? "#FCE7F3" : "transparent" }}>
            <Smile size={22} color="#EC4899" />
          </Pressable>
          <Pressable onPress={() => { setShowStickerPicker(!showStickerPicker); setShowEmojiPicker(false); }} style={{ padding: 8, borderRadius: 16, backgroundColor: showStickerPicker ? "#E9D5FF" : "transparent" }}>
            <Gift size={22} color="#8B5CF6" />
          </Pressable>
          <Pressable onPress={() => { setShowMediaPicker(!showMediaPicker); setShowEmojiPicker(false); setShowStickerPicker(false); }} style={{ padding: 8, borderRadius: 16, backgroundColor: showMediaPicker ? "#DBEAFE" : "transparent" }}>
            <ImageIcon size={22} color="#3B82F6" />
          </Pressable>
          <Pressable onPress={() => { setShowVoiceRecorder(!showVoiceRecorder); setShowEmojiPicker(false); setShowStickerPicker(false); setShowMediaPicker(false); }} style={{ padding: 8, borderRadius: 16, backgroundColor: showVoiceRecorder ? '#E5E7EB' : 'transparent' }}>
            <Mic size={22} color="#10B981" />
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