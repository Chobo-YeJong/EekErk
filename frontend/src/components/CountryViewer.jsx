function CountryViewer({ selectedCountry }) {
  if (!selectedCountry) {
    return (
        <div className="exchange-header">
          <div className="currency-info">
            <p>환율 정보를 보려면 좌측에서 국가를 선택하세요</p>
          </div>
        </div>
    )
  }

  return (
      <div className="exchange-header">
        <div className="currency-info">
          <span className={`fi fi-${selectedCountry.code}`}></span>
          <p>{selectedCountry.name}</p>
          <p>|</p>
          <p>{selectedCountry.currency}</p>
        </div>
      </div>
  )
}

export default CountryViewer