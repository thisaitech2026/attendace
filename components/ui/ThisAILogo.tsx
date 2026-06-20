import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ThisAILogoProps {
  variant?: 'brand' | 'light';
  showTagline?: boolean;
  compact?: boolean;
}

const BRAND_SKY = '#00B8E6';
const BRAND_NAVY = '#0F2B5B';

export function ThisAILogo({ variant = 'brand', showTagline = true, compact = false }: ThisAILogoProps) {
  const thisColor = variant === 'light' ? '#FFFFFF' : BRAND_SKY;
  const aiColor = variant === 'light' ? '#FFFFFF' : BRAND_NAVY;
  const infoColor = variant === 'light' ? 'rgba(255,255,255,0.9)' : BRAND_SKY;
  const techColor = variant === 'light' ? 'rgba(255,255,255,0.75)' : BRAND_NAVY;

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <View style={styles.wordmarkRow}>
        <Text style={[styles.thisText, compact && styles.thisTextCompact, { color: thisColor }]}>th</Text>
        <View style={styles.iWrap}>
          <Ionicons
            name="sparkles"
            size={compact ? 10 : 12}
            color={thisColor}
            style={styles.star}
          />
          <Text style={[styles.thisText, compact && styles.thisTextCompact, { color: thisColor }]}>i</Text>
        </View>
        <Text style={[styles.thisText, compact && styles.thisTextCompact, { color: thisColor }]}>s</Text>
        <Text style={[styles.aiText, compact && styles.aiTextCompact, { color: aiColor }]}>AI</Text>
      </View>
      {showTagline ? (
        <Text style={[styles.tagline, compact && styles.taglineCompact]}>
          <Text style={{ color: infoColor }}>INFORMATION </Text>
          <Text style={{ color: techColor }}>TECHNOLOGIES</Text>
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  wrapCompact: { alignItems: 'center' },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  iWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 1,
  },
  star: {
    marginBottom: -2,
  },
  thisText: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  thisTextCompact: {
    fontSize: 28,
    lineHeight: 30,
  },
  aiText: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -0.8,
    lineHeight: 40,
    marginLeft: 1,
  },
  aiTextCompact: {
    fontSize: 32,
    lineHeight: 32,
  },
  tagline: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    textAlign: 'center',
  },
  taglineCompact: {
    fontSize: 8,
    letterSpacing: 0.8,
    marginTop: 2,
  },
});
