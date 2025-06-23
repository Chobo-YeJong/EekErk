// API 기본 주소
const API_BASE_URL = 'http://localhost:8000';

export const exchangeAPI = {
    // 범용 환전 API (새로운 방식)
    getExchangeRate: async (bankName, currency, amount = 1) => {
        const response = await fetch(
            `${API_BASE_URL}/exchange/${encodeURIComponent(bankName)}/${currency.toLowerCase()}-krw?amount=${amount}`
        );
        if (!response.ok) {
            throw new Error(`${bankName} ${currency} 환율 조회 실패`);
        }
        return await response.json();
    },

    // 모든 은행 환율 비교
    compareAllBanks: async (currency, amount = 1) => {
        const response = await fetch(
            `${API_BASE_URL}/compare/${currency.toLowerCase()}-krw?amount=${amount}`
        );
        if (!response.ok) {
            throw new Error(`${currency} 환율 비교 실패`);
        }
        return await response.json();
    },

    // 지원 은행 목록 조회
    getSupportedBanks: async () => {
        const response = await fetch(`${API_BASE_URL}/banks`);
        if (!response.ok) {
            throw new Error('지원 은행 목록 조회 실패');
        }
        return await response.json();
    },

    // 지원 통화 목록 조회
    getSupportedCurrencies: async () => {
        const response = await fetch(`${API_BASE_URL}/currencies`);
        if (!response.ok) {
            throw new Error('지원 통화 목록 조회 실패');
        }
        return await response.json();
    },

    // 기존 API들 (하위 호환성 - 새로운 방식으로 내부 구현)
    getSinhanUsdToKrw: async (amount) => {
        return await exchangeAPI.getExchangeRate("신한은행", "USD", amount);
    },

    getSinhanJpyToKrw: async (amount) => {
        return await exchangeAPI.getExchangeRate("신한은행", "JPY", amount);
    },

    getHanaUsdToKrw: async (amount) => {
        return await exchangeAPI.getExchangeRate("하나은행", "USD", amount);
    },

    getHanaJpyToKrw: async (amount) => {
        return await exchangeAPI.getExchangeRate("하나은행", "JPY", amount);
    }
};