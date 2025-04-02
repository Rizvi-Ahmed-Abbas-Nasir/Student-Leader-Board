import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, RefreshControl, 
  Platform, Pressable, Appearance, useColorScheme 
} from 'react-native';
import axios from 'axios';
import { Trophy, Medal, Moon, Sun } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Student = {
  _id: string;
  fullName: string;
  score: number;
  rank: number;
};

export default function LeaderboardScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      
      const rankedStudents = response.data.map((student: any, index: number) => ({
        ...student,
        rank: index + 1
      }));

      setStudents(rankedStudents);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setDarkMode(colorScheme === 'dark');
    });
    return () => subscription.remove();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getRankColors = (rank: number): [string, string, ...string[]] => {
    if (darkMode) {
      switch (rank) {
        case 1: return ['#FFD700', '#B8860B']; // Dark gold
        case 2: return ['#C0C0C0', '#808080']; // Dark silver
        case 3: return ['#CD7F32', '#8B4513']; // Bronze
        default: return ['#7C3AED', '#5B21B6']; // Dark purple
      }
    } else {
      switch (rank) {
        case 1: return ['#FFD700', '#FFA500']; // Gold
        case 2: return ['#C0C0C0', '#A9A9A9']; // Silver
        case 3: return ['#CD7F32', '#8B4513']; // Bronze
        default: return ['#6366f1', '#4f46e5']; // Purple
      }
    }
  };

  const renderItem = ({ item }: { item: Student }) => (
    <View style={styles(darkMode).studentCard}>
      <LinearGradient
        colors={getRankColors(item.rank)}
        style={styles(darkMode).rankBadge}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {item.rank <= 3 ? (
          <Medal size={24} color="white" />
        ) : (
          <Text style={styles(darkMode).rankText}>{item.rank}</Text>
        )}
      </LinearGradient>
      <View style={styles(darkMode).studentInfo}>
        <Text style={styles(darkMode).name}>{item.fullName}</Text>
        <Text style={styles(darkMode).score}>{item.score} points</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles(darkMode).container}>
        <Text style={styles(darkMode).loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles(darkMode).container}>
      <View style={styles(darkMode).header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Trophy size={32} color={darkMode ? '#7C3AED' : '#6366f1'} />
          <Text style={styles(darkMode).title}>Top Students</Text>
        </View>
        <Pressable onPress={toggleDarkMode} style={styles(darkMode).themeToggle}>
          {darkMode ? (
            <Sun size={24} color="#FBBF24" />
          ) : (
            <Moon size={24} color="#1E40AF" />
          )}
        </Pressable>
      </View>
      
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={darkMode ? ['#7C3AED'] : ['#6366f1']}
            tintColor={darkMode ? '#7C3AED' : '#6366f1'}
            progressBackgroundColor={darkMode ? '#1F2937' : '#F3F4F6'}
          />
        }
        contentContainerStyle={styles(darkMode).list}
      />
    </View>
  );
}

const styles = (darkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkMode ? '#111827' : '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: darkMode ? '#1F2937' : 'white',
    borderBottomWidth: 1,
    borderBottomColor: darkMode ? '#374151' : '#e5e7eb',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: darkMode ? 0.3 : 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    color: darkMode ? '#F3F4F6' : '#1f2937',
  },
  themeToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: darkMode ? '#374151' : '#E5E7EB',
  },
  loadingText: {
    color: darkMode ? '#F3F4F6' : '#1f2937',
    fontSize: 16,
  },
  list: {
    padding: 16,
  },
  studentCard: {
    flexDirection: 'row',
    backgroundColor: darkMode ? '#1F2937' : 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: darkMode ? 0.2 : 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: darkMode ? 4 : 3,
      },
    }),
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: darkMode ? '#F3F4F6' : '#1f2937',
  },
  score: {
    fontSize: 14,
    color: darkMode ? '#9CA3AF' : '#6b7280',
    marginTop: 4,
  },
});