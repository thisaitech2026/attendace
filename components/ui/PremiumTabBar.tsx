import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import Colors from '@/constants/Colors';
import { TAB_PICTURES, type TabPictureKey } from '@/constants/tabPictures';
import { useColorScheme } from '@/components/useColorScheme';

const ROUTE_TO_TAB: Record<string, TabPictureKey> = {
  index: 'home',
  attendance: 'time',
  leave: 'leave',
  chat: 'chat',
  salary: 'pay',
};

const ACTIVE_SIZE = 58;
const INACTIVE_SIZE = 50;
type PremiumTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];
type SymbolName = ComponentProps<typeof SymbolView>['name'];

export function PremiumTabBar({ state, descriptors, navigation }: PremiumTabBarProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();
  const isDark = scheme === 'dark';
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 20 : 12);

  return (
    <View
      style={[
        styles.outer,
        {
          paddingBottom: bottomInset + 10,
          backgroundColor: colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.pill,
          {
            backgroundColor: colors.tabBar,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)',
            shadowColor: colors.shadow,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const tabKey = ROUTE_TO_TAB[route.name] ?? 'home';
          const art = TAB_PICTURES[tabKey];
          const label = descriptors[route.key].options.title ?? art.label;
          const iconName = art.icon as SymbolName;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={label}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [styles.tab, { opacity: pressed ? 0.88 : 1 }]}
            >
              {focused ? (
                <View style={[styles.activeShadow, { shadowColor: colors.primary }]}>
                  <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.iconCircle, { width: ACTIVE_SIZE, height: ACTIVE_SIZE, borderRadius: ACTIVE_SIZE / 2 }]}
                  >
                    <SymbolView name={iconName} tintColor="#FFFFFF" size={26} />
                  </LinearGradient>
                </View>
              ) : (
                <View
                  style={[
                    styles.iconCircle,
                    styles.inactiveCircle,
                    {
                      width: INACTIVE_SIZE,
                      height: INACTIVE_SIZE,
                      borderRadius: INACTIVE_SIZE / 2,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.05)',
                      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.07)',
                    },
                  ]}
                >
                  <SymbolView name={iconName} tintColor={colors.tabIconDefault} size={24} />
                </View>
              )}
              <Text
                style={[
                  styles.label,
                  focused
                    ? { color: colors.primary, fontWeight: '800' }
                    : { color: colors.tabIconDefault, fontWeight: '600' },
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 14,
    paddingTop: 6,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 32,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 86,
    gap: 6,
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveCircle: {
    borderWidth: 1,
  },
  activeShadow: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.15,
    textAlign: 'center',
  },
});
