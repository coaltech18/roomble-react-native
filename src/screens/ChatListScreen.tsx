import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { PageTransition } from '@/components/PageTransition';
import { useTheme } from '@/theme/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const mockChats = [
  { 
    id: 'm1', 
    name: 'Aarav', 
    lastMessage: 'See you at 7?', 
    lastMessageAt: '2025-01-15T18:30:00Z',
    unreadCount: 2,
    isOnline: true,
    avatar: 'A',
    verification: { idUploaded: true, workVerified: true }
  },
  { 
    id: 'm2', 
    name: 'Diya', 
    lastMessage: 'Sent you the flat pics', 
    lastMessageAt: '2025-01-15T14:22:00Z',
    unreadCount: 0,
    isOnline: false,
    avatar: 'D',
    verification: { idUploaded: true, workVerified: false }
  },
  { 
    id: 'm3', 
    name: 'Rohan', 
    lastMessage: 'Thanks for showing me around!', 
    lastMessageAt: '2025-01-14T20:15:00Z',
    unreadCount: 1,
    isOnline: true,
    avatar: 'R',
    verification: { idUploaded: false, workVerified: true }
  },
  { 
    id: 'm4', 
    name: 'Neha', 
    lastMessage: 'The place looks perfect 🏠', 
    lastMessageAt: '2025-01-14T16:45:00Z',
    unreadCount: 0,
    isOnline: false,
    avatar: 'N',
    verification: { idUploaded: true, workVerified: true }
  }
];

// Helper function to format timestamp
const formatMessageTime = (timestamp: string) => {
  const messageDate = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h`;
  } else if (diffInHours < 48) {
    return 'yesterday';
  } else {
    return `${Math.floor(diffInHours / 24)}d`;
  }
};

type ChatListScreenProps = {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
};

export const ChatListScreen: React.FC<ChatListScreenProps> = ({ navigation }) => {
  const { colors, typography, shadows } = useTheme();
  
  const handleChatPress = (item: typeof mockChats[0]) => {
    navigation.navigate('Chat', {
      chatId: item.id,
      userName: item.name,
      userAvatar: item.avatar,
      isOnline: item.isOnline,
      verification: item.verification
    });
  };
  
  const renderChatItem = ({ item }: { item: typeof mockChats[0] }) => (
    <TouchableOpacity
      onPress={() => handleChatPress(item)}
      style={{
        backgroundColor: colors.background,
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 16,
        ...shadows.card,
        overflow: 'hidden'
      }}
    >
      <LinearGradient
        colors={[colors.surface, colors.background]}
        style={{
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        {/* Avatar with Online Status */}
        <View style={{ position: 'relative', marginRight: 16 }}>
          <LinearGradient
            colors={[colors.primary, colors.coral]}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ 
              color: '#fff', 
              fontSize: 20, 
              fontWeight: '700' 
            }}>
              {item.avatar}
            </Text>
          </LinearGradient>
          
          {/* Online Status Indicator */}
          {item.isOnline && (
            <View style={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: colors.success,
              borderWidth: 2,
              borderColor: colors.background
            }} />
          )}
        </View>

        {/* Chat Content */}
        <View style={{ flex: 1, marginRight: 12 }}>
          {/* Name and Verification */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={[typography.body, { 
              fontWeight: '700', 
              color: colors.navy,
              flex: 1
            }]}>
              {item.name}
            </Text>
            
            {/* Verification Badges */}
            <View style={{ flexDirection: 'row' }}>
              {item.verification.idUploaded && (
                <View style={{ 
                  backgroundColor: colors.success, 
                  paddingHorizontal: 4, 
                  paddingVertical: 1, 
                  borderRadius: 4, 
                  marginLeft: 4 
                }}>
                  <Text style={{ color: '#fff', fontSize: 8, fontWeight: '600' }}>
                    ID
                  </Text>
                </View>
              )}
              {item.verification.workVerified && (
                <View style={{ 
                  backgroundColor: colors.success, 
                  paddingHorizontal: 4, 
                  paddingVertical: 1, 
                  borderRadius: 4, 
                  marginLeft: 2 
                }}>
                  <Text style={{ color: '#fff', fontSize: 8, fontWeight: '600' }}>
                    WORK
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Last Message */}
          <Text style={{ 
            color: colors.textSecondary, 
            fontSize: 14,
            fontWeight: item.unreadCount > 0 ? '600' : '400'
          }} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>

        {/* Right Side - Time and Unread */}
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ 
            color: colors.textSecondary, 
            fontSize: 12, 
            marginBottom: 4 
          }}>
            {formatMessageTime(item.lastMessageAt)}
          </Text>
          
          {/* Unread Count Badge */}
          {item.unreadCount > 0 && (
            <View style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              minWidth: 24,
              height: 24,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 8
            }}>
              <Text style={{ 
                color: '#fff', 
                fontSize: 12, 
                fontWeight: '700' 
              }}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <PageTransition>
        {/* Header */}
        <LinearGradient
        colors={[colors.background, colors.surface]}
        style={{
          paddingTop: 50,
          paddingBottom: 20,
          paddingHorizontal: 20
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[typography.heading, { 
            fontSize: 28,
            color: colors.navy 
          }]}>
            Messages
          </Text>
          
          <TouchableOpacity style={{
            backgroundColor: colors.primary + '20',
            padding: 12,
            borderRadius: 12
          }}>
            <Ionicons name="search" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Active Chats Count */}
        <Text style={{ 
          color: colors.textSecondary, 
          fontSize: 14,
          marginTop: 4
        }}>
          {mockChats.filter(chat => chat.unreadCount > 0).length} new messages
        </Text>
      </LinearGradient>

      {/* Chat List */}
      <FlatList
        data={mockChats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
      </PageTransition>
    </View>
  );
};


