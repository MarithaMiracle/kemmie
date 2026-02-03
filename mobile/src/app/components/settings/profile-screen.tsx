import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Camera, User } from "lucide-react-native";
import { Button } from "../ui/button";
import * as ImagePicker from "expo-image-picker";
import { getToken, updateProfile } from "../../lib/api";

interface ProfileScreenProps {
  darkMode: boolean;
  onBack: () => void;
}

export function ProfileScreen({ darkMode, onBack }: ProfileScreenProps) {
  const [name, setName] = useState("You");
  const [bio, setBio] = useState("Living my best life with my bestie 💕");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleChangePhoto = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.9 });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset) return;
      const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      if (!cloudName || !uploadPreset) { Alert.alert('Upload not configured', 'Please set Cloudinary env variables.'); return; }
      setUploadingAvatar(true);
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const form = new FormData();
      form.append('file', { uri: asset.uri, name: asset.fileName || `avatar.${(asset.uri.split('.').pop() || 'jpg')}`, type: asset.mimeType || 'image/jpeg' } as any);
      form.append('upload_preset', uploadPreset);
      const res = await fetch(uploadUrl, { method: 'POST', body: form });
      const data = await res.json();
      if (data.secure_url) {
        const token = await getToken();
        if (!token) { Alert.alert('Sign in required', 'Please sign in to update profile.'); setUploadingAvatar(false); return; }
        await updateProfile(token, { avatarUrl: data.secure_url });
        Alert.alert('Profile updated', 'Photo changed successfully.');
      } else {
        Alert.alert('Upload failed', (data.error?.message || 'Unknown error'));
      }
      setUploadingAvatar(false);
    } catch {
      setUploadingAvatar(false);
      Alert.alert('Error', 'Could not change photo.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#FDF2F8' }}>
      <LinearGradient colors={darkMode ? ['#374151', '#374151'] : ['#8B5CF6', '#EC4899']} style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={onBack}><Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>← Back</Text></Pressable>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>Edit Profile</Text>
          <View style={{ width: 56 }} />
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' }}>
            <User size={48} color="#fff" />
          </View>
          <Pressable onPress={() => { if (uploadingAvatar) return; handleChangePhoto(); }} style={{ marginTop: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: darkMode ? '#374151' : '#E5E7EB', opacity: uploadingAvatar ? 0.6 : 1, flexDirection: 'row', alignItems: 'center' }}>
            <Camera size={16} color={darkMode ? '#D1D5DB' : '#374151'} />
            <Text style={{ marginLeft: 6, fontSize: 12, color: darkMode ? '#D1D5DB' : '#374151' }}>{uploadingAvatar ? 'Changing...' : 'Change Photo'}</Text>
          </Pressable>
          <Text style={{ fontSize: 13, marginTop: 6, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Tap to change photo</Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', marginBottom: 8, color: darkMode ? '#FFFFFF' : '#111827' }}>Display Name</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'} style={{ width: '100%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: darkMode ? '#4B5563' : '#E5E7EB', backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', color: darkMode ? '#FFFFFF' : '#111827', fontSize: 15 }} />
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', marginBottom: 8, color: darkMode ? '#FFFFFF' : '#111827' }}>Bio</Text>
          <TextInput value={bio} onChangeText={setBio} placeholder="Say something..." placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'} style={{ width: '100%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: darkMode ? '#4B5563' : '#E5E7EB', backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', color: darkMode ? '#FFFFFF' : '#111827', fontSize: 15, minHeight: 96 }} multiline maxLength={100} />
          <Text style={{ textAlign: 'right', fontSize: 12, marginTop: 4, color: darkMode ? '#9CA3AF' : '#6B7280' }}>{bio.length}/100</Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <Button onPress={async () => { try { const token = await getToken(); if (!token) { Alert.alert('Sign in required', 'Please sign in to update profile.'); return; } await updateProfile(token, { name, bio }); Alert.alert('Profile updated', 'Changes saved.'); } catch {} }} style={{ height: 48, borderRadius: 9999, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>Save Changes</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
