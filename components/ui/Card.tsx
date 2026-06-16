import { StyleSheet, View, type ViewProps } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  elevated?: boolean;
  noPadding?: boolean;
}

export function Card({ children, style, elevated = true, noPadding = false, ...props }: CardProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.borderLight,
          shadowColor: colors.shadow,
        },
        elevated && styles.elevated,
        noPadding && styles.noPadding,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  elevated: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  noPadding: {
    padding: 0,
    overflow: 'hidden',
  },
});
