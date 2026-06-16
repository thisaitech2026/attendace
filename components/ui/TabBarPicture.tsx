import { StyleSheet, Text, View } from 'react-native';
import type { ColorValue } from 'react-native';

import Colors from '@/constants/Colors';
import { TAB_PICTURES, type TabPictureKey } from '@/constants/tabPictures';
import { useColorScheme } from '@/components/useColorScheme';

interface TabBarPictureProps {
  tabKey: TabPictureKey;
  color: ColorValue;
  focused: boolean;
}

export function TabBarPicture({ tabKey, focused }: TabBarPictureProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const art = TAB_PICTURES[tabKey];

  return (
    <View style={styles.wrap}>
      <View style={[styles.iconArea, focused && { backgroundColor: colors.primaryLight }]}>
        <Text style={[styles.emoji, !focused && styles.emojiInactive]}>{art.emoji}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  iconArea: {
    width: 40,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 24, lineHeight: 28 },
  emojiInactive: { opacity: 0.5 },
});
