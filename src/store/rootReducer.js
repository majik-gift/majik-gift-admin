import { combineReducers } from '@reduxjs/toolkit';

import bannerReducer from './admin/banners/banners.slice';
import categoryReducer from './admin/categories/categories.slice';
import orderReducer from './admin/orders-history/orders-history.slice';
import reviewsReducer from './admin/reviews/reviews.slice';
import usersReducer from './admin/users/users.slice';
import authReducer from './auth/auth.slice';
import eventReducer from './light-worker/events/events.slice';
import productReducer from './products/products.slice';
import serviceReducer from './services/services.slice';
import lightWorkerReducer from './light-worker/add-update/lightWorker.slice';
import stallHolderReducer from './stall-holder/add-update/stallHolder.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  product: productReducer,
  services: serviceReducer,
  categories: categoryReducer,
  lightWorkers:lightWorkerReducer,
  stallHolders:stallHolderReducer,
  event: eventReducer,
  banner: bannerReducer,
  order: orderReducer,
  reviews: reviewsReducer,
});

export default rootReducer;
