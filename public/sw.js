self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch {}
  const title = data.title || 'MetaMart update';
  event.waitUntil(self.registration.showNotification(title, {
    body: data.body || 'There is an update from MetaMart.',
    icon: '/logo.png',
    badge: '/favicon.svg',
    data: { url: data.url || '/orders' },
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = event.notification.data?.url || '/orders';
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windows => {
    const existing = windows.find(client => client.url.includes(self.location.origin));
    if (existing) { existing.navigate(target); return existing.focus(); }
    return clients.openWindow(target);
  }));
});
