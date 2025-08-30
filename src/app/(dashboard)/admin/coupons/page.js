'use client'
import GetAllCoupons from '@/shared/screen-component/coupon/get-all-coupons';
import { useSelector } from 'react-redux';

const Page = () => {
  const {user} = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';
  return <GetAllCoupons createRoute={isAdmin?'/admin/coupons/create':'/light-worker/coupons/create'}/>;
};

export default Page;
