import React, { useState, useEffect, useCallback } from "react";
import "./styles.css";

const url = "https://api.hnscan.com/txs";
const arr = [
  {
    name: "阿盖🐩",
    hash: "26fc07e1b624e6b66dbd70c89241ede583c0bca84cd2eade95e07935d127da42"
  },
  {
    name: "丹丹🐖",
    hash: "b60bae4ce277524e9ea8877edaa4a218cacbbb9b02a6f8fef3bfe7459f3e1252"
  },
  {
    name: "小鱼🐟",
    hash: "1863b6512e3956d1cec3d2075d802c06ea2b28f9d3056fb4f982b6b6f4de4dce"
  },
  {
    name: "地瓜🍠",
    hash: "ca95b8adf243180e28a4cfcf22c319dd8d07c836e71318fed3b3df8be48e4338"
  },
  {
    name: "阿爆💣",
    hash: "26fc07e1b624e6b66dbd70c89241ede583c0bca84cd2eade95e07935d127da42"
  },
  {
    name: "欧阳浩🐩",
    hash: "4e6b7631ec0b67ace546aeb52d1078853fd8e172cc32887fc30b6848d6dd163a"
  },
  {
    name: "阿树🌲",
    hash: "db1533183eeadc0889e21fd7109bcd023f584df15bf3c592a5af8b57916cf3b8 "
  },
  {
    name: "夜喵🐱",
    hash: "292094faffc7fb1cb6cc781edc2711208d3590f027c00073af8a3bec77d03450"
  },
  {
    name: "清真👳🏻‍♂️",
    hash: "c5b1821856c92d317078ea709128868014d71b7136d046a5003d52ede85da525"
  }
];

const getCoin = (name, hash) =>
  fetch(`${url}/${hash}`)
    .then(r => r.json())
    .then(res => res.confirmations);

const getPrice = () =>
  fetch("https://www.namebase.io/api/exchange/sell")
    .then(r => r.json())
    .then(r => (r.price * 4246.99).toFixed(5));

export default function App() {
  const [coins, setCoins] = useState([]);
  const [pause, setPause] = useState(false);
  const [price, setPrice] = useState();
  const [refreshing, setRefresh] = useState(false);
  const refresh = useCallback(() => {
    if (pause) return setRefresh(false);
    setRefresh(true);
    // getPrice().then(price => setPrice(price));
    Promise.all(
      arr.map(async (item, index) => {
        const coin = await getCoin(item.name, item.hash);
        return { name: item.name, coin, hash: item.hash };
      })
    )
      .then(c => setCoins(c))
      .finally(() => setRefresh(false));
  }, [pause]);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 30000);

    return () => clearInterval(t);
  }, [refresh]);

  if (!coins.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <h1>HZFE HNS Confirmations Ranking</h1>
      {price ? <div className="price">{price}</div> : ""}
      <ul>
        {coins
          .sort((a, b) => b.coin - a.coin)
          .map(({ name, coin, hash }) => (
            <li>
              <h3 onClick={() => window.open(`https://hnscan.com/tx/${hash}`)}>
                {name}
              </h3>
              <div>
                <div
                  style={{
                    width: `${+coin > 100 ? 100 : coin}%`,
                    backgroundColor: +coin >= 100 ? "#03c500" : undefined
                  }}
                >
                  {coin}
                </div>
              </div>
            </li>
          ))}
      </ul>
      <button onClick={() => setPause(!pause)}>
        {pause ? "Start" : "Pause"}
      </button>
      {refreshing ? (
        <div class="lds-circle">
          <div />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
