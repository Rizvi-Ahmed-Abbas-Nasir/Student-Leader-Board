import { View, Text, StyleSheet, FlatList, RefreshControl, Platform, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trophy, Medal } from 'lucide-react-native';

type Student = {
  id: string;
  full_name: string;
  score: number;
  rank: number;
};

export default function LeaderboardScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('score', { ascending: false });

      if (error) throw error;

      const rankedStudents = data.map((student, index) => ({
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
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard();
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return '#6366f1'; // Default color
    }
  };

  const renderItem = ({ item }: { item: Student }) => (
    <Pressable
      style={({ pressed }) => [
        styles.studentCard,
        pressed && styles.pressed
      ]}>
      <View style={[styles.rankBadge, { backgroundColor: getRankColor(item.rank) }]}>
        {item.rank <= 3 ? (
          <Medal size={24} color="white" />
        ) : (
          <Text style={styles.rankText}>{item.rank}</Text>
        )}
      </View>
      <View style={styles.studentInfo}>
        <Text style={styles.name}>{item.full_name}</Text>
        <Text style={styles.score}>{item.score} points</Text>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading leaderboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Trophy size={32} color="#6366f1" />
        <Text style={styles.title}>Top Students</Text>
      </View>
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#6366f1"
            colors={['#6366f1']} // Android
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
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
    color: '#1f2937',
  },
  list: {
    padding: 16,
  },
  studentCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  pressed: {
    opacity: 0.7,
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
    color: '#1f2937',
  },
  score: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
});