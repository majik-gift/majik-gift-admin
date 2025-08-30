import {
  CalendarMonth,
  CalendarToday,
  Category,
  Chat,
  Dashboard,
  Discount,
  Group,
  Groups2,
  History,
  InterpreterMode,
  Inventory,
  MarkUnreadChatAlt,
  Public,
  RadioButtonUnchecked,
  Settings,
  Storefront,
  ViewCarousel,
} from '@mui/icons-material';
import { CalendarIcon } from '@mui/x-date-pickers';

let sideBarRoutes = {
  admin: [
    {
      navlabel: true,
      subheader: 'Dashboard',
    },
    {
      id: 0,
      title: 'Dashboard',
      icon: Dashboard,
      href: '/admin/dashboard',
    },
    {
      id: 1,
      title: 'Customers',
      icon: Group,
      href: '/admin/customers',
    },
    {
      id: 2,
      title: 'Light Workers',
      icon: Groups2,
      href: '/admin/light-workers',
    },
    {
      id: 3,
      title: 'Stall holders',
      icon: Storefront,
      href: '/admin/stall-holders',
    },
    {
      id: 4,
      title: 'Products',
      icon: Inventory,
      href: '/admin/products',
    },
    {
      id: 5,
      title: 'Services',
      icon: CalendarToday,
      href: '/admin/services',
    },
    {
      id: 6,
      title: 'Categories',
      icon: Category,
      href: '/admin/categories',
    },
    {
      id: 7,
      title: 'Group Activities',
      icon: InterpreterMode,
      href: '/admin/events',
    },
    {
      id: 8,
      title: 'Banners',
      icon: ViewCarousel,
      href: '/admin/banners',
    },
    {
      id: 10,
      title: 'Coupons',
      icon: Discount,
      href: '/admin/coupons',
    },
    {
      id: 99,
      title: 'History',
      icon: History,
      children: [
        {
          id: 9,
          title: 'Product Orders',
          icon: RadioButtonUnchecked,
          href: '/admin/order-history',
        },
        {
          id: 23,
          title: 'Service Orders',
          icon: RadioButtonUnchecked,
          href: '/admin/service-order-history',
        },
        {
          id: 24,
          title: 'Group Activities Orders',
          icon: RadioButtonUnchecked,
          href: '/admin/event-ticket-order-history',
        },
      ],
    },
    {
      id: 10,
      title: 'Settings',
      icon: Settings,
      href: '/admin/settings',
    },
    {
      id: 98,
      title: 'Chats',
      icon: Chat,
      children: [
        {
          id: 11,
          title: 'Chat Threads',
          icon: RadioButtonUnchecked,
          href: '/admin/chat',
        },
        {
          id: 64,
          title: 'Archived Chats',
          icon: RadioButtonUnchecked,
          href: '/admin/archived-chats',
        },
      ],
    },
    {
      id: 11,
      title: 'Countries',
      icon: Public,
      href: '/admin/countries',
    },
  ],
  stall_holder: [
    {
      navlabel: true,
      subheader: 'Dashboard',
    },
    {
      id: 0,
      title: 'Dashboard',
      icon: Dashboard,
      href: '/stall-holder/dashboard',
    },
    {
      id: 1,
      title: 'Products',
      icon: Inventory,
      href: '/stall-holder/products',
    },
    {
      id: 9,
      title: 'Product Orders',
      icon: History,
      href: '/stall-holder/order-history',
    },
    {
      id: 10,
      title: 'Coupons',
      icon: Discount,
      href: '/stall-holder/coupons',
    },
    {
      id: 99,
      title: 'Chats',
      icon: Chat,
      children: [
        {
          id: 2,
          title: 'Chat Threads',
          icon: RadioButtonUnchecked,
          href: '/stall-holder/chat',
        },
        {
          id: 64,
          title: 'Archived Chats',
          icon: RadioButtonUnchecked,
          href: '/stall-holder/archived-chats',
        },
      ],
    },
  ],
  light_worker: [
    {
      navlabel: true,
      subheader: 'Dashboard',
    },
    {
      id: 0,
      title: 'Dashboard',
      icon: Dashboard,
      href: '/light-worker/dashboard',
    },
    {
      id: 1,
      title: 'Services',
      icon: CalendarIcon,
      href: '/light-worker/services',
    },
    {
      id: 2,
      title: 'Group Activities',
      icon: InterpreterMode,
      href: '/light-worker/events',
    },
    {
      id: 99,
      title: 'Chats',
      icon: Chat,
      children: [
        {
          id: 3,
          title: 'Chat Threads',
          icon: RadioButtonUnchecked,
          href: '/light-worker/chat',
        },
        {
          id: 64,
          title: 'Archived Chats',
          icon: RadioButtonUnchecked,
          href: '/light-worker/archived-chats',
        },
      ],
    },
    {
      id: 10,
      title: 'Coupons',
      icon: Discount,
      href: '/light-worker/coupons',
    },
    {
      id: 9,
      title: 'History',
      icon: History,
      children: [
        {
          id: 4,
          title: 'Service Orders',
          icon: RadioButtonUnchecked,
          href: '/light-worker/service-order-history',
        },
        {
          id: 5,
          title: 'Group Activities Orders',
          icon: RadioButtonUnchecked,
          href: '/light-worker/event-ticket-order-history',
        },
      ],
    },
    // {
    //   id: 10,
    //   title: 'Settings',
    //   icon: Settings,
    //   href: '/light-worker/settings',
    // },
  ],
};
export { sideBarRoutes };
