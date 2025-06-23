
function Sidebar({ onCountrySelect, selectedCountry }) {
  const countries = [
    { name: '미국', currency: 'USD', code: 'us', flagCode: 'us' },
    { name: '일본', currency: 'JPY', code: 'jp', flagCode: 'jp' }
  ];

  return (
      <aside className="sidebar-country">
        <div className="country-list">
          {countries.map((country) => (
              <div
                  key={country.code}
                  className={`country-item ${
                      selectedCountry?.code === country.code ? 'active' : ''
                  }`}
              >
                <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onCountrySelect(country);
                    }}
                >
                  {country.name}
                </a>
              </div>
          ))}
        </div>
      </aside>
  );
}

export default Sidebar;