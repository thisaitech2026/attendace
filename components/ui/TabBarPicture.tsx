import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, Text, View } from 'react-native';
import type { ColorValue } from 'react-native';

import Colors from '@/constants/Colors';
import { TAB_PICTURES, type TabPictureKey } from '@/constants/tabPictures';
import { useColorScheme } from '@/components/useColorScheme';

const ICON_SIZE = 54;

interface TabBarPictureProps {
  tabKey: TabPictureKey;
  color: ColorValue;
  focused: boolean;
}

export function TabBarPicture({ tabKey, focused }: TabBarPictureProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const art = TAB_PICTURES[tabKey];
  const isDark = scheme === 'dark';

  if (focused) {
    return (
      <View style={[styles.wrap, styles.focusedWrap, { shadowColor: colors.primary }]}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconCircle}
        >
          <Text style={styles.emojiFocused}>{art.emoji}</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.04)',
          },
        ]}
      >
        <Text style={styles.emojiInactive}>{art.emoji}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  focusedWrap: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  emojiFocused: {
    fontSize: 28,
    lineHeight: 32,
  },
  emojiInactive: {
    fontSize: 26,
    lineHeight: 30,
    opacity: 0.55,
  },
});
