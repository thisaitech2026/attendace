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
  const { employee, chatMessages, sendMessage } = useApp();
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
    const initials = item.senderName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2);

    return (
      <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
        {!isMe ? (
          <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>{initials}</Text>
          </View>
        ) : null}
        <View style={[styles.bubble, isMe ? { backgroundColor: colors.primary } : { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
          {!isMe ? (
            <Text style={[styles.sender, { color: colors.primary }]}>{item.senderName}</Text>
          ) : null}
          <View style={[styles.categoryTag, { backgroundColor: `${CATEGORY_COLORS[item.category]}22` }]}>
            <Text style={[styles.categoryText, { color: CATEGORY_COLORS[item.category] }]}>
              {CHAT_CATEGORY_LABELS[item.category]}
            </Text>
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
      <View style={[styles.headerWrap, { paddingTop: insets.top + 8 }]}>
        <ScreenHeader title="Team Chat" subtitle="Share updates, sick leave & messages" inset={false} />
        <Text style={[styles.memberCount, { color: colors.textSecondary }]}>Everyone on your team can see messages here</Text>
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
            placeholder="Type a message to your team..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={500}
            textAlignVertical="center"
          />
          <Pressable
            style={[styles.sendBtn, { backgroundColor: text.trim() ? colors.primary : colors.borderLight }]}
            onPress={() => handleSend()}
            disabled={!text.trim() || sending}
          >
            <Text style={styles.sendText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrap: { paddingHorizontal: 20, paddingBottom: 8 },
  memberCount: { fontSize: 12, fontWeight: '500', marginTop: -12, marginBottom: 4 },
  messageList: { paddingHorizontal: 16, paddingBottom: 12, paddingTop: 8 },
  messageRow: { flexDirection: 'row', marginBottom: 14, alignItems: 'flex-end', gap: 8 },
  messageRowMe: { justifyContent: 'flex-end' },
  avatar: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 12, fontWeight: '800' },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
  },
  sender: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  categoryTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 6 },
  categoryText: { fontSize: 10, fontWeight: '700' },
  messageText: { fontSize: 15, lineHeight: 21, fontWeight: '500' },
  time: { fontSize: 10, marginTop: 6, alignSelf: 'flex-end', fontWeight: '500' },
  composer: { borderTopWidth: 1, paddingTop: 6, paddingHorizontal: 12 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 },
  quickChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14, borderWidth: 1 },
  quickText: { fontSize: 11, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    fontSize: 14,
    lineHeight: 18,
    minHeight: 38,
    maxHeight: 72,
    fontWeight: '500',
  },
  sendBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, minHeight: 38, justifyContent: 'center' },
  sendText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
});
