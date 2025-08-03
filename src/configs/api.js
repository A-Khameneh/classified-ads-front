import axios from "axios";
import { getNewTokens } from "services/token";
import { getCookie, setCookie } from "utils/cookie";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});

api.interceptors.request.use( (req) => {
    const accessToken = getCookie("accessToken");
    if ( accessToken ) {
        req.headers["Authorization"] = `bearer ${accessToken}`
    }
    return req;
    }, err => {
        return Promise.reject(err);
    }
);

api.interceptors.response.use( 
    res => {
        // این بخش برای پاسخ‌های موفق است و درست کار می‌کند
        return res;
    }, 
    async err => {
        const originalReq = err.config;

        if ( err?.response?.status === 401 && !originalReq._retry ) {
            originalReq._retry = true;
            try {
                const res = await getNewTokens();
                if (res?.data) {
                    setCookie(res.data);
                    return api(originalReq);
                }
            } catch (error) {
                // اگر گرفتن توکن جدید هم خطا داد، کاربر را به صفحه لاگین هدایت کنید
                // window.location.href = '/login'; 
                return Promise.reject(error);
            }
        }

        // ✅ راه‌حل اصلی: این خط را اضافه کنید
        // برای تمام خطاهای دیگر (غیر از 401)، باید promise را reject کنیم
        // تا خطا به useMutation برسد.
        return Promise.reject(err);
    }
);

export default api;