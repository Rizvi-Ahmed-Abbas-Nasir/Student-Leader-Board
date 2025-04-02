import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, 
  Platform, KeyboardAvoidingView, ScrollView, useColorScheme 
} from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const theme = useColorScheme();
  const isDarkMode = theme === 'dark';

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!isLogin && !fullName) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    setLoading(true);
    try {
      let endpoint = isLogin ? '/login' : '/signup';
      let payload = isLogin ? { email, password } : { email, password, fullName };

      const response = await axios.post(`${API_URL}${endpoint}`, payload);

      if (isLogin) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify({
          userId: response.data.userId,
          fullName: response.data.fullName
        }));
        router.replace('/profile');
      } else {
        Alert.alert('Success', 'Account created successfully!');
        setIsLogin(true);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={[styles.container, { backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6' }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: isDarkMode ? '#374151' : 'white' }]}>
          <Text style={[styles.title, { color: isDarkMode ? 'white' : '#1f2937' }]}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          {!isLogin && (
            <TextInput 
              style={[styles.input, { backgroundColor: isDarkMode ? '#4b5563' : 'white', color: isDarkMode ? 'white' : '#1f2937' }]} 
              placeholder="Full Name" 
              value={fullName} 
              onChangeText={setFullName} 
              autoCapitalize="words" 
              placeholderTextColor={isDarkMode ? '#d1d5db' : '#9ca3af'} 
            />
          )}
          <TextInput 
            style={[styles.input, { backgroundColor: isDarkMode ? '#4b5563' : 'white', color: isDarkMode ? 'white' : '#1f2937' }]} 
            placeholder="Email" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
            keyboardType="email-address" 
            placeholderTextColor={isDarkMode ? '#d1d5db' : '#9ca3af'} 
          />
          <TextInput 
            style={[styles.input, { backgroundColor: isDarkMode ? '#4b5563' : 'white', color: isDarkMode ? 'white' : '#1f2937' }]} 
            placeholder="Password" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
            placeholderTextColor={isDarkMode ? '#d1d5db' : '#9ca3af'} 
          />
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleAuth} 
            disabled={loading} 
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>{loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.switchButton} 
            onPress={() => setIsLogin(!isLogin)} 
            activeOpacity={0.7}
          >
            <Text style={[styles.switchText, { color: isDarkMode ? '#93c5fd' : '#6366f1' }]}>
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: 320,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
