import React, { useState } from "react";
import { Modal, View, Text, TextInput, Pressable, ScrollView, Dimensions, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { X, Camera, Video as VideoIcon } from "lucide-react-native";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { getToken, addMemory } from "../lib/api";
import * as ImagePicker from "expo-image-picker";

interface AddMemoryModalProps {
  darkMode: boolean;
  onClose: () => void;
  onAdded: (mem: { id: string; url: string; type: "PHOTO" | "VIDEO"; createdAt: string; favorite: boolean }) => void;
}

export function AddMemoryModal({ darkMode, onClose, onAdded }: AddMemoryModalProps) {
  const [type, setType] = useState<"PHOTO" | "VIDEO">("PHOTO");
  const [url, setUrl] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const canSubmit = url.trim().length > 0 && !uploading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      const token = await getToken();
      if (!token) { Alert.alert('Sign in required', 'Please sign in to add memories.'); return; }
      const mem = await addMemory(token, type, url.trim(), mimeType.trim() || undefined);
      onAdded(mem);
      onClose();
    } catch {}
  };

  const handlePick = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.9,
        allowsEditing: false
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset) return;
      const nextType = asset.type === 'video' ? 'VIDEO' : 'PHOTO';
      const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      if (!cloudName || !uploadPreset) { Alert.alert('Upload not configured', 'Please set Cloudinary env variables.'); return; }
      setUploading(true);
      setUploadProgress(0);
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${nextType === 'PHOTO' ? 'image' : 'video'}/upload`;
      const form = new FormData();
      form.append('file', { uri: asset.uri, name: asset.fileName || `memory.${(asset.uri.split('.').pop() || (nextType === 'PHOTO' ? 'jpg' : 'mp4'))}`, type: asset.mimeType || (nextType === 'PHOTO' ? 'image/jpeg' : 'video/mp4') } as any);
      form.append('upload_preset', uploadPreset);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl);
      xhr.onload = async () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.secure_url) {
            const token = await getToken();
            if (!token) { Alert.alert('Sign in required', 'Please sign in to add memories.'); setUploading(false); setUploadProgress(0); return; }
            const mem = await addMemory(token, nextType as 'PHOTO' | 'VIDEO', data.secure_url, asset.mimeType || undefined);
            onAdded(mem);
            onClose();
          } else {
            Alert.alert('Upload failed', (data.error?.message || 'Unknown error'));
          }
        } catch {
          Alert.alert('Upload failed', 'Unexpected response.');
        }
        setUploading(false);
        setUploadProgress(0);
      };
      xhr.onerror = () => {
        Alert.alert('Upload failed', 'Network error.');
        setUploading(false);
        setUploadProgress(0);
      };
      xhr.upload.onprogress = (evt: any) => {
        if (evt.lengthComputable) {
          const pct = Math.round((evt.loaded / evt.total) * 100);
          setUploadProgress(pct);
        }
      };
      xhr.send(form as any);
    } catch {
      setUploading(false);
      setUploadProgress(0);
      Alert.alert('Error', 'Could not start upload.');
    }
  };

  const handleCapture = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return;
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.9
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset) return;
      const nextType = asset.type === 'video' ? 'VIDEO' : 'PHOTO';
      const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      if (!cloudName || !uploadPreset) { Alert.alert('Upload not configured', 'Please set Cloudinary env variables.'); return; }
      setUploading(true);
      setUploadProgress(0);
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${nextType === 'PHOTO' ? 'image' : 'video'}/upload`;
      const form = new FormData();
      form.append('file', { uri: asset.uri, name: asset.fileName || `memory.${(asset.uri.split('.').pop() || (nextType === 'PHOTO' ? 'jpg' : 'mp4'))}`, type: asset.mimeType || (nextType === 'PHOTO' ? 'image/jpeg' : 'video/mp4') } as any);
      form.append('upload_preset', uploadPreset);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl);
      xhr.onload = async () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.secure_url) {
            const token = await getToken();
            if (!token) { Alert.alert('Sign in required', 'Please sign in to add memories.'); setUploading(false); setUploadProgress(0); return; }
            const mem = await addMemory(token, nextType as 'PHOTO' | 'VIDEO', data.secure_url, asset.mimeType || undefined);
            onAdded(mem);
            onClose();
          } else {
            Alert.alert('Upload failed', (data.error?.message || 'Unknown error'));
          }
        } catch {
          Alert.alert('Upload failed', 'Unexpected response.');
        }
        setUploading(false);
        setUploadProgress(0);
      };
      xhr.onerror = () => {
        Alert.alert('Upload failed', 'Network error.');
        setUploading(false);
        setUploadProgress(0);
      };
      xhr.upload.onprogress = (evt: any) => {
        if (evt.lengthComputable) {
          const pct = Math.round((evt.loaded / evt.total) * 100);
          setUploadProgress(pct);
        }
      };
      xhr.send(form as any);
    } catch {
      setUploading(false);
      setUploadProgress(0);
      Alert.alert('Error', 'Could not start upload.');
    }
  };

  return (
    <Modal transparent visible onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }} onPress={onClose}>
        <View style={{ margin: 24, borderRadius: 24, overflow: "hidden", maxHeight: Dimensions.get("window").height * 0.9, backgroundColor: darkMode ? "#1F2937" : "#FFFFFF" }}>
          <LinearGradient colors={["#8B5CF6", "#EC4899"]} style={{ paddingHorizontal: 24, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {type === "PHOTO" ? <Camera size={24} color="#fff" /> : <VideoIcon size={24} color="#fff" />}
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700", marginLeft: 8 }}>Add Memory</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8}><X size={24} color="#fff" /></Pressable>
          </LinearGradient>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Pressable onPress={() => { if (uploading) return; handlePick(); }} style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 32 }}>
              <View style={{ backgroundColor: '#8B5CF6', borderRadius: 9999, padding: 24 }}>
                <Camera size={36} color="#fff" />
              </View>
              <Text style={{ marginTop: 8, fontSize: 16, fontWeight: '700', color: darkMode ? '#FFFFFF' : '#111827' }}>Add Media</Text>
            </Pressable>
            <View style={{ marginTop: 12 }}>
              <Button onPress={() => { if (uploading) return; handleCapture(); }} style={{ height: 44, borderRadius: 12, backgroundColor: '#3B82F6', opacity: uploading ? 0.6 : 1 }}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Use Camera</Text>
              </Button>
            </View>

            {uploading ? (
              <View style={{ marginTop: 8 }}>
                <Progress value={uploadProgress} />
                <Text style={{ marginTop: 6, fontSize: 12, color: darkMode ? '#9CA3AF' : '#6B7280' }}>{uploadProgress}%</Text>
              </View>
            ) : (
              <View style={{ marginTop: 8 }}>
                <Text style={{ fontSize: 13, color: darkMode ? '#9CA3AF' : '#6B7280' }}>Upload media to add a memory.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}