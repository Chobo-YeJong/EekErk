// API 기본 주소 - 백엔드 FastAPI 서버 주소
const API_BASE_URL = 'http://localhost:8000';

export const exchangeAPI = {
    // 신한은행 USD -> KRW 환율 계산
    getSinhanUsdToKrw: async (amount) => {
        const response = await fetch(`${API_BASE_URL}/sinhan/usd-krw?amount=${amount}`);
        if (!response.ok) {
            throw new Error('API 호출 실패');
        }
        return await response.json();
    },

    // 신한은행 JPY -> KRW 환율 계산
    getSinhanJpyToKrw: async (amount) => {
        const response = await fetch(`${API_BASE_URL}/sinhan/jpy-krw?amount=${amount}`);
        if (!response.ok) {
            throw new Error('API 호출 실패');
        }
        return await response.json();
    },

    // 하나은행 USD -> KRW 환율 계산
    getHanaUsdToKrw: async (amount) => {
        const response = await fetch(`${API_BASE_URL}/hana/usd-krw?amount=${amount}`);
        if (!response.ok) {
            throw new Error('API 호출 실패');
        }
        return await response.json();
    },

    // 하나은행 JPY -> KRW 환율 계산
    getHanaJpyToKrw: async (amount) => {
        const response = await fetch(`${API_BASE_URL}/hana/jpy-krw?amount=${amount}`);
        if (!response.ok) {
            throw new Error('API 호출 실패');
        }
        return await response.json();
    }
};