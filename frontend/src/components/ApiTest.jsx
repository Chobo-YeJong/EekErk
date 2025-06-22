import React, { useState } from 'react';
import { exchangeAPI } from '../utils/exchangeAPI';

const ApiTest = () => {
    const [responseData, setResponseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 신한은행 USD 테스트
    const testSinhanUSD = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await exchangeAPI.getSinhanUsdToKrw(100); // 100달러로 테스트
            setResponseData(result);
            console.log('신한은행 USD 응답:', result); // 콘솔에서도 확인 가능
        } catch (err) {
            setError(err.message);
            console.error('에러:', err);
        }
        setLoading(false);
    };

    // 하나은행 USD 테스트
    const testHanaUSD = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await exchangeAPI.getHanaUsdToKrw(100); // 100달러로 테스트
            setResponseData(result);
            console.log('하나은행 USD 응답:', result);
        } catch (err) {
            setError(err.message);
            console.error('에러:', err);
        }
        setLoading(false);
    };

    // 신한은행 JPY 테스트
    const testSinhanJPY = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await exchangeAPI.getSinhanJpyToKrw(10000); // 10000엔으로 테스트
            setResponseData(result);
            console.log('신한은행 JPY 응답:', result);
        } catch (err) {
            setError(err.message);
            console.error('에러:', err);
        }
        setLoading(false);
    };

    // 하나은행 JPY 테스트
    const testHanaJPY = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await exchangeAPI.getHanaJpyToKrw(10000); // 10000엔으로 테스트
            setResponseData(result);
            console.log('하나은행 JPY 응답:', result);
        } catch (err) {
            setError(err.message);
            console.error('에러:', err);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
            <h2>API 테스트</h2>

            {/* 테스트 버튼들 */}
            <div style={{ marginBottom: '20px' }}>
                <button onClick={testSinhanUSD} disabled={loading} style={{ margin: '5px' }}>
                    신한은행 USD 테스트 (100달러)
                </button>
                <button onClick={testHanaUSD} disabled={loading} style={{ margin: '5px' }}>
                    하나은행 USD 테스트 (100달러)
                </button>
                <button onClick={testSinhanJPY} disabled={loading} style={{ margin: '5px' }}>
                    신한은행 JPY 테스트 (10000엔)
                </button>
                <button onClick={testHanaJPY} disabled={loading} style={{ margin: '5px' }}>
                    하나은행 JPY 테스트 (10000엔)
                </button>
            </div>

            {/* 로딩 상태 */}
            {loading && <p>로딩 중... (크롤링 진행 중)</p>}

            {/* 에러 표시 */}
            {error && (
                <div style={{ color: 'red', marginBottom: '20px' }}>
                    <h3>에러 발생:</h3>
                    <p>{error}</p>
                </div>
            )}

            {/* 응답 데이터 표시 */}
            {responseData && (
                <div>
                    <h3>API 응답 데이터:</h3>
                    <pre style={{
                        background: '#f5f5f5',
                        padding: '10px',
                        border: '1px solid #ddd',
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap'
                    }}>
            {JSON.stringify(responseData, null, 2)}
          </pre>
                </div>
            )}
        </div>
    );
};

export default ApiTest;