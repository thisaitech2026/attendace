import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmployeeAvatarProps {
  firstName: string;
  lastName: string;
  avatar?: string;
  employeeId?: string;
  size?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  empty?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function getEmployeeAvatarUri(employee: {
  avatar?: string;
}): string | undefined {
  return employee.avatar || undefined;
}

export function EmployeeAvatar({
  firstName,
  lastName,
  avatar,
  size = 46,
  borderRadius = 16,
  borderWidth = 2,
  borderColor,
  backgroundColor,
  textColor,
  fontSize = 17,
  empty = false,
  style,
}: EmployeeAvatarProps) {
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  const photoUri = avatar || undefined;
  const iconSize = Math.max(18, Math.round(size * 0.38));

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius,
          borderWidth,
          borderColor,
          backgroundColor,
        },
        style,
      ]}
    >
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={[styles.image, { borderRadius: Math.max(0, borderRadius - borderWidth) }]} />
      ) : empty ? (
        <Ionicons name="person-outline" size={iconSize} color={textColor ?? '#94A3B8'} />
      ) : (
        <Text style={[styles.initials, { color: textColor, fontSize }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: { fontWeight: '800' },
});
