import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/useTheme';

const mockChats = [
  { id: 'm1', name: 'Aarav', lastMessage: 'See you at 7?', lastMessageAt: '2025-08-01' },
  { id: 'm2', name: 'Diya', lastMessage: 'Sent you the flat pics', lastMessageAt: '2025-08-06' }
];

export const ChatListScreen = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <FlatList
        data={mockChats}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ backgroundColor: colors.surface, padding: 16, borderRadius: 12 }}
          >
            <Text style={{ fontWeight: '700', color: colors.navy }}>{item.name}</Text>
            <Text style={{ color: colors.textSecondary }}>{item.lastMessage}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};


