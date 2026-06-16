import { StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import type { ColorValue } from 'react-native';

import Colors from '@/constants/Colors';
import { TAB_PICTURES, type TabPictureKey } from '@/constants/tabPictures';
import { useColorScheme } from '@/components/useColorScheme';

interface TabBarPictureProps {
  tabKey: TabPictureKey;
  color: ColorValue;
  focused: boolean;
}

export function TabBarPicture({ tabKey, color, focused }: TabBarPictureProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const art = TAB_PICTURES[tabKey];

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.pictureBox,
          {
            backgroundColor: focused ? colors.primaryLight : colors.background,
            borderColor: focused ? colors.primary : colors.borderLight,
          },
        ]}
      >
        <Text style={[styles.emoji, !focused && styles.emojiInactive]}>{art.emoji}</Text>
        <View style={[styles.badge, { backgroundColor: focused ? colors.primary : colors.textMuted }]}>
          <SymbolView
            name={art.icon as React.ComponentProps<typeof SymbolView>['name']}
            tintColor="#FFFFFF"
            size={9}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  pictureBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    position: 'relative',
  },
  emoji: { fontSize: 22, lineHeight: 26 },
  emojiInactive: { opacity: 0.55 },
  badge: {
    position: 'absolute',
    right: -3,
    bottom: -3,
    width: 18,
    height: 18,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
