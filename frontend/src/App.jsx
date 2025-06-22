
import React, { useState } from 'react';
import './assets/css/App.css'
import './assets/css/reset.css'
import CountryViewer from './components/CountryViewer'
import Header from './components/Header'
import InputMoney from './components/InputMoney'
import ExchangeRateTable from './components/ExchangeRateTable'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
// import ApiTest from './components/ApiTest' // 테스트 컴포넌트 제거

function App() {
    const [selectedCountry, setSelectedCountry] = useState(null);

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
    };

    return (
        <div className="app">
            <Header />
            <main>
                <Sidebar
                    onCountrySelect={handleCountrySelect}
                    selectedCountry={selectedCountry}
                />
                <div className="content-area">
                    <CountryViewer selectedCountry={selectedCountry} />
                    <InputMoney />
                    <ExchangeRateTable selectedCountry={selectedCountry} />
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default App