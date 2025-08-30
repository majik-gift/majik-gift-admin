export const GRID_SPACING = 4;
export const GRID_SUB_SPACING = 2;
export const DRAWER_WIDTH = 260;
export const HEADER_HEIGHT = '100px';
export const MOBILE_BREAK_POINT = '(min-width:900px)';
export const DRAWER_BREAK_POINT = '(min-width:1200px)';
export const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const daysOfWeek = [
  { label: 'Sunday', value: 'sunday' },
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
];

export const redirectNotificationLink = (role, notification) => {
  const rolesMap = {
    admin: 'admin',
    light_worker: 'light-worker',
    stall_holder: 'stall-holder',
  };

  const userRole = rolesMap[role] || '';
  if (!userRole) return '#';

  if (notification?.data?.notificationType) {
    return `/event-invites/${notification.event_id}`;
  }
  if (notification?.event_ticket_order_id) {
    return `/${userRole}/event-ticket-order-history/${notification.event_ticket_order_id}/details`;
  }
  if (notification?.service_order_id) {
    return `/${userRole}/service-order-history/${notification.service_order_id}/details`;
  }
  if (notification?.product_order_id) {
    return `/${userRole}/order-history/${notification.product_order_id}/details`;
  }
  if (notification?.data?.chat_id) {
    return `/${userRole}/chat?chatId=${notification.data.chat_id}`;
  }
  if (notification?.data?.product_id) {
    return `/${userRole}/products/${notification.data.product_id}/details`;
  }

  return '#';
};
