// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: 'AIzaSyAn6WjDJCOad2uCDgBj6cSgUvjDgv89j94',
  authDomain: 'majik-gift-d11c3.firebaseapp.com',
  projectId: 'majik-gift-d11c3',
  storageBucket: 'majik-gift-d11c3.firebasestorage.app',
  messagingSenderId: '145417668022',
  appId: '1:145417668022:web:55e450011079e9521e2d17',
  measurementId: 'G-TCDCFE6J1T',
};

firebase.initializeApp(firebaseConfig);

class CustomPushEvent extends Event {
  constructor(data) {
    super('push');

    Object.assign(this, data);
    this.custom = true;
  }
}

/*
 * Overrides push notification data, to avoid having 'notification' key and firebase blocking
 * the message handler from being called
 */
self.addEventListener('push', (e) => {
  // Skip if event is our own custom event
  if (e.custom) return;

  // Kep old event data to override
  const oldData = e.data;

  // Create a new event to dispatch, pull values from notification key and put it in data key,
  // and then remove notification key
  const newEvent = new CustomPushEvent({
    data: {
      ehheh: oldData.json(),
      json() {
        const newData = oldData.json();
        newData.data = {
          ...newData.data,
          ...newData.notification,
        };
        delete newData.notification;
        return newData;
      },
    },
    waitUntil: e.waitUntil.bind(e),
  });

  // Stop event propagation
  e.stopImmediatePropagation();

  // Dispatch the new wrapped event
  dispatchEvent(newEvent);
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const { title, body, icon, badge, image,notificationType, ...restPayload } = payload.data;
  console.log('🚀 ~ messaging.onBackgroundMessage ~ payload.data:', payload);

  const notificationOptions = {
    body,
    data: restPayload,
  };

  return self.registration.showNotification(title, notificationOptions);
});

const handleClickForChatNotification = (event) => {
  const chatId = event.notification.data.chatId;
  const basePath = new URL(`/chat`, event.currentTarget.origin).href;
  const pathToOpen = new URL(`/chat?chatId=${chatId}`, event.currentTarget.origin).href;

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((clientList) => {
        const matchingClient = clientList.find((client) => {
          const clientUrl = new URL(client.url);
          const urlWithoutQuery = clientUrl.origin + clientUrl.pathname;
          return urlWithoutQuery === basePath;
        });

        if (matchingClient) {
          // Send message to update the URL in the focused tab
          matchingClient.postMessage({ type: 'NEW_NOTIFICATION', chatId });
          // Do not use focus() directly, let the browser handle it
          return matchingClient.focus();
        } else {
          // Open the window if no matching client is found
          return clients.openWindow(pathToOpen);
        }
      })
  );

  event.notification.close(); // Close the notification after clicking
};

self.addEventListener('notificationclick', (event) => {
  if (event?.notification?.data?.notificationType === 'new-message') {
    event.waitUntil(handleClickForChatNotification(event));
  }

  if (event?.notification?.data?.notificationType !== 'new-message') {
    self.clients.openWindow(new URL(`/notifications`, event.currentTarget.origin).href);
  }

  event.notification.close();
});
