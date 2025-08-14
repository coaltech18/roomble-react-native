import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StatusBar } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  setBudgetRange,
  toggleArea,
  toggleMetroLine,
  setVegetarianPreference,
  setFlag,
  setAgeRange,
  setGenderPreference,
  setOccupation,
  resetFilters,
  applyFilters
} from '@/redux/slices/filtersSlice';
import Slider from '@react-native-community/slider';
import { BANGALORE_AREAS, METRO_LINES } from '@/config/areas';
import { PageTransition } from '@/components/PageTransition';

const Chip: React.FC<{ label: string; selected: boolean; onPress: () => void; colors: ReturnType<typeof useTheme>['colors'] }> = ({
  label,
  selected,
  onPress,
  colors
}) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel={label}
    onPress={onPress}
    style={{
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 18,
      backgroundColor: selected ? colors.primary : colors.surface,
      marginRight: 8,
      marginBottom: 8
    }}
  >
    <Text style={{ color: selected ? '#fff' : colors.navy }}>{label}</Text>
  </TouchableOpacity>
);

export const FiltersScreen = () => {
  const dispatch = useDispatch();
  const filters = useSelector((s: RootState) => s.filters);
  const { colors, typography, shadows } = useTheme();
  const [areaSearch, setAreaSearch] = useState('');

  // Safety check - if filters is undefined, return early
  if (!filters || !colors || !typography) {
    return null;
  }

  // Ensure arrays are properly initialized
  const budgetRange = filters.budgetRange || [10000, 50000];
  const ageRange = filters.ageRange || [20, 35];
  const preferredAreas = filters.preferredAreas || [];
  const metroLines = filters.metroLines || [];

  // Check if current filters differ from applied filters
  const hasUnappliedChanges = !filters.appliedFilters || 
    JSON.stringify({
      budgetRange,
      preferredAreas,
      metroLines,
      vegetarianPreference: filters.vegetarianPreference,
      pets: filters.pets,
      smoking: filters.smoking,
      nightOwl: filters.nightOwl,
      ageRange,
      genderPreference: filters.genderPreference,
      occupation: filters.occupation,
      verified: filters.verified,
      workFromHome: filters.workFromHome,
      startupCollaboration: filters.startupCollaboration,
      familyVisitAccommodation: filters.familyVisitAccommodation
    }) !== JSON.stringify(filters.appliedFilters);

  const filteredAreas = BANGALORE_AREAS.filter(area => 
    area.toLowerCase().includes(areaSearch.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <PageTransition>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={[typography.heading]}>Filters</Text>
      <Text style={{ marginTop: 12, color: colors.textSecondary }}>Budget Range (₹{budgetRange[0].toLocaleString()} - ₹{budgetRange[1].toLocaleString()})</Text>
      <View style={{ marginVertical: 8 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 4 }}>Minimum: ₹{budgetRange[0].toLocaleString()}</Text>
        <Slider
          style={{ height: 40 }}
          minimumValue={5000}
          maximumValue={100000}
          step={1000}
          value={budgetRange[0]}
          onValueChange={(value) => dispatch(setBudgetRange([value, Math.max(value + 5000, budgetRange[1])]))}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
        <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 4 }}>Maximum: ₹{budgetRange[1].toLocaleString()}</Text>
        <Slider
          style={{ height: 40 }}
          minimumValue={10000}
          maximumValue={100000}
          step={1000}
          value={budgetRange[1]}
          onValueChange={(value) => dispatch(setBudgetRange([Math.min(budgetRange[0], value - 5000), value]))}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
      </View>

      <Text style={{ marginTop: 12, color: colors.textSecondary }}>Areas</Text>
      <TextInput
        placeholder="Search areas..."
        placeholderTextColor={colors.textSecondary}
        value={areaSearch}
        onChangeText={setAreaSearch}
        style={{ 
          backgroundColor: colors.surface, 
          padding: 12, 
          borderRadius: 10, 
          marginVertical: 8,
          color: colors.navy
        }}
      />
      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8 }}>
        <TouchableOpacity
          onPress={() => {
            ['Koramangala', 'HSR Layout', 'Indiranagar'].forEach(a => dispatch(toggleArea(a)));
          }}
          style={{ backgroundColor: colors.primary, padding: 8, borderRadius: 8 }}
        >
          <Text style={{ color: '#fff', fontSize: 12 }}>Tech Hubs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            ['Whitefield', 'Electronic City', 'Marathahalli'].forEach(a => dispatch(toggleArea(a)));
          }}
          style={{ backgroundColor: colors.coral, padding: 8, borderRadius: 8 }}
        >
          <Text style={{ color: '#fff', fontSize: 12 }}>IT Parks</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 }}>
        {filteredAreas.map((a) => (
          <Chip key={a} label={a} selected={preferredAreas.includes(a)} onPress={() => dispatch(toggleArea(a))} colors={colors} />
        ))}
      </View>

      <Text style={{ marginTop: 12, color: colors.textSecondary }}>Metro Lines</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 }}>
        {METRO_LINES.map((l) => (
          <Chip key={l} label={l} selected={metroLines.includes(l)} onPress={() => dispatch(toggleMetroLine(l))} colors={colors} />
        ))}
      </View>

      <Text style={{ marginTop: 12, color: colors.textSecondary }}>Lifestyle</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 }}>
        <Chip
          label="Vegetarian"
          selected={filters.vegetarianPreference === true}
          onPress={() => dispatch(setVegetarianPreference(filters.vegetarianPreference ? undefined : true))}
          colors={colors}
        />
        <Chip
          label="Pets"
          selected={!!filters.pets}
          onPress={() => dispatch(setFlag({ key: 'pets', value: !filters.pets }))}
          colors={colors}
        />
        <Chip
          label="Smoking"
          selected={!!filters.smoking}
          onPress={() => dispatch(setFlag({ key: 'smoking', value: !filters.smoking }))}
          colors={colors}
        />
        <Chip
          label="Night Owl"
          selected={!!filters.nightOwl}
          onPress={() => dispatch(setFlag({ key: 'nightOwl', value: !filters.nightOwl }))}
          colors={colors}
        />
      </View>

      <Text style={{ marginTop: 12, color: colors.textSecondary }}>Age Range ({ageRange[0]} - {ageRange[1]} years)</Text>
      <View style={{ marginVertical: 8 }}>
        <Slider
          style={{ height: 40 }}
          minimumValue={18}
          maximumValue={65}
          step={1}
          value={ageRange[0]}
          onValueChange={(value) => dispatch(setAgeRange([value, Math.max(value + 1, ageRange[1])]))}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
        <Slider
          style={{ height: 40 }}
          minimumValue={18}
          maximumValue={65}
          step={1}
          value={ageRange[1]}
          onValueChange={(value) => dispatch(setAgeRange([Math.min(ageRange[0], value - 1), value]))}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
      </View>

      <Text style={{ marginTop: 12, color: colors.textSecondary }}>Gender Preference</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 }}>
        {['Male', 'Female', 'Any'].map((gender) => (
          <Chip
            key={gender}
            label={gender}
            selected={filters.genderPreference === gender}
            onPress={() => dispatch(setGenderPreference(filters.genderPreference === gender ? undefined : gender))}
            colors={colors}
          />
        ))}
      </View>

      <Text style={{ marginTop: 12, color: colors.textSecondary }}>Occupation</Text>
      <TextInput
        placeholder="e.g. Software Engineer, Doctor..."
        placeholderTextColor={colors.textSecondary}
        value={filters.occupation || ''}
        onChangeText={(text) => dispatch(setOccupation(text || undefined))}
        style={{ 
          backgroundColor: colors.surface, 
          padding: 12, 
          borderRadius: 10, 
          marginVertical: 8,
          color: colors.navy
        }}
      />

      <Text style={{ marginTop: 12, color: colors.textSecondary }}>Additional Preferences</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 }}>
        <Chip
          label="Verified Only"
          selected={!!filters.verified}
          onPress={() => dispatch(setFlag({ key: 'verified', value: !filters.verified }))}
          colors={colors}
        />
        <Chip
          label="Work From Home"
          selected={!!filters.workFromHome}
          onPress={() => dispatch(setFlag({ key: 'workFromHome', value: !filters.workFromHome }))}
          colors={colors}
        />
        <Chip
          label="Startup Collaboration"
          selected={!!filters.startupCollaboration}
          onPress={() => dispatch(setFlag({ key: 'startupCollaboration', value: !filters.startupCollaboration }))}
          colors={colors}
        />
        <Chip
          label="Family Visit Accommodation"
          selected={!!filters.familyVisitAccommodation}
          onPress={() => dispatch(setFlag({ key: 'familyVisitAccommodation', value: !filters.familyVisitAccommodation }))}
          colors={colors}
        />
      </View>

      <TouchableOpacity 
        onPress={() => dispatch(applyFilters())} 
        disabled={!hasUnappliedChanges}
        style={{ 
          marginTop: 12, 
          backgroundColor: hasUnappliedChanges ? colors.primary : colors.surface, 
          padding: 12, 
          borderRadius: 10, 
          alignItems: 'center' 
        }}
      >
        <Text style={{ 
          color: hasUnappliedChanges ? '#fff' : colors.textSecondary, 
          fontWeight: '700' 
        }}>
          {filters.isApplied && !hasUnappliedChanges ? 'Filters Applied' : 'Apply Filters'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => dispatch(resetFilters())} style={{ marginTop: 8, backgroundColor: colors.coral, padding: 12, borderRadius: 10, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Reset Filters</Text>
      </TouchableOpacity>
        </ScrollView>
      </PageTransition>
    </View>
  );
};


