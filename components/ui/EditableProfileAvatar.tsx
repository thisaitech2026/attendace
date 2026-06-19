import { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { EmployeeAvatar } from '@/components/ui/EmployeeAvatar';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { showAlert } from '@/utils/uiAlert';

interface EditableProfileAvatarProps {
  firstName: string;
  lastName: string;
  avatar?: string;
  size?: number;
  onAvatarChange: (avatarUri: string) => Promise<void>;
}

export function EditableProfileAvatar({
  firstName,
  lastName,
  avatar,
  size = 72,
  onAvatarChange,
}: EditableProfileAvatarProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    if (uploading) return;

    try {
      if (Platform.OS !== 'web') {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          showAlert('Permission needed', 'Allow photo library access to add a profile picture.');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
        base64: true,
      });

      if (result.canceled || !result.assets[0]) return;

      const asset = result.assets[0];
      const avatarUri =
        asset.base64 != null
          ? `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`
          : asset.uri;

      setUploading(true);
      await onAvatarChange(avatarUri);
    } catch (error) {
      showAlert('Could not add photo', error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setUploading(false);
    }
  };

  const plusSize = Math.max(26, Math.round(size * 0.34));

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Pressable
        onPress={pickImage}
        disabled={uploading}
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
        accessibilityRole="button"
        accessibilityLabel={avatar ? 'Change profile photo' : 'Add profile photo'}
      >
        <EmployeeAvatar
          firstName={firstName}
          lastName={lastName}
          avatar={avatar}
          size={size}
          borderRadius={18}
          borderWidth={2}
          borderColor={colors.primary}
          backgroundColor={colors.background}
          empty
        />
      </Pressable>

      <Pressable
        onPress={pickImage}
        disabled={uploading}
        style={({ pressed }) => [
          styles.plusBtn,
          {
            width: plusSize,
            height: plusSize,
            borderRadius: plusSize / 2,
            backgroundColor: colors.primary,
            borderColor: colors.background,
            opacity: pressed ? 0.88 : 1,
            right: -4,
            bottom: -4,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Add profile photo"
      >
        {uploading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons name="add" size={Math.round(plusSize * 0.62)} color="#FFFFFF" />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  plusBtn: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
});
