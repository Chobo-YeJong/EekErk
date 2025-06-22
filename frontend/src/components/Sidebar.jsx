
function Sidebar({ onCountrySelect, selectedCountry }) {
  const countries = [
    { code: 'cn', name: '중국', currency: 'CNY', disabled: true },
    { code: 'jp', name: '일본', currency: 'JPY' },
    { code: 'us', name: '미국', currency: 'USD' },
  ]

  const handleCountryClick = (e, country) => {
    e.preventDefault();
    if (!country.disabled) {
      onCountrySelect(country);
    }
  }

  return (
      <div className="sidebar-country">
        <aside>
          <ul className="country-list">
            {countries.map((country, index) => (
                <li key={index} className="country-item">
                  <a
                      href="#"
                      onClick={(e) => handleCountryClick(e, country)}
                      style={{
                        opacity: country.disabled ? 0.5 : 1,
                        backgroundColor: selectedCountry?.code === country.code ? '#e3f2fd' : 'transparent'
                      }}
                  >
                    <span className={`fi fi-${country.code}`}></span>
                    {country.name}
                  </a>
                </li>
            ))}
          </ul>
        </aside>
      </div>
  )
}

export default Sidebar