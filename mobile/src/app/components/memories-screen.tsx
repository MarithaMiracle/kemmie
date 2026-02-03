import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, FlatList, Image, Modal, ActivityIndicator, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Video, Heart, Calendar, X } from "lucide-react-native";
import { getToken, fetchMemoriesStats, fetchMemories, updateMemoryFavorite, deleteMemory } from '../lib/api';
import { AddMemoryModal } from './add-memory-modal';

interface MemoriesScreenProps { darkMode: boolean; selectedTheme: string }
export function MemoriesScreen({ darkMode, selectedTheme }: MemoriesScreenProps) {
  const [stats, setStats] = useState<{ photos: number; videos: number; total: number; favorites: number }>({ photos: 0, videos: 0, total: 0, favorites: 0 });
  const [showAdd, setShowAdd] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [items, setItems] = useState<Array<{ id: string; url: string; type: 'PHOTO' | 'VIDEO'; createdAt: string; favorite: boolean }>>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PHOTO' | 'VIDEO'>('ALL');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [recent, setRecent] = useState<Array<{ id: string; url: string; type: 'PHOTO' | 'VIDEO'; createdAt: string; favorite: boolean }>>([]);
  const [selected, setSelected] = useState<{ id: string; url: string; type: 'PHOTO' | 'VIDEO'; createdAt: string; favorite: boolean } | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [monthlyGroups, setMonthlyGroups] = useState<Array<{ label: string; count: number }>>([]);
  const [lastLoadAt, setLastLoadAt] = useState<number | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const s = await fetchMemoriesStats(token);
        setStats(s);
        const initialRecent = await fetchMemories(token, { limit: 6 });
        setRecent(initialRecent);
        const all = await fetchMemories(token, { limit: 120 });
        const grouped: Record<string, { label: string; count: number }> = {};
        all.forEach(m => {
          const d = new Date(m.createdAt);
          const key = `${d.getFullYear()}-${d.getMonth()+1}`;
          const label = d.toLocaleString('en-US', { month: 'long' }) + ' ' + d.getFullYear();
          grouped[key] = { label, count: (grouped[key]?.count || 0) + 1 };
        });
        const groups = Object.entries(grouped).sort((a,b) => {
          const [ay, am] = a[0].split('-').map(Number);
          const [by, bm] = b[0].split('-').map(Number);
          return by - ay || bm - am;
        }).map(([_, v]) => v).slice(0, 3);
        setMonthlyGroups(groups);
      } catch {}
    })();
  }, []);

  useEffect(() => { if (showAll && items.length === 0) { loadMore(); } }, [showAll]);
  const itemsFiltered = items.filter(m => (filter === 'ALL' ? true : m.type === filter) && (!favoritesOnly || m.favorite));
  async function loadMore() {
    const now = Date.now();
    if ((lastLoadAt && now - lastLoadAt < 800) || !hasMore || loadingMore) return;
    setLastLoadAt(now);
    setLoadingMore(true);
    try {
      const token = await getToken();
      if (!token) { setLoadingMore(false); setHasMore(false); return; }
      const params: any = { limit: 30 };
      if (filter !== 'ALL') params.type = filter;
      if (favoritesOnly) params.favorite = true;
      if (cursor) params.cursor = cursor;
      const page = await fetchMemories(token, params);
      if (Array.isArray(page) && page.length) {
        setItems(prev => [...prev, ...page]);
        setCursor(page[page.length - 1].id);
        setHasMore(page.length === params.limit);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    }
    setLoadingMore(false);
  }

  async function toggleFavorite(id: string, nextFavorite: boolean) {
    try {
      const token = await getToken();
      if (!token) return;
      await updateMemoryFavorite(token, id, nextFavorite);
      setItems(prev => prev.map(m => m.id === id ? { ...m, favorite: nextFavorite } : m));
      setRecent(prev => prev.map(m => m.id === id ? { ...m, favorite: nextFavorite } : m));
      setSelected(sel => sel && sel.id === id ? { ...sel, favorite: nextFavorite } : sel);
      setStats(s => ({ ...s, favorites: s.favorites + (nextFavorite ? 1 : -1) }));
    } catch {}
  }

  async function deleteSelected() {
    if (!selected) return;
    Alert.alert('Delete memory?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          const token = await getToken();
          if (!token) return;
          await deleteMemory(token, selected.id);
          setItems(prev => prev.filter(m => m.id !== selected.id));
          setRecent(prev => prev.filter(m => m.id !== selected.id));
          setStats(s => ({
            ...s,
            photos: s.photos - (selected.type === 'PHOTO' ? 1 : 0),
            videos: s.videos - (selected.type === 'VIDEO' ? 1 : 0),
            favorites: s.favorites - (selected.favorite ? 1 : 0),
            total: s.total - 1
          }));
          setSelected(null);
        } catch {}
      } }
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#EEF2FF', paddingBottom: 96 }}>
      <LinearGradient colors={selectedTheme ? ({
        'pink-purple': ['#0F172A', '#111827'],
        'blue-purple': ['#111827', '#1F2937'],
        'pink-orange': ['#0F172A', '#1F2937'],
        'green-blue': ['#064E3B', '#0F172A'],
        'red-pink': ['#3F0D12', '#111827'],
        'purple-indigo': ['#1E1B4B', '#0F172A'],
      } as Record<string, string[]>)[selectedTheme] ?? (darkMode ? ['#374151', '#374151'] : ['#3B82F6', '#8B5CF6']) : (darkMode ? ['#374151', '#374151'] : ['#3B82F6', '#8B5CF6'])} style={{ paddingHorizontal: 24, paddingVertical: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <View style={{ alignItems: 'center' }}>
          <Camera size={36} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 8 }}>Memory Vault</Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>Your private collection 📸</Text>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, gap: 16 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: darkMode ? '#1F2937' : '#fff', borderRadius: 12, padding: 12, alignItems: 'center' }}>
            <Camera size={20} color="#3B82F6" />
            <Text style={{ fontSize: 18, fontWeight: '700' }}>{stats.photos}</Text>
            <Text style={{ fontSize: 11, color: '#6B7280' }}>Photos</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: darkMode ? '#1F2937' : '#fff', borderRadius: 12, padding: 12, alignItems: 'center' }}>
            <Video size={20} color="#8B5CF6" />
            <Text style={{ fontSize: 18, fontWeight: '700' }}>{stats.videos}</Text>
            <Text style={{ fontSize: 11, color: '#6B7280' }}>Videos</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: darkMode ? '#1F2937' : '#fff', borderRadius: 12, padding: 12, alignItems: 'center' }}>
            <Heart size={20} color="#EC4899" fill="#EC4899" />
            <Text style={{ fontSize: 18, fontWeight: '700' }}>{stats.favorites}</Text>
            <Text style={{ fontSize: 11, color: '#6B7280' }}>Favorites</Text>
          </View>
        </View>
        <Pressable onPress={() => setShowAdd(true)} style={{ width: '100%', borderRadius: 16, padding: 16, backgroundColor: '#3B82F6' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <Camera size={24} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Add New Memory</Text>
          </View>
        </Pressable>
        <View style={{ backgroundColor: darkMode ? '#1F2937' : '#fff', borderRadius: 16, padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: darkMode ? '#FFFFFF' : '#111827', fontSize: 16, fontWeight: '600' }}>📅 Recent</Text>
            <Pressable onPress={() => { setShowAll(true); setItems([]); setCursor(undefined); setHasMore(true); }}><Text style={{ color: '#3B82F6', fontSize: 13, fontWeight: '600' }}>View All</Text></Pressable>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {recent.map((m) => (
              <Pressable key={m.id} onPress={() => setSelected(m)} style={{ width: '31%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: darkMode ? '#374151' : '#F3F4F6' }}>
                {m.type === 'PHOTO' ? (
                  <Image source={{ uri: m.url }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Video size={20} color={darkMode ? '#D1D5DB' : '#6B7280'} />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>
        <View style={{ gap: 12 }}>
          <Text style={{ color: darkMode ? '#FFFFFF' : '#111827', fontSize: 16, fontWeight: '600' }}>Collections</Text>
          {monthlyGroups.length > 0 ? monthlyGroups.map(g => (
            <View key={g.label} style={{ borderRadius: 16, padding: 16, backgroundColor: '#FEF3C7', borderWidth: 2, borderColor: '#FDE68A' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ backgroundColor: '#FBBF24', borderRadius: 9999, padding: 12 }}>
                  <Calendar size={24} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#111827', fontSize: 15, fontWeight: '600' }}>{g.label}</Text>
                  <Text style={{ color: '#6B7280', fontSize: 13 }}>{g.count} memories</Text>
                </View>
              </View>
            </View>
          )) : (
            <View style={{ borderRadius: 16, padding: 16, backgroundColor: '#FEF3C7', borderWidth: 2, borderColor: '#FDE68A' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ backgroundColor: '#FBBF24', borderRadius: 9999, padding: 12 }}>
                  <Calendar size={24} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#111827', fontSize: 15, fontWeight: '600' }}>{stats.total ? 'All Memories' : 'No collections yet'}</Text>
                  <Text style={{ color: '#6B7280', fontSize: 13 }}>{stats.total ? `${stats.total} memories` : 'Add media to create collections'}</Text>
                </View>
              </View>
            </View>
          )}
          <View style={{ borderRadius: 16, padding: 16, backgroundColor: '#FCE7F3', borderWidth: 2, borderColor: '#FBCFE8' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ backgroundColor: '#EC4899', borderRadius: 9999, padding: 12 }}>
                <Heart size={24} color="#fff" fill="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#111827', fontSize: 15, fontWeight: '600' }}>Favorites ⭐</Text>
                <Text style={{ color: '#6B7280', fontSize: 13 }}>{stats.favorites} memories</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {showAdd && (
        <AddMemoryModal
          darkMode={darkMode}
          onClose={() => setShowAdd(false)}
          onAdded={(mem) => {
            setRecent(prev => [mem, ...prev].slice(0,6));
            setMonthlyGroups(prev => {
              const d = new Date(mem.createdAt);
              const label = d.toLocaleString('en-US', { month: 'long' }) + ' ' + d.getFullYear();
              const idx = prev.findIndex(g => g.label === label);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = { label, count: next[idx].count + 1 };
                return next;
              }
              return [{ label, count: 1 }, ...prev].slice(0,3);
            });
            (async () => {
              try {
                const token = await getToken();
                if (!token) return;
                const s = await fetchMemoriesStats(token);
                setStats(s);
              } catch {}
            })();
          }}
        />
      )}
      {showAll && (
        <Modal transparent visible onRequestClose={() => setShowAll(false)}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }} onPress={() => setShowAll(false)}>
            <View style={{ margin: 24, borderRadius: 24, overflow: 'hidden', backgroundColor: darkMode ? '#1F2937' : '#FFFFFF' }}>
              <LinearGradient colors={['#8B5CF6', '#EC4899']} style={{ paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>View All</Text>
                <Pressable onPress={() => setShowAll(false)} hitSlop={8}><X size={24} color="#fff" /></Pressable>
              </LinearGradient>
              <View style={{ padding: 12 }}>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                  <Pressable onPress={() => { setFilter('ALL'); setItems([]); setCursor(undefined); setHasMore(true); }} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9999, backgroundColor: filter === 'ALL' ? '#8B5CF6' : (darkMode ? '#374151' : '#E5E7EB') }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: filter === 'ALL' ? '#fff' : (darkMode ? '#D1D5DB' : '#111827') }}>All</Text>
                  </Pressable>
                  <Pressable onPress={() => { setFilter('PHOTO'); setItems([]); setCursor(undefined); setHasMore(true); }} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9999, backgroundColor: filter === 'PHOTO' ? '#8B5CF6' : (darkMode ? '#374151' : '#E5E7EB') }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: filter === 'PHOTO' ? '#fff' : (darkMode ? '#D1D5DB' : '#111827') }}>Photos</Text>
                  </Pressable>
                  <Pressable onPress={() => { setFilter('VIDEO'); setItems([]); setCursor(undefined); setHasMore(true); }} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9999, backgroundColor: filter === 'VIDEO' ? '#8B5CF6' : (darkMode ? '#374151' : '#E5E7EB') }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: filter === 'VIDEO' ? '#fff' : (darkMode ? '#D1D5DB' : '#111827') }}>Videos</Text>
                  </Pressable>
                  <Pressable onPress={() => { setFavoritesOnly(v => !v); setItems([]); setCursor(undefined); setHasMore(true); }} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9999, backgroundColor: favoritesOnly ? '#8B5CF6' : (darkMode ? '#374151' : '#E5E7EB') }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: favoritesOnly ? '#fff' : (darkMode ? '#D1D5DB' : '#111827') }}>Favorites</Text>
                  </Pressable>
                </View>
                <FlatList
                  data={itemsFiltered}
                  keyExtractor={(m) => m.id}
                  numColumns={3}
                  columnWrapperStyle={{ gap: 8 }}
                  contentContainerStyle={{ gap: 8 }}
                  ListEmptyComponent={!loadingMore ? (
                    <View style={{ padding: 24, alignItems: 'center' }}>
                      <Text style={{ color: darkMode ? '#D1D5DB' : '#6B7280' }}>No memories found</Text>
                    </View>
                  ) : null}
                  renderItem={({ item }) => (
                    <Pressable onPress={() => setSelected(item)} style={{ flex: 1, aspectRatio: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: darkMode ? '#374151' : '#F3F4F6' }}>
                      {item.type === 'PHOTO' ? (
                        <Image source={{ uri: item.url }} style={{ width: '100%', height: '100%' }} />
                      ) : (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                          <Video size={24} color={darkMode ? '#D1D5DB' : '#6B7280'} />
                        </View>
                      )}
                      <Pressable onPress={() => toggleFavorite(item.id, !item.favorite)} style={{ position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 9999, padding: 6 }}>
                        <Heart size={16} color="#fff" fill={item.favorite ? '#fff' : 'transparent'} />
                      </Pressable>
                    </Pressable>
                  )}
                  onEndReached={loadMore}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={loadingMore ? (
                    <View style={{ padding: 12 }}><ActivityIndicator color={darkMode ? '#fff' : '#111827'} /></View>
                  ) : !hasMore ? (
                    <View style={{ padding: 12, alignItems: 'center' }}><Text style={{ color: darkMode ? '#D1D5DB' : '#6B7280' }}>No more memories</Text></View>
                  ) : null}
                />
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
      {selected && (
        <Modal transparent visible onRequestClose={() => setSelected(null)}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', padding: 24 }} onPress={() => setSelected(null)}>
            <View style={{ width: '100%', maxWidth: 560, borderRadius: 24, overflow: 'hidden', backgroundColor: darkMode ? '#1F2937' : '#FFFFFF' }}>
              <LinearGradient colors={['#8B5CF6', '#EC4899']} style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Memory</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable onPress={() => toggleFavorite(selected.id, !selected.favorite)} style={{ backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 9999, padding: 8 }}>
                    <Heart size={18} color="#fff" fill={selected.favorite ? '#fff' : 'transparent'} />
                  </Pressable>
                  <Pressable onPress={deleteSelected} style={{ backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 8 }}>
                    <Text style={{ color: '#fff', fontWeight: '700' }}>Delete</Text>
                  </Pressable>
                  <Pressable onPress={() => setSelected(null)} hitSlop={8}><X size={22} color="#fff" /></Pressable>
                </View>
              </LinearGradient>
              <View style={{ padding: 12 }}>
                {selected.type === 'PHOTO' ? (
                  <Image source={{ uri: selected.url }} style={{ width: '100%', aspectRatio: 1 }} />
                ) : (
                  <View style={{ width: '100%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: darkMode ? '#374151' : '#F3F4F6', borderRadius: 12 }}>
                    <Video size={48} color={darkMode ? '#D1D5DB' : '#6B7280'} />
                    <Pressable onPress={() => Linking.openURL(selected.url)} style={{ marginTop: 12, backgroundColor: '#3B82F6', borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 8 }}>
                      <Text style={{ color: '#fff', fontWeight: '600' }}>Open Video</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}
