function Sidebar() {
  const countries = [
    { code: 'cn', name: '중국' },
    { code: 'jp', name: '일본' },
    { code: 'us', name: '미국' },
  ]

  return (
    <div className="sidebar-country">
      <aside>
        <ul className="country-list">
          {countries.map((country, index) => (
            <li key={index} className="country-item">
              <a href="">
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