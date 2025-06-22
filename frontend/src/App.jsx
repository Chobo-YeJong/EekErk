import './assets/css/App.css'
import './assets/css/reset.css'
import CountryViewer from './components/CountryViewer'
import Header from './components/Header'
import InputMoney from './components/InputMoney'
import MoneyTable from './components/MoneyTable'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

function App() {
    return (
        <div className="app">
            <Header />
            <main>
                <Sidebar />
                <div className="content-area">
                    <CountryViewer />
                    <InputMoney />
                    <MoneyTable />
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default App