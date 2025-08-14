import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PageTransition } from '@/components/PageTransition';

type Message = {
  id: string;
  text: string;
  timestamp: string;
  isFromMe: boolean;
  isRead?: boolean;
};

type ChatScreenProps = {
  route?: {
    params?: {
      chatId: string;
      userName: string;
      userAvatar: string;
      isOnline: boolean;
      verification: { idUploaded: boolean; workVerified: boolean };
    };
  };
  navigation?: {
    goBack: () => void;
  };
};

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hey! I saw your profile and I\'m really interested in the room you have available.',
    timestamp: '2025-01-15T10:30:00Z',
    isFromMe: false,
    isRead: true
  },
  {
    id: '2',
    text: 'Hi! Thanks for reaching out. The room is still available. Would you like to know more about it?',
    timestamp: '2025-01-15T10:35:00Z',
    isFromMe: true,
    isRead: true
  },
  {
    id: '3',
    text: 'Yes, please! What\'s the monthly rent and what amenities are included?',
    timestamp: '2025-01-15T10:37:00Z',
    isFromMe: false,
    isRead: true
  },
  {
    id: '4',
    text: 'The rent is ₹25,000 per month including utilities. We have WiFi, AC, washing machine, and a fully equipped kitchen. The location is great - 10 mins walk to the metro!',
    timestamp: '2025-01-15T10:42:00Z',
    isFromMe: true,
    isRead: true
  },
  {
    id: '5',
    text: 'That sounds perfect! When would be a good time to visit and see the place?',
    timestamp: '2025-01-15T10:45:00Z',
    isFromMe: false,
    isRead: true
  },
  {
    id: '6',
    text: 'How about this evening around 6 PM? I can show you around and we can discuss everything in detail.',
    timestamp: '2025-01-15T10:50:00Z',
    isFromMe: true,
    isRead: false
  },
  {
    id: '7',
    text: 'See you at 7?',
    timestamp: '2025-01-15T18:30:00Z',
    isFromMe: false,
    isRead: false
  }
];

const formatMessageTime = (timestamp: string) => {
  const messageDate = new Date(timestamp);
  return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { colors, typography, shadows } = useTheme();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  // Default values for when route params are not available
  const userName = route?.params?.userName || 'User';
  const userAvatar = route?.params?.userAvatar || 'U';
  const isOnline = route?.params?.isOnline || false;
  const verification = route?.params?.verification || { idUploaded: false, workVerified: false };

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        timestamp: new Date().toISOString(),
        isFromMe: true,
        isRead: false
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={{
      alignSelf: item.isFromMe ? 'flex-end' : 'flex-start',
      marginVertical: 4,
      marginHorizontal: 16,
      maxWidth: '80%'
    }}>
      <LinearGradient
        colors={item.isFromMe 
          ? [colors.primary, colors.primary + 'DD'] 
          : [colors.surface, colors.background]
        }
        style={{
          padding: 12,
          borderRadius: 18,
          borderBottomRightRadius: item.isFromMe ? 4 : 18,
          borderBottomLeftRadius: item.isFromMe ? 18 : 4,
          ...shadows.card
        }}
      >
        <Text style={{
          color: item.isFromMe ? '#fff' : colors.navy,
          fontSize: 16,
          lineHeight: 22
        }}>
          {item.text}
        </Text>
      </LinearGradient>
      
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        alignSelf: item.isFromMe ? 'flex-end' : 'flex-start'
      }}>
        <Text style={{
          color: colors.textSecondary,
          fontSize: 12,
          marginRight: 4
        }}>
          {formatMessageTime(item.timestamp)}
        </Text>
        
        {item.isFromMe && (
          <Ionicons 
            name={item.isRead ? "checkmark-done" : "checkmark"} 
            size={14} 
            color={item.isRead ? colors.primary : colors.textSecondary} 
          />
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <PageTransition>
        {/* Header */}
        <LinearGradient
        colors={[colors.background, colors.surface]}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: colors.surface
        }}
      >
        <TouchableOpacity 
          onPress={() => navigation?.goBack()}
          style={{
            backgroundColor: colors.surface,
            padding: 8,
            borderRadius: 12,
            marginRight: 16
          }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.navy} />
        </TouchableOpacity>

        {/* User Avatar */}
        <View style={{ position: 'relative', marginRight: 12 }}>
          <LinearGradient
            colors={[colors.primary, colors.coral]}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ 
              color: '#fff', 
              fontSize: 16, 
              fontWeight: '700' 
            }}>
              {userAvatar}
            </Text>
          </LinearGradient>
          
          {isOnline && (
            <View style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: colors.success,
              borderWidth: 2,
              borderColor: colors.background
            }} />
          )}
        </View>

        {/* User Info */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[typography.body, { 
              fontWeight: '700', 
              color: colors.navy,
              marginRight: 8
            }]}>
              {userName}
            </Text>
            
            {/* Verification Badges */}
            {verification.idUploaded && (
              <View style={{ 
                backgroundColor: colors.success, 
                paddingHorizontal: 4, 
                paddingVertical: 1, 
                borderRadius: 4, 
                marginRight: 4 
              }}>
                <Text style={{ color: '#fff', fontSize: 8, fontWeight: '600' }}>
                  ID
                </Text>
              </View>
            )}
            {verification.workVerified && (
              <View style={{ 
                backgroundColor: colors.success, 
                paddingHorizontal: 4, 
                paddingVertical: 1, 
                borderRadius: 4 
              }}>
                <Text style={{ color: '#fff', fontSize: 8, fontWeight: '600' }}>
                  WORK
                </Text>
              </View>
            )}
          </View>
          
          <Text style={{ 
            color: colors.textSecondary, 
            fontSize: 12 
          }}>
            {isOnline ? 'Online now' : 'Last seen recently'}
          </Text>
        </View>

        {/* More Options */}
        <TouchableOpacity style={{
          backgroundColor: colors.surface,
          padding: 8,
          borderRadius: 12
        }}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.navy} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingVertical: 16,
          flexGrow: 1
        }}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }}
      />

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.surface
        }}
      >
        <LinearGradient
          colors={[colors.surface, colors.background]}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'flex-end'
          }}
        >
          <View style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginRight: 12,
            maxHeight: 100
          }}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              multiline
              style={{
                color: colors.navy,
                fontSize: 16,
                lineHeight: 20
              }}
            />
          </View>
          
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!inputText.trim()}
            style={{
              backgroundColor: inputText.trim() ? colors.primary : colors.surface,
              padding: 12,
              borderRadius: 20
            }}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() ? '#fff' : colors.textSecondary} 
            />
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAvoidingView>
      </PageTransition>
    </SafeAreaView>
  );
};
