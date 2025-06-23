import React, { useState, useEffect } from 'react';
import { exchangeAPI } from '../utils/exchangeAPI';

function ExchangeRateTable({ selectedCountry }) {
  const [exchangeData, setExchangeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [supportedBanks, setSupportedBanks] = useState([]);

  // 지원 은행 목록 로드
  useEffect(() => {
    const loadSupportedBanks = async () => {
      try {
        const banksData = await exchangeAPI.getSupportedBanks();
        setSupportedBanks(Object.keys(banksData.bank_details));
      } catch (err) {
        console.error('지원 은행 목록 로드 실패:', err);
        // 기본값으로 설정
        setSupportedBanks(['신한은행', '하나은행']);
      }
    };

    loadSupportedBanks();
  }, []);

  const formatTimeInfo = (data) => {
    try {
      const timeInfo = data['고시시각'] || '';
      const round = data['고시회차'] || '';
      const method = data['계산방식'] || '';
      return timeInfo ? `${timeInfo} ${round} | ${method}`.trim() : '최신 환율';
    } catch (err) {
      console.error('시간 정보 처리 오류:', err);
      return '최신 환율';
    }
  };

  // 동적 환율 데이터 가져오기
  const fetchExchangeData = async (currency) => {
    setLoading(true);
    setError(null);

    try {
      // 모든 은행 환율 비교 API 사용 (새로운 방식)
      const compareResult = await exchangeAPI.compareAllBanks(currency, 1);

      if (compareResult.banks && compareResult.banks.length > 0) {
        const results = compareResult.banks.map((bankData, index) => ({
          name: bankData['은행'],
          amount: `${(bankData['환전 원화 금액'] || 0).toLocaleString()}원`,
          savings: index === 0 ? '🏆 최고 환율' : `${(compareResult.banks[0]['환전 원화 금액'] - bankData['환전 원화 금액']).toLocaleString()}원 차이`,
          tip: formatTimeInfo(bankData)
        }));

        setExchangeData(results);
      } else {
        // 데이터가 없으면 기존 방식으로 fallback
        await fetchExchangeDataLegacy(currency);
      }
    } catch (err) {
      console.error('환율 비교 API 실패, 기존 방식으로 시도:', err);
      await fetchExchangeDataLegacy(currency);
    } finally {
      setLoading(false);
    }
  };

  // 기존 방식 (fallback)
  const fetchExchangeDataLegacy = async (currency) => {
    try {
      const results = [];

      // 지원하는 모든 은행에 대해 요청
      const promises = supportedBanks.map(async (bankName) => {
        try {
          const data = await exchangeAPI.getExchangeRate(bankName, currency, 1);
          return {
            name: data['은행'],
            amount: `${(data['환전 원화 금액'] || 0).toLocaleString()}원`,
            savings: '최신 환율',
            tip: formatTimeInfo(data)
          };
        } catch (err) {
          console.warn(`${bankName} ${currency} 데이터 없음:`, err);
          return null;
        }
      });

      const settleds = await Promise.allSettled(promises);

      settleds.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          results.push(result.value);
        }
      });

      // 환율 비교 로직
      if (results.length > 1) {
        results.sort((a, b) => {
          const amountA = parseInt(a.amount.replace(/[^\d]/g, '')) || 0;
          const amountB = parseInt(b.amount.replace(/[^\d]/g, '')) || 0;
          return amountB - amountA;
        });

        const maxAmount = parseInt(results[0].amount.replace(/[^\d]/g, '')) || 0;
        results.forEach((item, index) => {
          const currentAmount = parseInt(item.amount.replace(/[^\d]/g, '')) || 0;
          if (index === 0) {
            item.savings = '🏆 최고 환율';
          } else {
            const diff = maxAmount - currentAmount;
            item.savings = diff > 0 ? `${diff.toLocaleString()}원 차이` : '동일 환율';
          }
        });
      }

      setExchangeData(results);
    } catch (err) {
      setError('환율 정보를 가져오는데 실패했습니다.');
      console.error('전체 에러:', err);
    }
  };

  useEffect(() => {
    if (selectedCountry && selectedCountry.currency !== 'CNY' && supportedBanks.length > 0) {
      fetchExchangeData(selectedCountry.currency);
    }
  }, [selectedCountry, supportedBanks]);

  const defaultData = supportedBanks.map(bank => ({
    name: bank,
    amount: '조회 중...',
    savings: '-',
    tip: '데이터 로딩 중...'
  }));

  const displayData = selectedCountry ?
      (loading ? defaultData : exchangeData.length > 0 ? exchangeData : defaultData) :
      [
        {
          name: '환전소 선택',
          amount: '좌측에서 국가를',
          savings: '선택해주세요',
          tip: '미국 또는 일본을 클릭하세요'
        }
      ];

  return (
      <div className="exchange-table">
        {selectedCountry && selectedCountry.currency === 'CNY' && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              🚧 중국 위안화는 아직 준비 중입니다.
            </div>
        )}

        {loading && (
            <div style={{
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#d1ecf1',
              border: '1px solid #bee5eb',
              borderRadius: '4px',
              marginBottom: '15px'
            }}>
              ⚡ {supportedBanks.length}개 은행 환율 정보 조회 중...
            </div>
        )}

        {error && (
            <div style={{
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              marginBottom: '15px',
              color: '#721c24'
            }}>
              ❌ {error}
            </div>
        )}

        {(!selectedCountry || selectedCountry.currency !== 'CNY') && (
            <table>
              <thead>
              <tr>
                <th>환전소</th>
                <th>
                  {selectedCountry ?
                      `1 ${selectedCountry.currency} → KRW` :
                      '환율 정보'
                  }
                </th>
                <th>비교</th>
                <th>업데이트 정보</th>
              </tr>
              </thead>
              <tbody>
              {displayData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.amount}</td>
                    <td>{item.savings}</td>
                    <td>{item.tip}</td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}
      </div>
  );
}

export default ExchangeRateTable;