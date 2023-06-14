import { useEffect, useState } from "react";
import Axios from "axios";
import Dropdown from "react-dropdown";
import { HiSwitchHorizontal } from "react-icons/hi";
import "react-dropdown/style.css";
import "./App.css";

function App() {
  // для конвертера
  const [info, setInfo] = useState([]);
  const [input, setInput] = useState("");
  const [from, setFrom] = useState("usd");
  const [to, setTo] = useState("rub");
  const [options, setOptions] = useState([]);
  const [output, setOutput] = useState(0);
  // для загрузки
  const [loading, setLoading] = useState(false);
  // для ошибки
  const [error, setError] = useState(false);

  useEffect(() => {
    // достаем данные из localStorage (если они есть) при первом рендере
    const toLocal = JSON.parse(localStorage.getItem("to"));
    const fromLocal = JSON.parse(localStorage.getItem("from"));

    if (toLocal) {
      setTo(() => toLocal);
    }

    if (fromLocal) {
      setFrom(() => fromLocal);
    }

    return () => {};
  }, []);

  // обращаемся к api за актуальными данными
  useEffect(() => {
    // отображаем загрузку
    setLoading(true);

    Axios.get(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}.json`
    )
      .then((res) => {
        setLoading(false);
        setInfo(res.data[from]);
        setInput("");
      })
      .catch((err) => {
        setError(err);
      });

    return () => {
      // при размонтировании заносим данные валют в localStorage
    };
  }, [from, to]);

  // Calling the convert function whenever
  // a user switches the currency
  useEffect(() => {
    setOptions(Object.keys(info));
    convert();
  }, [info]);

  // Function to convert the currency
  function convert(value) {
    var rate = info[to];
    setOutput(value * rate);
  }

  // Function to switch between two currency
  function flip() {
    var temp = from;
    setFrom(to);
    setTo(temp);
  }

  console.log(output);

  return (
    <div className="App">
      <div className="heading">
        <h1>Конвертер валют</h1>
      </div>
      <div className="container">
        <div className="left">
          <h3>Количество</h3>
          <input
            onInput={(e) => {
              convert(e.target.value);
            }}
            type="text"
            placeholder="Введите количество"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </div>
        <div className="middle">
          <h3>Моя валюта</h3>
          <Dropdown
            options={options}
            onChange={(e) => {
              localStorage.setItem("from", JSON.stringify(e.value));
              setFrom(e.value);
            }}
            value={from}
            placeholder="From"
          />
        </div>
        <div className="switch">
          <HiSwitchHorizontal
            size="30px"
            onClick={() => {
              flip();
            }}
          />
        </div>
        <div className="right">
          <h3>Обмен на</h3>
          <Dropdown
            options={options}
            onChange={(e) => {
              localStorage.setItem(
                "to",
                JSON.stringify(e.value ? e.value : to)
              );
              setTo(e.value);
            }}
            value={to}
            placeholder="To"
          />
        </div>
      </div>
      <div className="result">
        <h2>Результат:</h2>
        {loading && "loading..."}

        {!error && !loading ? (
          <p>
            {!input
              ? "Введите количество"
              : `${input} ${from} = ${output ? output : 0} ${to}`}
          </p>
        ) : (
          <span>{error}</span>
        )}
      </div>
    </div>
  );
}

export default App;
