import React, { useState } from "react";
import { Modal, View, Text, ScrollView, TextInput, Pressable, Dimensions } from "react-native";
import { X, Sparkles, Trophy, Check, Camera } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "./ui/button";
import { EmojiPicker } from "./emoji-picker";
import { ConfettiAnimation } from "./confetti-animation";

type ChallengeType = "emoji" | "text" | "rating" | "photo-optional" | "short-text";

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  type: ChallengeType;
  difficulty: "easy" | "medium";
  maxEmojis?: number;
  maxRating?: number;
}

interface RefinedChallengeModalProps {
  darkMode: boolean;
  onClose: () => void;
  onComplete: (response: string, photoIncluded?: boolean) => void;
  challenge: Challenge;
}

export function RefinedChallengeModal({ darkMode, onClose, onComplete, challenge }: RefinedChallengeModalProps) {
  const [step, setStep] = useState<"complete" | "preview" | "reward">("complete");
  const [response, setResponse] = useState("");
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [includePhoto, setIncludePhoto] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const rewardMessages = [
    "That counts.",
    "Nice.",
    "Respect.",
    "Noted.",
    "Real.",
    "Valid.",
    "Iconic.",
    "Vibes.",
  ];

  const randomRewardMessage = rewardMessages[Math.floor(Math.random() * rewardMessages.length)];

  const canProceed = () => {
    if (challenge.type === "emoji") return selectedEmojis.length > 0;
    if (challenge.type === "rating") return rating !== null;
    if (challenge.type === "text" || challenge.type === "short-text") return response.trim().length > 0;
    if (challenge.type === "photo-optional") return response.trim().length > 0 || includePhoto;
    return false;
  };

  const handleEmojiSelect = (emoji: string) => {
    const maxEmojis = challenge.maxEmojis || 3;
    if (selectedEmojis.includes(emoji)) {
      setSelectedEmojis(selectedEmojis.filter(e => e !== emoji));
    } else if (selectedEmojis.length < maxEmojis) {
      setSelectedEmojis([...selectedEmojis, emoji]);
    }
  };

  const handlePreview = () => {
    setStep("preview");
  };

  const handleSubmit = () => {
    let finalResponse = "";
    
    if (challenge.type === "emoji") {
      finalResponse = selectedEmojis.join(" ");
    } else if (challenge.type === "rating") {
      finalResponse = `${rating}/10`;
    } else {
      finalResponse = response;
    }

    setStep("reward");
    setShowConfetti(true);
    
    setTimeout(() => {
      onComplete(finalResponse, includePhoto);
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <>
      {showConfetti && <ConfettiAnimation />}
      <Modal transparent visible onRequestClose={onClose}>
        <Pressable style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'flex-end'}} onPress={step==='reward'?undefined:onClose}>
          <View style={{margin:24,borderRadius:24,overflow:'hidden',maxHeight: Dimensions.get('window').height * 0.9,backgroundColor:darkMode?'#1F2937':'#FFFFFF'}}>
            <LinearGradient colors={challenge.difficulty==='easy'?['#22C55E','#14B8A6']:['#F59E0B','#F97316']} style={{paddingHorizontal:24,paddingVertical:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Trophy size={24} color="#fff" />
                <View style={{marginLeft:8}}>
                  <Text style={{color:'#fff',fontSize:20,fontWeight:'700'}}>{step==='reward'?'Challenge Complete!':'Daily Challenge'}</Text>
                  <Text style={{color:'rgba(255,255,255,0.8)',fontSize:12,fontWeight:'500'}}>{challenge.difficulty==='easy'?'Easy':'Medium'} • {challenge.points} pts</Text>
                </View>
              </View>
              {step!=='reward'&&(<Pressable onPress={onClose} hitSlop={8}><X size={24} color="#fff" /></Pressable>)}
            </LinearGradient>
            <ScrollView contentContainerStyle={{padding:16}}>

            {step==='complete'&&(<View><View style={{borderRadius:16,padding:16,backgroundColor:darkMode?'#374151':'#FDF2F8'}}><Text style={{fontSize:17,lineHeight:24,fontWeight:'600',color:darkMode?'#FFFFFF':'#111827'}}>{challenge.title}</Text></View>{challenge.type==='emoji'&&(<View style={{marginTop:16}}><Text style={{fontSize:15,fontWeight:'600',marginBottom:12,color:darkMode?'#FFFFFF':'#111827'}}>Pick {challenge.maxEmojis||3} emojis:</Text><EmojiPicker onSelect={handleEmojiSelect} maxSelection={challenge.maxEmojis||3} selected={selectedEmojis} darkMode={darkMode} /></View>)}{challenge.type==='rating'&&(<View style={{marginTop:16}}><Text style={{fontSize:15,fontWeight:'600',marginBottom:12,color:darkMode?'#FFFFFF':'#111827'}}>Rate from 1-{challenge.maxRating||10}:</Text><View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',padding:12}}>{Array.from({length:challenge.maxRating||10},(_,i)=>i+1).map(num=>(<Pressable key={num} onPress={()=>setRating(num)} style={{width:56,height:56,borderRadius:12,alignItems:'center',justifyContent:'center',margin:6,backgroundColor:rating===num?'#D8B4FE':(darkMode?'#374151':'#E5E7EB')}}><Text style={{fontSize:18,fontWeight:'700',color:rating===num?'#111827':(darkMode?'#D1D5DB':'#111827')}}>{num}</Text></Pressable>))}</View></View>)}{(challenge.type==='text'||challenge.type==='short-text')&&(<View style={{marginTop:16}}><Text style={{fontSize:15,fontWeight:'600',marginBottom:12,color:darkMode?'#FFFFFF':'#111827'}}>Your answer:</Text><TextInput value={response} onChangeText={setResponse} placeholder="Type here..." placeholderTextColor={darkMode?'#9CA3AF':'#9CA3AF'} style={{width:'100%',paddingHorizontal:16,paddingVertical:12,borderRadius:12,borderWidth:1,borderColor:darkMode?'#4B5563':'#E5E7EB',backgroundColor:darkMode?'#374151':'#F9FAFB',color:darkMode?'#FFFFFF':'#111827',fontSize:15,lineHeight:24,minHeight:challenge.type==='short-text'?80:128}} multiline maxLength={challenge.type==='short-text'?50:200} /><View style={{flexDirection:'row',justifyContent:'space-between',marginTop:8}}><Text style={{fontSize:12,color:darkMode?'#9CA3AF':'#6B7280'}}>No pressure, just be real ✨</Text><Text style={{fontSize:12,color:darkMode?'#9CA3AF':'#6B7280'}}>{response.length}/{challenge.type==='short-text'?50:200}</Text></View></View>)}

                {challenge.type==='photo-optional'&&(<View style={{marginTop:16}}><Text style={{fontSize:15,fontWeight:'600',marginBottom:12,color:darkMode?'#FFFFFF':'#111827'}}>Tell us or show us:</Text><TextInput value={response} onChangeText={setResponse} placeholder="Describe in words..." placeholderTextColor={darkMode?'#9CA3AF':'#9CA3AF'} style={{width:'100%',paddingHorizontal:16,paddingVertical:12,borderRadius:12,borderWidth:1,borderColor:darkMode?'#4B5563':'#E5E7EB',backgroundColor:darkMode?'#374151':'#F9FAFB',color:darkMode?'#FFFFFF':'#111827',fontSize:15,lineHeight:24,minHeight:96}} multiline maxLength={150} /><Text style={{fontSize:12,textAlign:'right',marginTop:4,color:darkMode?'#9CA3AF':'#6B7280'}}>{response.length}/150</Text><View style={{alignItems:'center',marginTop:12}}><Text style={{fontSize:13,color:darkMode?'#9CA3AF':'#6B7280',marginBottom:8}}>— or —</Text><Pressable onPress={()=>setIncludePhoto(true)} style={{paddingHorizontal:24,paddingVertical:12,borderRadius:12,flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:includePhoto?'#8B5CF6':(darkMode?'#374151':'#E5E7EB')}}>{includePhoto?<Check size={18} color="#fff" />:<Camera size={18} color={darkMode?'#D1D5DB':'#374151'} />}<Text style={{marginLeft:8,fontSize:15,fontWeight:'600',color:includePhoto?'#fff':(darkMode?'#D1D5DB':'#374151')}}>{includePhoto?'Photo selected':'Add a photo (optional)'}</Text></Pressable></View></View>)}

                <View style={{marginTop:16}}>
                  <Button onPress={handlePreview} disabled={!canProceed()} style={{height:48,borderRadius:9999,backgroundColor:canProceed()?"#8B5CF6":(darkMode?"#374151":"#E5E7EB")}}>
                    <Text style={{color:'#fff',fontSize:16,fontWeight:'600'}}>Continue</Text>
                  </Button>
                </View>
              </View>
            )}

            {step==='preview'&&(<View><Text style={{fontSize:15,fontWeight:'600',marginBottom:12,color:darkMode?'#FFFFFF':'#111827'}}>Your response:</Text><View style={{borderRadius:16,padding:16,backgroundColor:darkMode?'#374151':'#FDF2F8'}}><Text style={{fontSize:17,color:darkMode?'#FFFFFF':'#111827'}}>{challenge.type==='emoji'?selectedEmojis.join(' '):challenge.type==='rating'?`${rating}/10`:response}</Text>{includePhoto&&(<View style={{flexDirection:'row',alignItems:'center',marginTop:8}}><Camera size={18} color="#8B5CF6" /><Text style={{marginLeft:6,fontSize:14,fontWeight:'600',color:'#8B5CF6'}}>+ Photo attached</Text></View>)}</View><Text style={{textAlign:'center',fontSize:13,fontStyle:'italic',marginTop:16,color:darkMode?'#9CA3AF':'#6B7280'}}>This stays between us. 💕</Text><View style={{flexDirection:'row',marginTop:16}}><Button onPress={()=>setStep('complete')} style={{flex:1,height:48,borderRadius:9999,backgroundColor:darkMode?'#374151':'#E5E7EB'}}><Text style={{fontSize:14,fontWeight:'600',color:darkMode?'#FFFFFF':'#111827'}}>Edit</Text></Button><View style={{width:12}} /><Button onPress={handleSubmit} style={{flex:1,height:48,borderRadius:9999,backgroundColor:'#8B5CF6'}}><Text style={{fontSize:14,fontWeight:'600',color:'#FFFFFF'}}>Confirm</Text></Button></View></View>)}

            {step==='reward'&&(<View style={{alignItems:'center',paddingVertical:24}}><View style={{width:96,height:96,borderRadius:48,backgroundColor:'#10B981',alignItems:'center',justifyContent:'center'}}><Check size={48} color="#fff" /></View><Text style={{fontSize:32,fontWeight:'700',marginTop:12,color:darkMode?'#FFFFFF':'#111827'}}>{randomRewardMessage}</Text><View style={{flexDirection:'row',alignItems:'center',paddingHorizontal:16,paddingVertical:10,borderRadius:9999,marginTop:12,backgroundColor:darkMode?'#374151':'#FEF3C7',borderWidth:2,borderColor:'#F59E0B'}}><Sparkles size={20} color="#F59E0B" /><Text style={{marginLeft:8,color:'#CA8A04',fontSize:18,fontWeight:'700'}}>+{challenge.points} pts</Text></View><Text style={{fontSize:14,marginTop:8,color:darkMode?'#9CA3AF':'#6B7280'}}>Opening chat...</Text></View>)}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}