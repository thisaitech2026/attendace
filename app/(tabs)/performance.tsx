import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { format, parseISO } from 'date-fns';

import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { PAID_SYMBOL, PENDING_WRONG_SYMBOL } from '@/constants/statusSymbols';
import { useColorScheme } from '@/components/useColorScheme';

function RatingStars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <Text style={styles.stars}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(5 - full - (half ? 1 : 0))}
      <Text style={styles.ratingNum}> {rating.toFixed(1)}</Text>
    </Text>
  );
}

export default function PerformanceScreen() {
  const { performanceReviews } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const latest = performanceReviews[0];
  const avgRating =
    performanceReviews.length > 0
      ? performanceReviews.reduce((sum, r) => sum + r.rating, 0) / performanceReviews.length
      : 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <ScreenHeader title="Performance" subtitle="Reviews, goals & ratings" />

      <Card style={styles.summaryCard}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Average Rating</Text>
        <RatingStars rating={avgRating} />
        <Text style={[styles.summarySub, { color: colors.textSecondary }]}>
          Based on {performanceReviews.length} review{performanceReviews.length !== 1 ? 's' : ''}
        </Text>
      </Card>

      {performanceReviews.map((review) => (
        <Card key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Text style={[styles.period, { color: colors.text }]}>{review.period}</Text>
            <RatingStars rating={review.rating} />
          </View>
          <Text style={[styles.reviewer, { color: colors.textSecondary }]}>
            Reviewed by {review.reviewer} · {format(parseISO(review.reviewDate), 'MMM d, yyyy')}
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>Goals</Text>
          {review.goals.map((goal, i) => (
            <View key={i} style={styles.goalRow}>
              <Text style={[styles.goalIcon, !goal.completed && { color: colors.warning }]}>
                {goal.completed ? PAID_SYMBOL : PENDING_WRONG_SYMBOL}
              </Text>
              <Text
                style={[
                  styles.goalText,
                  { color: goal.completed ? colors.textSecondary : colors.text },
                  goal.completed && styles.goalDone,
                ]}
              >
                {goal.title}
              </Text>
            </View>
          ))}

          <Text style={[styles.subheading, { color: colors.text }]}>Strengths</Text>
          <View style={styles.tagRow}>
            {review.strengths.map((s) => (
              <View key={s} style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.tagText, { color: colors.primary }]}>{s}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.subheading, { color: colors.text }]}>Areas to Improve</Text>
          <View style={styles.tagRow}>
            {review.improvements.map((s) => (
              <View key={s} style={[styles.tag, { backgroundColor: colors.border }]}>
                <Text style={[styles.tagText, { color: colors.text }]}>{s}</Text>
              </View>
            ))}
          </View>
        </Card>
      ))}

      {!latest && (
        <Card>
          <Text style={[styles.empty, { color: colors.textSecondary }]}>No performance reviews yet.</Text>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  summaryCard: { marginBottom: 20, alignItems: 'center' },
  summaryLabel: { fontSize: 13, fontWeight: '500' },
  stars: { fontSize: 28, color: '#F59E0B', marginVertical: 8 },
  ratingNum: { fontSize: 18, fontWeight: '700' },
  summarySub: { fontSize: 12 },
  reviewCard: { marginBottom: 16 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  period: { fontSize: 18, fontWeight: '700' },
  reviewer: { fontSize: 12, marginTop: 6, marginBottom: 16 },
  subheading: { fontSize: 14, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  goalIcon: { fontSize: 14 },
  goalText: { fontSize: 14, flex: 1 },
  goalDone: { textDecorationLine: 'line-through' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  tagText: { fontSize: 12, fontWeight: '500' },
  empty: { textAlign: 'center', padding: 20 },
});
