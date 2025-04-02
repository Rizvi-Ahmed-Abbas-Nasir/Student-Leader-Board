import { Tabs } from 'expo-router';
import { Trophy, User, LogIn } from 'lucide-react-native';
import { Platform, useColorScheme } from 'react-native';

export default function TabLayout() {
  const theme = useColorScheme();
  const isDarkMode = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: isDarkMode ? '#93c5fd' : '#6366f1',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 60,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          backgroundColor: isDarkMode ? '#1f2937' : 'white',
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? '#374151' : '#e5e7eb',
        },
        headerStyle: {
          backgroundColor: isDarkMode ? '#1f2937' : 'white',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: isDarkMode ? 'white' : '#1f2937',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          color: isDarkMode ? 'white' : '#1f2937',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Technetics Leaderboard by CESA & CSI',
          tabBarIcon: ({ size, color }) => (
            <Trophy size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="auth"
        options={{
          title: 'Login',
          tabBarIcon: ({ size, color }) => (
            <LogIn size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
