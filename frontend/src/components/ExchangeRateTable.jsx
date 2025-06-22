import React, { useState, useEffect } from 'react';
import { exchangeAPI } from '../utils/exchangeAPI';

function ExchangeRateTable({ selectedCountry }) {
  const [exchangeData, setExchangeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 기본 더미 데이터 (API 호출 전까지 표시)
  const defaultData = [
    {
      name: '신한은행',
      amount: '조회 중...',
      savings: '-',
      tip: '모바일 앱으로 사전 신청 시 우대율 90%'
    },
    {
      name: '하나은행',
      amount: '조회 중...',
      savings: '-',
      tip: '신한카드 결제 시 추가 우대'
    }
  ];

  // 안전하게 시간 정보 처리하는 함수
  const formatTimeInfo = (data) => {
    try {
      let timeInfo = '';

      // 고시시각 처리 - 여러 형태에 대응
      if (data['고시시각:']) {
        if (Array.isArray(data['고시시각:'])) {
          timeInfo = data['고시시각:'].join(' ');
        } else if (typeof data['고시시각:'] === 'string') {
          timeInfo = data['고시시각:'];
        }
      } else if (data['고시시각']) {
        if (Array.isArray(data['고시시각'])) {
          timeInfo = data['고시시각'].join(' ');
        } else if (typeof data['고시시각'] === 'string') {
          timeInfo = data['고시시각'];
        }
      }

      // 고시회차 추가
      const round = data['고시회차:'] || data['고시회차'] || '';

      return timeInfo ? `${timeInfo} ${round}`.trim() : '최신 환율';
    } catch (err) {
      console.error('시간 정보 처리 오류:', err);
      return '최신 환율';
    }
  };

  // API 데이터 가져오기
  const fetchExchangeData = async (currency) => {
    setLoading(true);
    setError(null);

    try {
      const results = [];

      if (currency === 'USD') {
        // 1달러 기준으로 조회
        const [sinhanResult, hanaResult] = await Promise.allSettled([
          exchangeAPI.getSinhanUsdToKrw(1),
          exchangeAPI.getHanaUsdToKrw(1)
        ]);

        if (sinhanResult.status === 'fulfilled') {
          const data = sinhanResult.value;
          console.log('신한은행 USD 데이터:', data); // 디버깅용

          results.push({
            name: '신한은행',
            amount: `${(data['환전 원화 금액'] || 0).toLocaleString()}원`,
            savings: '최신 환율',
            tip: formatTimeInfo(data)
          });
        } else {
          console.error('신한은행 USD 에러:', sinhanResult.reason);
        }

        if (hanaResult.status === 'fulfilled') {
          const data = hanaResult.value;
          console.log('하나은행 USD 데이터:', data); // 디버깅용

          results.push({
            name: '하나은행',
            amount: `${(data['환전 원화 금액'] || 0).toLocaleString()}원`,
            savings: '최신 환율',
            tip: formatTimeInfo(data)
          });
        } else {
          console.error('하나은행 USD 에러:', hanaResult.reason);
        }
      }
      else if (currency === 'JPY') {
        // 1엔 기준으로 조회
        const [sinhanResult, hanaResult] = await Promise.allSettled([
          exchangeAPI.getSinhanJpyToKrw(1),
          exchangeAPI.getHanaJpyToKrw(1)
        ]);

        if (sinhanResult.status === 'fulfilled') {
          const data = sinhanResult.value;
          console.log('신한은행 JPY 데이터:', data); // 디버깅용

          results.push({
            name: '신한은행',
            amount: `${(data['환전 원화 금액'] || 0).toLocaleString()}원`,
            savings: '최신 환율',
            tip: formatTimeInfo(data)
          });
        } else {
          console.error('신한은행 JPY 에러:', sinhanResult.reason);
        }

        if (hanaResult.status === 'fulfilled') {
          const data = hanaResult.value;
          console.log('하나은행 JPY 데이터:', data); // 디버깅용

          results.push({
            name: '하나은행',
            amount: `${(data['환전 원화 금액'] || 0).toLocaleString()}원`,
            savings: '최신 환율',
            tip: formatTimeInfo(data)
          });
        } else {
          console.error('하나은행 JPY 에러:', hanaResult.reason);
        }
      }

      // 결과가 있는 경우에만 정렬 및 비교
      if (results.length > 0) {
        // 환전 금액 기준으로 정렬 (높은 순)
        results.sort((a, b) => {
          const amountA = parseInt(a.amount.replace(/[^\d]/g, '')) || 0;
          const amountB = parseInt(b.amount.replace(/[^\d]/g, '')) || 0;
          return amountB - amountA;
        });

        // 최고 환율에 절약 금액 표시
        if (results.length > 1) {
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
        } else if (results.length === 1) {
          results[0].savings = '🏆 최고 환율';
        }
      }

      setExchangeData(results);
    } catch (err) {
      setError('환율 정보를 가져오는데 실패했습니다.');
      console.error('전체 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  // 국가 선택 시 데이터 가져오기
  useEffect(() => {
    if (selectedCountry && selectedCountry.currency !== 'CNY') {
      fetchExchangeData(selectedCountry.currency);
    }
  }, [selectedCountry]);

  // 표시할 데이터 결정
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
        {/* 헤더 추가 */}
        {selectedCountry && selectedCountry.currency !== 'CNY' && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              padding: '10px 0'
            }}>
              <h3>
                💱 1 {selectedCountry.currency} → KRW 실시간 환율
              </h3>
              {!loading && (
                  <button
                      onClick={() => fetchExchangeData(selectedCountry.currency)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                  >
                    🔄 새로고침
                  </button>
              )}
            </div>
        )}

        {/* 중국 선택 시 메시지 */}
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

        {/* 로딩 상태 */}
        {loading && (
            <div style={{
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              marginBottom: '15px'
            }}>
              🔄 실시간 환율 정보를 가져오는 중... (10-20초 소요)
            </div>
        )}

        {/* 에러 상태 */}
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

        {/* 테이블 */}
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
  )
}

export default ExchangeRateTable