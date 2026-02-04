import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'https://kemmie.onrender.com',
  timeout: 10000
});

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync('accessToken');
}

export async function fetchIdentityNames(token: string): Promise<{ currentUserName: string; bestieName: string }> {
  const res = await api.get('/identity/names', { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}

export async function fetchVibeCheckSummary(token: string): Promise<Array<{ author: string; mood: string; text: string; time: string }>> {
  const res = await api.get('/vibe-check/today/summary', { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}

export async function recordVibeCheck(token: string, moodLabel: string, content?: string): Promise<void> {
  await api.post('/vibe-check', { moodLabel, content }, { headers: { Authorization: `Bearer ${token}` } });
}

export async function fetchVibes(token: string, params?: { category?: string; authorName?: string; limit?: number; cursor?: string }) {
  const res = await api.get('/vibes', { headers: { Authorization: `Bearer ${token}` }, params });
  return res.data;
}

export async function addVibe(token: string, category: string, data: any): Promise<void> {
  await api.post('/vibes', { category, data }, { headers: { Authorization: `Bearer ${token}` } });
}

export async function fetchHomeSummary(token: string) {
  const res = await api.get('/home/summary', { headers: { Authorization: `Bearer ${token}` } });
  return res.data as {
    currentUserName: string;
    bestieName: string;
    streak: number;
    messagesCount: number;
    memoriesCount: number;
    todayVibeCheck: any[];
    relationshipAgeDays: number;
    lastActiveSeconds: number;
    nextBirthday: { name: string; daysToGo: number } | null;
  };};

export async function fetchStreakSummary(token: string) {
  const res = await api.get('/streaks/summary', { headers: { Authorization: `Bearer ${token}` } });
  return res.data as { streakDays: number; bestStreakDays: number; week: boolean[]; lastActiveSeconds: number };
}

export async function fetchAchievements(token: string) {
  const res = await api.get('/achievements', { headers: { Authorization: `Bearer ${token}` } });
  return res.data as Array<{ key: string; title: string; description: string; icon: string; unlocked: boolean; remainingDays: number }>;
}

export async function fetchMemories(token: string, params?: { type?: 'PHOTO' | 'VIDEO'; favorite?: boolean; limit?: number; cursor?: string }) {
  const res = await api.get('/memories', { headers: { Authorization: `Bearer ${token}` } , params });
  return res.data as Array<{ id: string; url: string; type: 'PHOTO' | 'VIDEO'; createdAt: string; favorite: boolean }>;
}

export async function fetchMessages(token: string, params?: { limit?: number; cursor?: string }) {
  const res = await api.get('/chat/messages', { headers: { Authorization: `Bearer ${token}` }, params });
  return res.data as Array<{ id: string; text: string; sender: 'me' | 'them'; createdAt: string; timestamp: string; pinned?: boolean; replyToId?: string | null; editedAt?: string | undefined; replyTo?: { id: string; text: string; sender: 'me' | 'them' } }>;
}

export async function sendMessage(token: string, text: string, replyToId?: string) {
  const res = await api.post('/chat/messages', { content: text, type: 'TEXT', replyToId }, { headers: { Authorization: `Bearer ${token}` } });
  return res.data as { id: string; text: string; sender: 'me' | 'them'; createdAt: string; timestamp: string; pinned?: boolean; replyToId?: string | null; replyTo?: { id: string; text: string; sender: 'me' | 'them' } };
}

export async function sendSticker(token: string, sticker: string, replyToId?: string) {
  const res = await api.post('/chat/messages', { content: sticker, type: 'STICKER', replyToId }, { headers: { Authorization: `Bearer ${token}` } });
  return res.data as { id: string; text: string; sender: 'me' | 'them'; createdAt: string; timestamp: string; pinned?: boolean; replyToId?: string | null; replyTo?: { id: string; text: string; sender: 'me' | 'them' } };
}

export async function updateMessageReaction(token: string, id: string, reaction: string) {
  const res = await api.post('/chat/reactions', { messageId: id, value: reaction }, { headers: { Authorization: `Bearer ${token}` } });
  return res.data as { id: string; messageId: string; userId: string; value: string };
}

export async function editMessage(token: string, id: string, content: string) {
  const res = await api.patch(`/chat/messages/${id}`, { content }, { headers: { Authorization: `Bearer ${token}` } });
  return res.data as { id: string; text: string; editedAt?: string };
}

export async function deleteMessage(token: string, id: string) {
  const res = await api.delete(`/chat/messages/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data as { id: string };
}

export async function pinMessage(token: string, id: string, pinned: boolean) {
  const res = await api.patch(`/chat/messages/${id}/pin`, { pinned }, { headers: { Authorization: `Bearer ${token}` } });
  return res.data as { id: string; pinned: boolean };
}

export async function restoreMessage(token: string, id: string) {
  const res = await api.patch(`/chat/messages/${id}/restore`, {}, { headers: { Authorization: `Bearer ${token}` } });
  return res.data as { id: string };
}

export async function unpinAllMessages(token: string) {
  const res = await api.patch('/chat/messages/unpin-all', {}, { headers: { Authorization: `Bearer ${token}` } });
  return res.data as { count: number };
}

export async function addMemory(token: string, type: 'PHOTO' | 'VIDEO', url: string, mimeType?: string) {
  const res = await api.post('/memories', { type, url, mimeType }, { headers: { Authorization: `Bearer ${token}` } });
  return res.data as { id: string; url: string; type: 'PHOTO' | 'VIDEO'; createdAt: string; favorite: boolean };
}

export async function updateMemoryFavorite(token: string, id: string, favorite: boolean) {
  const res = await api.patch(`/memories/${id}/favorite`, { favorite }, { headers: { Authorization: `Bearer ${token}` } });
  return res.data as { id: string; favorite: boolean };
}

export async function deleteMemory(token: string, id: string) {
  await api.delete(`/memories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
}

export async function fetchMemoriesStats(token: string) {
  const res = await api.get('/memories/stats', { headers: { Authorization: `Bearer ${token}` } });
  return res.data as { photos: number; videos: number; total: number; favorites: number };
}

export async function updateNotificationSettings(token: string, settings: { messages?: boolean; streaks?: boolean; memories?: boolean; homeVibeShares?: boolean; vibeAdds?: boolean; memoryAdds?: boolean }) {
  await api.patch('/settings/notifications', settings, { headers: { Authorization: `Bearer ${token}` } });
}

export async function updatePreferences(token: string, prefs: { darkMode?: boolean; selectedTheme?: string }) {
  await api.patch('/settings/preferences', prefs, { headers: { Authorization: `Bearer ${token}` } });
}

export async function updateProfile(token: string, data: { name?: string; bio?: string; avatarUrl?: string }) {
  await api.patch('/identity/profile', data, { headers: { Authorization: `Bearer ${token}` } });
}

export async function removeBestie(token: string) {
  await api.delete('/bestie', { headers: { Authorization: `Bearer ${token}` } });
}

export async function updatePushToken(token: string, expoPushToken: string) {
  await api.patch('/settings/push-token', { expoPushToken }, { headers: { Authorization: `Bearer ${token}` } });
}

export async function signInWithGoogle(idToken: string): Promise<string> {
  const res = await api.post('/auth/google/mobile', { idToken }, { headers: { 'Content-Type': 'application/json' } });
  const accessToken = res.data?.accessToken;
  if (accessToken) {
    await SecureStore.setItemAsync('accessToken', accessToken);
  }
  return accessToken;
}