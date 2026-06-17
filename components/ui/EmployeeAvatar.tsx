import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

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
  style?: StyleProp<ViewStyle>;
}

export function getEmployeeAvatarUri(employee: {
  avatar?: string;
  employeeId?: string;
  email?: string;
}): string | undefined {
  if (employee.avatar) return employee.avatar;
  const seed = employee.employeeId ?? employee.email;
  if (!seed) return undefined;
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(seed)}`;
}

export function EmployeeAvatar({
  firstName,
  lastName,
  avatar,
  employeeId,
  size = 46,
  borderRadius = 16,
  borderWidth = 2,
  borderColor,
  backgroundColor,
  textColor,
  fontSize = 17,
  style,
}: EmployeeAvatarProps) {
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  const photoUri = avatar ?? (employeeId ? `https://i.pravatar.cc/150?u=${encodeURIComponent(employeeId)}` : undefined);

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
