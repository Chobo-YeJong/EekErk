import Flag from 'react-world-flags';

function CountryViewer({ selectedCountry }) {
    if (selectedCountry) {
        return (
            <div className="exchange-header">
                <div className="currency-info">
                    <Flag
                        code={selectedCountry.flagCode || selectedCountry.code}
                        style={{ width: 32, height: 20 }}
                    />
                    <p>|</p>
                    <p>{selectedCountry.name}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="exchange-header">
            <div className="currency-info">
                <p>환율 정보를 불러오는 중...</p>
            </div>
        </div>
    );
}

export default CountryViewer;