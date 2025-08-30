'use client';
import useDataTable from '@/hooks/useDataTable';
import { UICard } from '@/shared/components';
import UITable from '@/shared/components/ui/table';
import {
  getServiceOrdersHistory,
  getWorkerOrderHistory,
} from '@/store/admin/service/service-orders-history.thunk';
import getOrderColumnHistory from './column-header';
import { useSelector } from 'react-redux';

import OrderHistory from '@/shared/screen/service-order-history/OrderHistory';
const AdminOrderHistory = () => {
  return <OrderHistory />;
};

export default AdminOrderHistory;
