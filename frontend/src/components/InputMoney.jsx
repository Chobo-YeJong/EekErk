function InputMoney() {
  return (
    <div className="exchange-controls">
      <div className="exchange-type">
        <label>
          <select>
            <option>살때</option>
            <option>팔때</option>
          </select>
        </label>
      </div>
      <div className="amount-input">
        <label>
          <input type="text" />
        </label>
        <button>확인</button>
      </div>
    </div>
  )
}

export default InputMoney