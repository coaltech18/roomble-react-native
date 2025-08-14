import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, Dimensions, StatusBar, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Swiper from 'react-native-deck-swiper';
import { useTheme } from '@/theme/useTheme';
import { fetchPotentialMatches } from '@/services/matchingService';
import { getReadableError } from '@/utils/error';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { consumeSuperLike, resetDaily } from '@/redux/slices/matchingSlice';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';
import { PageTransition } from '@/components/PageTransition';

type Card = { 
  id: string; 
  name: string; 
  age: number; 
  area: string; 
  verification?: { idUploaded: boolean; workVerified: boolean };
  mutualPreference?: boolean;
  startupCollaboration?: boolean;
  familyVisitAccommodation?: boolean;
};
const seedCards: Card[] = [
  { 
    id: '1', 
    name: 'Aarav', 
    age: 24, 
    area: 'Koramangala',
    verification: { idUploaded: true, workVerified: true },
    mutualPreference: true,
    startupCollaboration: true
  },
  { 
    id: '2', 
    name: 'Diya', 
    age: 26, 
    area: 'HSR Layout',
    verification: { idUploaded: true, workVerified: false },
    familyVisitAccommodation: true
  },
  { 
    id: '3', 
    name: 'Rohan', 
    age: 28, 
    area: 'Whitefield',
    verification: { idUploaded: false, workVerified: true },
    startupCollaboration: true
  },
  { 
    id: '4', 
    name: 'Neha', 
    age: 25, 
    area: 'Indiranagar',
    verification: { idUploaded: true, workVerified: true },
    mutualPreference: true,
    familyVisitAccommodation: true
  },
  { id: '5', name: 'Karthik', age: 27, area: 'BTM Layout' },
  { 
    id: '6', 
    name: 'Ananya', 
    age: 23, 
    area: 'Bellandur',
    verification: { idUploaded: true, workVerified: false }
  },
  { id: '7', name: 'Vikram', age: 30, area: 'Electronic City' },
  { 
    id: '8', 
    name: 'Meera', 
    age: 26, 
    area: 'Marathahalli',
    verification: { idUploaded: true, workVerified: true },
    startupCollaboration: true
  },
  { id: '9', name: 'Sanjay', age: 29, area: 'Hebbal' },
  { 
    id: '10', 
    name: 'Pooja', 
    age: 24, 
    area: 'Jayanagar',
    familyVisitAccommodation: true
  }
];

export const MatchScreen = () => {
  const swiperRef = useRef<Swiper<Card>>(null);
  const [cards, setCards] = useState<Card[]>(seedCards);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { colors, typography, shadows } = useTheme();
  const [fireConfetti, setFireConfetti] = useState(false);
  const { width, height } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const appliedFilters = useSelector((state: RootState) => state.filters.appliedFilters);

  useEffect(() => {
    // reset daily super likes
    dispatch(resetDaily());
    // Try fetching from backend; fallback to seed
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchPotentialMatches(appliedFilters);
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Card[] = data.map((d: any, idx: number) => ({
            id: d.id ?? String(idx),
            name: d.name ?? 'User',
            age: d.age ?? 25,
            area: d.area ?? 'Bangalore',
            verification: d.verification,
            mutualPreference: d.mutualPreference,
            startupCollaboration: d.startupCollaboration,
            familyVisitAccommodation: d.familyVisitAccommodation
          }));
          setCards(mapped);
        } else {
          setCards(seedCards);
        }
      } catch (e) {
        Alert.alert('Could not load matches', getReadableError(e));
        setCards(seedCards);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [appliedFilters]);

  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        
        <PageTransition>
        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : cards.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.textSecondary }}>
              No more profiles. Please check again later.
            </Text>
          </View>
        ) : (
        <Swiper
        ref={swiperRef}
        cards={cards}
        renderCard={(card) => (
          <LinearGradient
            colors={card?.mutualPreference ? [colors.primary + '10', colors.background] : [colors.surface, colors.background]}
            style={{
              borderRadius: 16,
              padding: 20,
              // Ensure card height adapts to screen minus safe areas and bottom actions
              height: Math.min(520, height - insets.top - insets.bottom - 200),
              ...shadows.card,
              borderWidth: 2,
              borderColor: card?.mutualPreference ? colors.primary : colors.primary + '20'
            }}
          >
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              <View>
                {/* Mutual Preference Indicator */}
                {card?.mutualPreference && (
                  <View style={{ 
                    backgroundColor: colors.primary, 
                    paddingHorizontal: 10, 
                    paddingVertical: 6, 
                    borderRadius: 16, 
                    alignSelf: 'flex-start',
                    marginBottom: 8,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
                      💫 Mutual Interest
                    </Text>
                  </View>
                )}
                
                {/* Area Badge */}
                <View style={{ 
                  backgroundColor: colors.primary + '20', 
                  paddingHorizontal: 8, 
                  paddingVertical: 4, 
                  borderRadius: 12, 
                  alignSelf: 'flex-start',
                  marginBottom: 8
                }}>
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>
                    {card?.area}
                  </Text>
                </View>

                {/* Name and Age with Verification Badges */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={[typography.heading, { marginRight: 8 }]}>
                    {card?.name}, {card?.age}
                  </Text>
                  {card?.verification?.idUploaded && (
                    <View style={{ 
                      backgroundColor: colors.success, 
                      paddingHorizontal: 6, 
                      paddingVertical: 2, 
                      borderRadius: 8, 
                      marginRight: 4 
                    }}>
                      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>
                        ID ✓
                      </Text>
                    </View>
                  )}
                  {card?.verification?.workVerified && (
                    <View style={{ 
                      backgroundColor: colors.success, 
                      paddingHorizontal: 6, 
                      paddingVertical: 2, 
                      borderRadius: 8 
                    }}>
                      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>
                        WORK ✓
                      </Text>
                    </View>
                  )}
                </View>

                {/* Feature Tags */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
                  {card?.startupCollaboration && (
                    <View style={{ 
                      backgroundColor: colors.coral + '20', 
                      paddingHorizontal: 8, 
                      paddingVertical: 4, 
                      borderRadius: 12, 
                      marginRight: 6,
                      marginBottom: 4
                    }}>
                      <Text style={{ color: colors.coral, fontSize: 11, fontWeight: '600' }}>
                        🚀 Startup Collab
                      </Text>
                    </View>
                  )}
                  {card?.familyVisitAccommodation && (
                    <View style={{ 
                      backgroundColor: colors.coral + '20', 
                      paddingHorizontal: 8, 
                      paddingVertical: 4, 
                      borderRadius: 12, 
                      marginRight: 6,
                      marginBottom: 4
                    }}>
                      <Text style={{ color: colors.coral, fontSize: 11, fontWeight: '600' }}>
                        👨‍👩‍👧‍👦 Family Visits OK
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={{ 
                backgroundColor: colors.coral + '20', 
                padding: 12, 
                borderRadius: 12,
                alignItems: 'center'
              }}>
                <Text style={{ color: colors.coral, fontWeight: '600' }}>
                  Swipe to connect! 💫
                </Text>
              </View>
            </View>
          </LinearGradient>
        )}
        overlayLabels={{}}
        onSwipedLeft={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        onSwipedRight={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setFireConfetti(true);
          setTimeout(() => setFireConfetti(false), 1200);
        }}
        onSwipedAll={() => {
          // Loop by resetting cards for now. In production, fetch next page.
          setCards((prev) => (prev.length ? [...prev] : seedCards));
        }}
        backgroundColor={colors.background}
        cardIndex={0}
        stackSize={3}
              />
        )}
        {!loading && (
        <View style={{ position: 'absolute', bottom: Math.max(16, insets.bottom + 8), left: 0, right: 0, alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              dispatch(consumeSuperLike());
              swiperRef.current?.swipeRight();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setFireConfetti(true);
              setTimeout(() => setFireConfetti(false), 1200);
            }}
            style={{
              backgroundColor: colors.coral,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 24
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Super Like (∞)</Text>
          </TouchableOpacity>
        </View>
      )}
      {fireConfetti && (
        <ConfettiCannon
          count={80}
            origin={{ x: width / 2, y: height - insets.bottom }}
          fadeOut
          autoStart
        />
      )}
        </PageTransition>
      </SafeAreaView>
    </LinearGradient>
  );
};


