import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { io } from "socket.io-client";
import { mediaDevices, RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, RTCView, MediaStream, MediaStreamTrack } from "react-native-webrtc";
import { Phone, PhoneOff, Mic, MicOff, Camera, CameraOff } from "lucide-react-native";
import { getToken } from "../lib/api";

interface CallScreenProps {
  darkMode: boolean;
  onClose?: () => void;
  onOpenVoiceNote?: () => void;
}

export function CallScreen({ darkMode, onClose, onOpenVoiceNote }: CallScreenProps) {
  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const fallbackTimerRef = useRef<any>(null);

  const TURN_URL = process.env.EXPO_PUBLIC_TURN_URL;
  const TURN_USERNAME = process.env.EXPO_PUBLIC_TURN_USERNAME;
  const TURN_PASSWORD = process.env.EXPO_PUBLIC_TURN_PASSWORD;
  const iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    ...(TURN_URL && TURN_USERNAME && TURN_PASSWORD ? [{ urls: TURN_URL, username: TURN_USERNAME, credential: TURN_PASSWORD }] : [])
  ];

  const ensureSocket = async () => {
    if (socketRef.current) return socketRef.current;
    const token = await getToken();
    const base = process.env.EXPO_PUBLIC_API_URL ?? "https://kemmie.onrender.com";
    const s = io(base, { transports: ["websocket"], auth: { token } });
    socketRef.current = s;

    s.on("call:offer", async (payload: any) => {
      if (!pcRef.current) await createPeer();
      await pcRef.current!.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      await addLocalTracks();
      const ans = await pcRef.current!.createAnswer();
      await pcRef.current!.setLocalDescription(ans);
      s.emit("call:answer", { sdp: ans });
      setInCall(true);
    });

    s.on("call:answer", async (payload: any) => {
      if (!pcRef.current) return;
      await pcRef.current!.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      setInCall(true);
    });

    s.on("call:ice", async (payload: any) => {
      if (!pcRef.current || !payload?.candidate) return;
      try { await pcRef.current!.addIceCandidate(new RTCIceCandidate(payload.candidate)); } catch {}
    });

    s.on("call:end", () => {
      endCallLocal();
    });

    return s;
  };

  const createPeer = async () => {
    const pc = new RTCPeerConnection({ iceServers });
    pc.addEventListener('icecandidate', (evt: any) => {
      if (evt.candidate && socketRef.current) socketRef.current.emit("call:ice", { candidate: evt.candidate });
    });
    pc.addEventListener('track', (evt: any) => {
      const stream = evt.streams?.[0];
      if (stream) setRemoteStream(stream as MediaStream);
    });
    pcRef.current = pc;
  };

  const addLocalTracks = async () => {
    if (!localStream) {
      const s = await mediaDevices.getUserMedia({ audio: true, video: true });
      setLocalStream(s);
    }
    const pc = pcRef.current!
    localStream!.getTracks().forEach((t: MediaStreamTrack) => pc.addTrack(t, localStream!));
  };

  const startCall = async () => {
    await ensureSocket();
    if (!pcRef.current) await createPeer();
    await addLocalTracks();
    const offer = await pcRef.current!.createOffer();
    await pcRef.current!.setLocalDescription(offer);
    socketRef.current!.emit("call:offer", { sdp: offer });
    setInCall(true);
  };

  const endCallLocal = () => {
    setInCall(false);
    if (pcRef.current) {
      try { pcRef.current.close(); } catch {}
      pcRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
  };

  const endCall = () => {
    if (socketRef.current) socketRef.current.emit("call:end");
    endCallLocal();
    if (onClose) onClose();
  };

  const toggleMic = () => {
    const next = !micOn;
    setMicOn(next);
    localStream?.getAudioTracks().forEach((t) => (t.enabled = next));
  };

  const toggleCam = () => {
    const next = !camOn;
    setCamOn(next);
    localStream?.getVideoTracks().forEach((t) => (t.enabled = next));
  };

  const retryCall = async () => {
    setShowFallback(false);
    endCallLocal();
    await startCall();
  };

  const fallbackToVoice = () => {
    if (socketRef.current) socketRef.current.emit("call:end");
    endCallLocal();
    if (onClose) onClose();
    if (typeof onOpenVoiceNote === 'function') onOpenVoiceNote();
  };

  useEffect(() => {
    ensureSocket();
    return () => {
      try { socketRef.current?.disconnect(); } catch {}
      endCallLocal();
    };
  }, []);

  useEffect(() => {
    if (inCall && !remoteStream) {
      if (fallbackTimerRef.current) { clearTimeout(fallbackTimerRef.current); }
      fallbackTimerRef.current = setTimeout(() => {
        if (!remoteStream) setShowFallback(true);
      }, 15000);
    } else {
      if (fallbackTimerRef.current) { clearTimeout(fallbackTimerRef.current); fallbackTimerRef.current = null; }
      setShowFallback(false);
    }
  }, [inCall, remoteStream]);

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? "#111827" : "#FDF2F8", padding: 16 }}>
      <View style={{ flex: 1, borderRadius: 16, overflow: "hidden", backgroundColor: darkMode ? "#1F2937" : "#FFFFFF", borderWidth: 1, borderColor: darkMode ? "#374151" : "#FBCFE8" }}>
        {remoteStream ? (
          <RTCView streamURL={remoteStream.toURL()} style={{ flex: 1 }} objectFit="cover" />
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: darkMode ? "#9CA3AF" : "#6B7280" }}>{inCall ? "Connecting..." : "Ready to start a call"}</Text>
          </View>
        )}
        {localStream && (
          <View style={{ position: "absolute", right: 12, bottom: 12, width: 120, height: 160, borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: darkMode ? "#374151" : "#FBCFE8" }}>
            <RTCView streamURL={localStream.toURL()} style={{ width: "100%", height: "100%" }} objectFit="cover" />
          </View>
        )}
      </View>

      {showFallback && !remoteStream && (
        <View style={{ marginTop: 12, backgroundColor: "#FEF3C7", borderWidth: 1, borderColor: "#FDE68A", borderRadius: 16, padding: 12 }}>
          <Text style={{ color: "#1F2937", fontSize: 14, fontWeight: "700", marginBottom: 8 }}>Connection failed</Text>
          <Text style={{ color: "#6B7280", fontSize: 12, marginBottom: 8 }}>Your network may block peer-to-peer calls. You can retry or send a voice note.</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable onPress={retryCall} style={{ padding: 10, borderRadius: 12, backgroundColor: "#3B82F6" }}><Text style={{ color: "#fff", fontWeight: "600" }}>Retry</Text></Pressable>
            <Pressable onPress={fallbackToVoice} style={{ padding: 10, borderRadius: 12, backgroundColor: "#10B981" }}><Text style={{ color: "#fff", fontWeight: "600" }}>Send voice note</Text></Pressable>
          </View>
        </View>
      )}
      <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Pressable onPress={toggleMic} style={{ padding: 12, borderRadius: 9999, backgroundColor: micOn ? "#ECFDF5" : "#FEE2E2", borderWidth: 1, borderColor: micOn ? "#A7F3D0" : "#FCA5A5" }}>
          {micOn ? <Mic size={20} color="#10B981" /> : <MicOff size={20} color="#EF4444" />}
        </Pressable>
        <Pressable onPress={toggleCam} style={{ padding: 12, borderRadius: 9999, backgroundColor: camOn ? "#DBEAFE" : "#F3F4F6", borderWidth: 1, borderColor: camOn ? "#93C5FD" : "#D1D5DB" }}>
          {camOn ? <Camera size={20} color="#3B82F6" /> : <CameraOff size={20} color="#6B7280" />}
        </Pressable>
        {!inCall ? (
          <Pressable onPress={startCall} style={{ flex: 1, marginLeft: 8, padding: 14, borderRadius: 12, alignItems: "center", backgroundColor: darkMode ? "#7C3AED" : "#C44569" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Phone size={20} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "700" }}>Start Call</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable onPress={endCall} style={{ flex: 1, marginLeft: 8, padding: 14, borderRadius: 12, alignItems: "center", backgroundColor: "#EF4444" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <PhoneOff size={20} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "700" }}>End Call</Text>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
}