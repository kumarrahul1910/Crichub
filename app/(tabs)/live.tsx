import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface UserLiveMatch {
  id: string;
  name: string;
  teamA: string;
  teamB: string;
  toss: string;
  runs: number;
  wickets: number;
  balls: number;
  ended?: boolean;
}

export default function LiveScreen() {
  const [liveScores, setLiveScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User's own live match state
  const [userMatch, setUserMatch] = useState<UserLiveMatch | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', teamA: '', teamB: '', toss: '' });

  const fetchLiveScores = async () => {
    try {
      setError(null);
      // TODO: Replace with your real API key from CricketData.org
      const API_KEY = 'YOUR_API_KEY_HERE';
      const response = await fetch(`https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`);
      const data = await response.json();
      
      if (data.status === 'success' && Array.isArray(data.data)) {
        setLiveScores(data.data);
      } else {
        setError('No live matches found at the moment.');
      }
    } catch (err) {
      setError('Failed to fetch live scores. Please check your internet connection.');
    }
  };

  useEffect(() => {
    fetchLiveScores();
    setLoading(false);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLiveScores();
    setRefreshing(false);
  };

  // Handlers for user live scoring
  const handleCreateUserMatch = () => {
    if (!form.name || !form.teamA || !form.teamB || !form.toss) return;
    setUserMatch({
      id: Date.now().toString(),
      name: form.name,
      teamA: form.teamA,
      teamB: form.teamB,
      toss: form.toss,
      runs: 0,
      wickets: 0,
      balls: 0,
      ended: false,
    });
    setShowModal(false);
    setForm({ name: '', teamA: '', teamB: '', toss: '' });
  };

  // Ball-by-ball tracking
  const addBall = (runs: number, isWicket?: boolean) => {
    if (!userMatch || userMatch.ended) return;
    setUserMatch(prev => prev && {
      ...prev,
      runs: Math.max(0, prev.runs + runs),
      wickets: Math.max(0, prev.wickets + (isWicket ? 1 : 0)),
      balls: prev.balls + 1,
    });
  };

  const addExtra = (runs: number) => {
    if (!userMatch || userMatch.ended) return;
    setUserMatch(prev => prev && {
      ...prev,
      runs: Math.max(0, prev.runs + runs),
    });
  };

  const endUserMatch = () => {
    if (!userMatch) return;
    setUserMatch(prev => prev && { ...prev, ended: true });
  };

  const startNewUserMatch = () => {
    setUserMatch(null);
  };

  // Helper to format overs from balls
  const formatOvers = (balls: number) => `${Math.floor(balls / 6)}.${balls % 6}`;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A1CEDC" />
        <ThemedText style={styles.loadingText}>Loading live scores...</ThemedText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* User's own live match scoring UI */}
        {userMatch && (
          <View style={styles.userMatchCard}>
            <ThemedText type="subtitle" style={{ fontWeight: 'bold', marginBottom: 4 }}>Your Live Match</ThemedText>
            <ThemedText style={{ fontWeight: 'bold', fontSize: 16 }}>{userMatch.name}</ThemedText>
            <ThemedText>{userMatch.teamA} vs {userMatch.teamB}</ThemedText>
            <ThemedText style={{ fontSize: 13, color: '#888' }}>Toss: {userMatch.toss}</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>Score: {userMatch.runs}/{userMatch.wickets} ({formatOvers(userMatch.balls)} ov)</ThemedText>
            </View>
            {!userMatch.ended ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 8 }}>
                <Button title="+1 Run" onPress={() => addBall(1)} />
                <Button title="+2 Runs" onPress={() => addBall(2)} />
                <Button title="+3 Runs" onPress={() => addBall(3)} />
                <Button title="+4 Runs" onPress={() => addBall(4)} />
                <Button title="+6 Runs" onPress={() => addBall(6)} />
                <Button title="Wicket" color="#FF3B30" onPress={() => addBall(0, true)} />
                <Button title="Wide" color="#888" onPress={() => addExtra(1)} />
                <Button title="No Ball" color="#888" onPress={() => addExtra(1)} />
                <Button title="End Match" color="#007AFF" onPress={endUserMatch} />
              </View>
            ) : (
              <View style={{ marginTop: 16, alignItems: 'center' }}>
                <ThemedText style={{ fontSize: 16, fontWeight: 'bold', color: '#007AFF' }}>Match Ended</ThemedText>
                <ThemedText style={{ fontSize: 15, marginTop: 8 }}>Final Score: {userMatch.runs}/{userMatch.wickets} in {formatOvers(userMatch.balls)} overs</ThemedText>
                <Button title="Start New Match" onPress={startNewUserMatch} color="#34C759" />
              </View>
            )}
          </View>
        )}

        {/* API Live Matches */}
        <View style={styles.header}>
          <Ionicons name="radio" size={32} color="#A1CEDC" />
          <ThemedText type="title" style={styles.title}>Live Scores</ThemedText>
          <ThemedText style={styles.subtitle}>Real-time cricket updates</ThemedText>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <TouchableOpacity style={styles.retryButton} onPress={fetchLiveScores}>
              <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
            </TouchableOpacity>
          </View>
        ) : liveScores.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={48} color="#888" />
            <ThemedText style={styles.emptyText}>No live matches at the moment</ThemedText>
            <ThemedText style={styles.emptySubtext}>Check back later for live cricket action!</ThemedText>
          </View>
        ) : (
          <View style={styles.matchesContainer}>
            {liveScores.map((match, index) => (
              <View key={match.id || index} style={styles.matchCard}>
                <View style={styles.matchHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.matchName}>
                    {match.name}
                  </ThemedText>
                  <View style={styles.statusBadge}>
                    <ThemedText style={styles.statusText}>{match.status}</ThemedText>
                  </View>
                </View>

                {match.venue && (
                  <View style={styles.venueContainer}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <ThemedText style={styles.venueText}>{match.venue}</ThemedText>
                  </View>
                )}

                {match.score && Array.isArray(match.score) && match.score.length > 0 && (
                  <View style={styles.scoreContainer}>
                    {match.score.map((inning: any, idx: number) => (
                      <View key={idx} style={styles.inningScore}>
                        <ThemedText style={styles.inningName}>{inning.inning}</ThemedText>
                        <ThemedText style={styles.scoreText}>
                          {inning.runs}/{inning.wickets} ({inning.overs} overs)
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Data provided by CricketData.org
          </ThemedText>
          <ThemedText style={styles.footerSubtext}>
            Pull down to refresh • Last updated: {new Date().toLocaleTimeString()}
          </ThemedText>
        </View>
      </ScrollView>
      {/* Start My Own Live Scoring Button at the bottom */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={() => setShowModal(true)}>
          <Ionicons name="add-circle" size={22} color="#007AFF" />
          <ThemedText style={styles.startButtonText}>Start My Own Live Scoring</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#e6f0ff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 16,
    marginBottom: 10,
  },
  startButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    elevation: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  userMatchCard: {
    backgroundColor: '#fffbe6',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#A1CEDC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  matchesContainer: {
    padding: 16,
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  matchName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
  },
  statusBadge: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  venueText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  scoreContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  inningScore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  inningName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  scoreText: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 10,
    color: '#999',
  },
  bottomButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
    zIndex: 10,
  },
}); 