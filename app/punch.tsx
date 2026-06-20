import { useRouter } from 'expo-router';

import { PunchDetailPanel } from '@/components/punch/PunchDetailPanel';

export default function PunchScreen() {
  const router = useRouter();
  return <PunchDetailPanel onClose={() => router.back()} />;
}
