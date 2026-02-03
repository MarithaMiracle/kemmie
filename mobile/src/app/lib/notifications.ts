import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { getToken, updatePushToken } from './api';

export async function ensurePushRegistration() {
  const current = await Notifications.getPermissionsAsync();
  let status = current.status;
  if (status !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  if (status !== 'granted') return null;
  const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID ?? (Constants.expoConfig as any)?.extra?.eas?.projectId;
  const expoToken = (await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined)).data;
  const token = await getToken();
  if (token && expoToken) {
    await updatePushToken(token, expoToken);
  }
  return expoToken;
}

export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false
    })
  });
}

export function addDefaultListeners(onReceive?: (n: Notifications.Notification) => void, onResponse?: (r: Notifications.NotificationResponse) => void) {
  const sub1 = Notifications.addNotificationReceivedListener(n => { if (onReceive) onReceive(n); });
  const sub2 = Notifications.addNotificationResponseReceivedListener(r => { if (onResponse) onResponse(r); });
  return [sub1, sub2];
}

export function removeListeners(subs: Array<{ remove: () => void }>) {
  subs.forEach(s => s.remove());
}