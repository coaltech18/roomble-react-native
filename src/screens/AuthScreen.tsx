import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  StatusBar
} from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { useDispatch } from 'react-redux';
import { setSession } from '@/redux/slices/authSlice';
import { setProfile } from '@/redux/slices/profileSlice';
import { verifyOtp, registerUser, sendOtp, RegistrationData } from '@/services/authService';
import { z } from 'zod';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Helper function to create profile data from user data
const createProfileFromUser = (user: any) => ({
  id: user.id,
  name: user.name,
  age: user.age,
  gender: user.gender,
  occupation: user.occupation,
  role: 'seeking_room' as const,
  photoUrls: [],
  bio: '',
  location: { lat: 0, lng: 0 },
  preferences: {
    budgetRange: [15000, 30000] as [number, number],
    preferredAreas: [],
    lifestyle: '',
    dealBreakers: [],
    maxDistance: 10,
    ageRange: [22, 30] as [number, number],
    occupationPreferences: [],
    vegetarianPreference: false
  },
  verification: { idUploaded: false, workVerified: false },
  createdAt: new Date().toISOString(),
  isActive: true,
  achievements: [],
  stats: {
    profileViews: 0,
    likesReceived: 0,
    conversations: 0,
    daysActive: 0,
    matchesFound: 0,
    lastActive: new Date().toISOString()
  }
});

const registrationSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.coerce.number().min(18, 'Must be 18 or older').max(65, 'Age must be 65 or younger'),
  gender: z.string().min(1, 'Please select gender'),
  occupation: z.string().min(2, 'Occupation must be at least 2 characters')
});

export const AuthScreen = () => {
  const dispatch = useDispatch();
  const { colors, typography, spacing } = useTheme();
  const { width, height } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Responsive calculations
  const isTablet = width >= 768;
  const isLandscape = width > height;
  const isSmallScreen = height < 700;
  
  // Dynamic sizing
  const containerMaxWidth = isTablet ? 500 : Math.min(width * 0.9, 400);
  const headerFontSize = isTablet ? 40 : isSmallScreen ? 28 : 32;
  const inputHeight = isTablet ? 56 : 48;
  const buttonHeight = isTablet ? 56 : 48;
  const fontSize = isTablet ? 18 : 16;
  const paddingHorizontal = isTablet ? spacing.xxl : spacing.xl;
  const paddingVertical = isSmallScreen ? spacing.lg : spacing.xl;

  // Login state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Registration state
  const [regPhone, setRegPhone] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  const onSendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Invalid number', 'Enter a valid 10-digit phone number');
      return;
    }

    try {
      setSendingOtp(true);
      await sendOtp({ phone });
      setOtpSent(true);
      Alert.alert('OTP Sent', 'Please check your phone for the OTP (demo mode - any 4-6 digit code will work)');
    } catch (e: any) {
      Alert.alert('Failed to send OTP', e?.response?.data?.error || e?.message || 'Please try again later');
    } finally {
      setSendingOtp(false);
    }
  };

  const onVerify = async () => {
    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Invalid number', 'Enter a valid 10-digit phone number');
      return;
    }
    if (!/^\d{4,6}$/.test(otp)) {
      Alert.alert('Invalid OTP', 'Enter the OTP sent to your phone');
      return;
    }

    try {
      setLoginLoading(true);
      const res = await verifyOtp({ phone, otp });
      dispatch(setSession({ userId: res.userId, accessToken: res.token, phone }));
      
      // Set profile data if available
      if (res.user) {
        dispatch(setProfile(createProfileFromUser(res.user)));
      }
    } catch (e: any) {
      const errorMessage = e?.response?.data?.error || e?.message || 'Please try again later';
      if (errorMessage.includes('not found')) {
        Alert.alert('User not found', 'Please register first or check your phone number.');
      } else {
        Alert.alert('Verification failed', errorMessage);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const onRegister = async () => {
    const result = registrationSchema.safeParse({ phone: regPhone, name, age, gender, occupation });
    if (!result.success) {
      Alert.alert('Invalid details', 'Please fill all fields correctly');
      return;
    }
    try {
      setRegisterLoading(true);
      const registrationData: RegistrationData = {
        phone: regPhone,
        name,
        age: parseInt(age),
        gender,
        occupation
      };
      
      const res = await registerUser(registrationData);
      dispatch(setSession({ userId: res.userId, accessToken: res.token, phone: regPhone }));
      
      // Set profile data from registration
      if (res.user) {
        dispatch(setProfile(createProfileFromUser(res.user)));
      }
      
      Alert.alert('Success', 'Registration successful! Welcome to Roomble.');
    } catch (e: any) {
      Alert.alert('Registration failed', e?.response?.data?.error || e?.message || 'Please try again later');
    } finally {
      setRegisterLoading(false);
    }
  };

  const renderLoginForm = () => (
    <View style={{ gap: spacing.md, width: '100%' }}>
      <Text style={{ 
        ...typography.heading, 
        textAlign: 'center', 
        marginBottom: spacing.sm,
        fontSize: isTablet ? 28 : 24
      }}>
        Welcome Back
      </Text>
      <Text style={{ 
        color: colors.textSecondary, 
        textAlign: 'center', 
        marginBottom: spacing.lg,
        fontSize: isTablet ? 18 : 16
      }}>
        Sign in to continue your journey
      </Text>

      <View style={{ gap: spacing.md }}>
        <TextInput
          placeholder="Phone number"
          keyboardType="number-pad"
          value={phone}
          onChangeText={setPhone}
          style={{
            backgroundColor: colors.surface,
            padding: spacing.md,
            borderRadius: 12,
            fontSize,
            height: inputHeight,
            textAlignVertical: 'center'
          }}
        />
        
        {otpSent && (
          <TextInput
            placeholder="OTP"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            style={{
              backgroundColor: colors.surface,
              padding: spacing.md,
              borderRadius: 12,
              fontSize,
              height: inputHeight,
              textAlignVertical: 'center'
            }}
          />
        )}
      </View>

      <View style={{ gap: spacing.md, marginTop: spacing.md }}>
        {!otpSent ? (
          <TouchableOpacity
            onPress={onSendOtp}
            disabled={sendingOtp}
            style={{
              backgroundColor: colors.primary,
              padding: spacing.md,
              borderRadius: 12,
              alignItems: 'center',
              height: buttonHeight,
              justifyContent: 'center'
            }}
          >
            {sendingOtp ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: '#fff', fontWeight: '700', fontSize }}>
                Send OTP
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onVerify}
            disabled={loginLoading}
            style={{
              backgroundColor: colors.coral,
              padding: spacing.md,
              borderRadius: 12,
              alignItems: 'center',
              height: buttonHeight,
              justifyContent: 'center'
            }}
          >
            {loginLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: '#fff', fontWeight: '700', fontSize }}>
                Sign In
              </Text>
            )}
          </TouchableOpacity>
        )}
        
        {otpSent && (
          <TouchableOpacity
            onPress={() => {
              setOtpSent(false);
              setOtp('');
            }}
            style={{
              backgroundColor: 'transparent',
              padding: spacing.md,
              borderRadius: 12,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.textSecondary,
              height: buttonHeight,
              justifyContent: 'center'
            }}
          >
            <Text style={{ color: colors.textSecondary, fontWeight: '600', fontSize }}>
              Change Phone Number
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderRegistrationForm = () => (
    <View style={{ gap: spacing.md, width: '100%' }}>
      <Text style={{ 
        ...typography.heading, 
        textAlign: 'center', 
        marginBottom: spacing.sm,
        fontSize: isTablet ? 28 : 24
      }}>
        Create Account
      </Text>
      <Text style={{ 
        color: colors.textSecondary, 
        textAlign: 'center', 
        marginBottom: spacing.lg,
        fontSize: isTablet ? 18 : 16
      }}>
        Join Roomble and find your perfect match
      </Text>

      <View style={{ gap: spacing.md }}>
        <TextInput
          placeholder="Phone Number"
          keyboardType="number-pad"
          value={regPhone}
          onChangeText={setRegPhone}
          style={{
            backgroundColor: colors.surface,
            padding: spacing.md,
            borderRadius: 12,
            fontSize,
            height: inputHeight,
            textAlignVertical: 'center'
          }}
        />
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={{
            backgroundColor: colors.surface,
            padding: spacing.md,
            borderRadius: 12,
            fontSize,
            height: inputHeight,
            textAlignVertical: 'center'
          }}
        />
        <TextInput
          placeholder="Age"
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
          style={{
            backgroundColor: colors.surface,
            padding: spacing.md,
            borderRadius: 12,
            fontSize,
            height: inputHeight,
            textAlignVertical: 'center'
          }}
        />
        <TextInput
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
          style={{
            backgroundColor: colors.surface,
            padding: spacing.md,
            borderRadius: 12,
            fontSize,
            height: inputHeight,
            textAlignVertical: 'center'
          }}
        />
        <TextInput
          placeholder="Occupation"
          value={occupation}
          onChangeText={setOccupation}
          style={{
            backgroundColor: colors.surface,
            padding: spacing.md,
            borderRadius: 12,
            fontSize,
            height: inputHeight,
            textAlignVertical: 'center'
          }}
        />
      </View>

      <TouchableOpacity
        onPress={onRegister}
        disabled={registerLoading}
        style={{
          backgroundColor: colors.primary,
          padding: spacing.md,
          borderRadius: 12,
          alignItems: 'center',
          marginTop: spacing.md,
          height: buttonHeight,
          justifyContent: 'center'
        }}
      >
        {registerLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: '700', fontSize }}>
            Create Account
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal,
            paddingVertical,
            gap: spacing.xl,
            width: '100%',
            alignSelf: 'center',
            minHeight: isLandscape ? '100%' : 'auto',
            justifyContent: isLandscape ? 'center' : 'flex-start',
            flexGrow: 1
          }}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ 
            maxWidth: containerMaxWidth, 
            width: '100%', 
            alignSelf: 'center',
            flex: 1,
            justifyContent: isLandscape ? 'center' : 'flex-start'
          }}>
            {/* Header */}
            <View style={{ 
              alignItems: 'center', 
              marginBottom: isLandscape ? spacing.xl : spacing.xxl,
              marginTop: isLandscape ? 0 : spacing.xl
            }}>
              <Text style={{ 
                ...typography.heading, 
                fontSize: headerFontSize, 
                marginBottom: spacing.sm,
                textAlign: 'center'
              }}>
                Roomble
              </Text>
              <Text style={{ 
                color: colors.textSecondary, 
                fontSize: isTablet ? 18 : 16,
                textAlign: 'center'
              }}>
                Find your perfect roommate
              </Text>
            </View>

            {/* Tab Navigation */}
            <View style={{
              flexDirection: 'row',
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 4,
              marginBottom: spacing.xl,
              height: isTablet ? 56 : 48
            }}>
              <TouchableOpacity
                onPress={() => setActiveTab('login')}
                style={{
                  flex: 1,
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.lg,
                  borderRadius: 8,
                  backgroundColor: activeTab === 'login' ? colors.background : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={{
                  fontWeight: '600',
                  color: activeTab === 'login' ? colors.navy : colors.textSecondary,
                  fontSize: isTablet ? 16 : 14
                }}>
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('register')}
                style={{
                  flex: 1,
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.lg,
                  borderRadius: 8,
                  backgroundColor: activeTab === 'register' ? colors.background : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={{
                  fontWeight: '600',
                  color: activeTab === 'register' ? colors.navy : colors.textSecondary,
                  fontSize: isTablet ? 16 : 14
                }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View style={{ flex: 1, justifyContent: 'center' }}>
              {activeTab === 'login' ? renderLoginForm() : renderRegistrationForm()}
            </View>

            {/* Footer */}
            <View style={{ 
              alignItems: 'center', 
              marginTop: isLandscape ? spacing.lg : spacing.xxl,
              marginBottom: isLandscape ? spacing.lg : 0
            }}>
              <Text style={{ 
                color: colors.textSecondary, 
                textAlign: 'center',
                fontSize: isTablet ? 16 : 14
              }}>
                {activeTab === 'login'
                  ? "Don't have an account? "
                  : "Already have an account? "
                }
                <Text
                  style={{ color: colors.primary, fontWeight: '600' }}
                  onPress={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                >
                  {activeTab === 'login' ? 'Sign Up' : 'Sign In'}
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};


