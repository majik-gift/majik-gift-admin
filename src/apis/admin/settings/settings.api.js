import { apiGet, apiPatch } from '@/shared/services/apiService';

const settingsAPI = {
    getSettings: (params, data) => apiGet(`setting`, data),
    updateReadingSetting: (params, data) => apiPatch(`setting/${params?.id}/readings-fees`, data),
    updateTicketSalesFees: (params, data) => apiPatch(`setting/${params?.id}/ticket-sales-fees`, data),
    updateTipsPercentage: (params, data) => apiPatch(`setting/${params?.id}/tips-percentage`, data),
    updateSubscriptionsFees: (params, data) => apiPatch(`setting/${params?.id}/subscriptions-fees`, data),
    updateShopItemsFees: (params, data) => apiPatch(`setting/${params?.id}/shop-items-fees`, data),
};

export default settingsAPI;
