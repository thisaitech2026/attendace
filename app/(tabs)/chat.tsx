import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { format, parseISO } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { EmployeeAvatar } from '@/components/ui/EmployeeAvatar';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { CHAT_CATEGORY_LABELS } from '@/constants/tabPictures';
import type { ChatCategory } from '@/types/chat';
import { useColorScheme } from '@/components/useColorScheme';

const QUICK_MESSAGES: { label: string; text: string; category: ChatCategory }[] = [
  { label: 'Sick leave', text: 'I will be on sick leave today. Not feeling well.', category: 'sick-leave' },
  { label: 'Running late', text: 'Running a bit late today. Will be in shortly.', category: 'update' },
  { label: 'Leave update', text: 'Submitted a leave request — please review when you can.', category: 'leave' },
];

const CATEGORY_COLORS: Record<ChatCategory, string> = {
  general: '#64748B',
  update: '#4F46E5',
  'sick-leave': '#DC2626',
  leave: '#D97706',
};

export default function ChatScreen() {
  const { employee, chatMessages, sendMessage, allEmployees } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);

  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = useCallback(
    async (messageText?: string, messageCategory: ChatCategory = 'general') => {
      const body = (messageText ?? text).trim();
      if (!body || sending) return;
      setSending(true);
      try {
        await sendMessage(body, messageCategory);
        setText('');
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
      } finally {
        setSending(false);
      }
    },
    [text, sending, sendMessage]
  );

  const renderMessage = ({ item }: { item: (typeof chatMessages)[0] }) => {
    const isMe = item.employeeId === employee?.employeeId;
    const sender = allEmployees.find((member) => member.employeeId === item.employeeId);
    const nameParts = item.senderName.trim().split(/\s+/);
    const firstName = sender?.firstName ?? nameParts[0] ?? '';
    const lastName = sender?.lastName ?? nameParts.slice(1).join(' ');

    return (
      <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
        {!isMe ? (
          <EmployeeAvatar
            firstName={firstName}
            lastName={lastName}
            avatar={sender?.avatar}
            size={24}
            borderRadius={8}
            borderWidth={0}
            backgroundColor={colors.primaryLight}
            textColor={colors.primary}
            fontSize={9}
          />
        ) : null}
        <View style={[styles.bubble, isMe ? { backgroundColor: colors.primary } : { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
          <View style={styles.metaRow}>
            {!isMe ? (
              <Text style={[styles.sender, { color: colors.primary }]} numberOfLines={1}>
                {item.senderName}
              </Text>
            ) : null}
            <View style={[styles.categoryTag, { backgroundColor: `${CATEGORY_COLORS[item.category]}22` }]}>
              <Text style={[styles.categoryText, { color: CATEGORY_COLORS[item.category] }]}>
                {CHAT_CATEGORY_LABELS[item.category]}
              </Text>
            </View>
          </View>
          <Text style={[styles.messageText, { color: isMe ? '#FFF' : colors.text }]}>{item.text}</Text>
          <Text style={[styles.time, { color: isMe ? 'rgba(255,255,255,0.7)' : colors.textMuted }]}>
            {format(parseISO(item.createdAt), 'h:mm a')}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <View style={[styles.headerWrap, { paddingTop: insets.top + 4 }]}>
        <ScreenHeader title="Team Chat" inset={false} compact />
      </View>

      <FlatList
        ref={listRef}
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.composer, { backgroundColor: colors.card, borderTopColor: colors.borderLight, paddingBottom: insets.bottom + 4 }]}>
        <View style={styles.quickRow}>
          {QUICK_MESSAGES.map((quick) => (
            <Pressable
              key={quick.label}
              style={[styles.quickChip, { backgroundColor: colors.background, borderColor: colors.borderLight }]}
              onPress={() => handleSend(quick.text, quick.category)}
              disabled={sending}
            >
              <Text style={[styles.quickText, { color: colors.primary }]}>{quick.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.borderLight }]}
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor={colors.textMuted}
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => handleSend()}
            blurOnSubmit={false}
          />
          <Pressable
            style={[
              styles.sendBtn,
              {
                backgroundColor: text.trim() ? colors.success : colors.borderLight,
                borderColor: text.trim() ? colors.success : colors.borderLight,
              },
            ]}
            onPress={() => handleSend()}
            disabled={!text.trim() || sending}
          >
            <Text style={[styles.sendText, { color: text.trim() ? '#FFFFFF' : colors.textMuted }]}>Send</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrap: { paddingHorizontal: 16, paddingBottom: 0 },
  messageList: { paddingHorizontal: 12, paddingBottom: 4, paddingTop: 2 },
  messageSeparator: { height: 3 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  messageRowMe: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '82%',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4, marginBottom: 2 },
  sender: { fontSize: 10, fontWeight: '700', flexShrink: 1 },
  categoryTag: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  categoryText: { fontSize: 8, fontWeight: '700' },
  messageText: { fontSize: 13, lineHeight: 17, fontWeight: '500' },
  time: { fontSize: 8, marginTop: 1, alignSelf: 'flex-end', fontWeight: '500' },
  composer: { borderTopWidth: 1, paddingTop: 4, paddingHorizontal: 8 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginBottom: 4 },
  quickChip: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8, borderWidth: 1 },
  quickText: { fontSize: 9, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 0,
    height: 32,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '500',
    ...(Platform.OS === 'android' ? { includeFontPadding: false, textAlignVertical: 'center' as const } : {}),
  },
  sendBtn: {
    height: 32,
    minWidth: 48,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: { fontSize: 12, fontWeight: '700' },
});
