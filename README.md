# CCXT-JS – A pure Javascript crypto exchange library.

The **CCXT-JS** library is is a fork from the awesome CCXT library. It is intended as a pure JS only library. There are/will be no upstream or downstream dependencies on any other language. I have decided to create this fork so I can use it and focus 100% on a pure JS implementation. If this does not interest you, then I suggest to just use the CCXT library since their goals are different than mine.

**Why?**

You can read more about the 'why' [here](WHY.md).

Current feature list:

- support for many cryptocurrency exchanges — more coming soon
- fully implemented public and private APIs
- optional normalized data for cross-exchange analytics and arbitrage
- an out of the box unified API that is extremely easy to integrate
- works in Node 10.4+ (plans to update this to Node 18+ is in the works)


## Certified Cryptocurrency Exchanges 

Most of all the big exchanges are supported - Binance/US, Coinbase, Kucoin, Kraken, Crypto.com, Bybit, Bitget, Bitforex, Poloniex, etc. I will be adding the list of these back in once I lock more of the code down. Needless to say, I think CCXT supported 100+, so just look at the code to see if yours is there.

---

The library is under [MIT license](https://github.com/nibarulabs/ccxt-js/blob/master/LICENSE.txt), that means it's absolutely free for any developer to build commercial and opensource software on top of it, but use it at your own risk with no warranties, as is.

---

## Install

The easiest way to install the CCXT library is to use a package manager (PNPM is recommended):

(Still TBD when this will arrive in Npm)

- [ccxt-js in **PNPM**](https://www.npmjs.com/package/ccxt-js) (JavaScript / Node v7.6+)

This library is shipped as an all-in-one module implementation with minimalistic dependencies and requirements:

- [js/](https://github.com/nibarulabs/ccxt-js/blob/master/js/) in JavaScript

You can also clone it into your project directory from [ccxt GitHub repository](https://github.com/nibarulabs/ccxt-js):

```shell
git clone https://github.com/nibarulabs/ccxt-js.git  # including 1GB of commit history

# or

git clone https://github.com/nibarulabs/ccxt-js.git --depth 1  # avoid downloading 1GB of commit history
```

### JavaScript (PNPM)

JavaScript version of CCXT-JS works in Node. Web browsers are deprecated and will not be supported in the future).

[ccxt-js in **PNPM**](https://www.npmjs.com/package/ccxt-js)

```shell
pnpm install ccxt-js
```

```JavaScript
//cjs
var ccxtJs = require ('ccxt-js')
console.log (ccxtJs.exchanges) // print all available exchanges
```
```Javascript
//esm
import {version, exchanges} from 'ccxt-js';
console.log(version, Object.keys(exchanges));
```

### Docker

Docker support is deprecated.

---

## Documentation

Read the [Manual](https://github.com/nibarulabs/ccxt-js/wiki/) for more details.

## Usage

### Intro

The CCXT-JS library consists of a public part and a private part. Anyone can use the public part immediately after installation. Public APIs provide unrestricted access to public information for all exchange markets without the need to register a user account or have an API key.

Public APIs include the following:

- market data
- instruments/trading pairs
- price feeds (exchange rates)
- order books
- trade history
- tickers
- OHLC(V) for charting
- other public endpoints

In order to trade with private APIs you need to obtain API keys from an exchange's website. It usually means signing up to the exchange and creating API keys for your account. Some exchanges require personal info or identification. Sometimes verification may be necessary as well. In this case you will need to register yourself, this library will not create accounts or API keys for you. Some exchanges expose API endpoints for registering an account, but most exchanges don't. You will have to sign up and create API keys on their websites.

Private APIs allow the following:

- manage personal account info
- query account balances
- trade by making market and limit orders
- deposit and withdraw fiat and crypto funds
- query personal orders
- get ledger history
- transfer funds between accounts
- use merchant services

This library implements full public and private REST and WebSocket APIs for all exchanges in JavaScript only.

The CCXT-JS library will support cameCase coding style only. Snake case will be removed at a future date.

```JavaScript
// use camelCase style only:
exchange.methodName ()  // camelcase pseudocode
exchange.method_name () // snakecase pseudocode - DEPRECATED
```

Read the [Manual](https://github.com/nibarulabs/ccxt-js/wiki/) for more details.

### JavaScript

**CCXT-JS now supports ESM and CJS modules**

#### CJS

```JavaScript
// cjs example
'use strict';
const ccxtJs = require ('ccxt-js');

(async function () {
    let kraken    = new ccxtJs.kraken ()
    let bitfinex  = new ccxtJs.bitfinex ({ verbose: true })
    let huobipro  = new ccxtJs.huobipro ()
    let okcoinusd = new ccxtJs.okcoin ({
        apiKey: 'YOUR_PUBLIC_API_KEY',
        secret: 'YOUR_SECRET_PRIVATE_KEY',
    })

    const exchangeId = 'binance'
        , exchangeClass = ccxtJs[exchangeId]
        , exchange = new exchangeClass ({
            'apiKey': 'YOUR_API_KEY',
            'secret': 'YOUR_SECRET',
        })

    console.log (kraken.id,    await kraken.loadMarkets ())
    console.log (bitfinex.id,  await bitfinex.loadMarkets  ())
    console.log (huobipro.id,  await huobipro.loadMarkets ())

    console.log (kraken.id,    await kraken.fetchOrderBook (kraken.symbols[0]))
    console.log (bitfinex.id,  await bitfinex.fetchTicker ('BTC/USD'))
    console.log (huobipro.id,  await huobipro.fetchTrades ('ETH/USDT'))

    console.log (okcoinusd.id, await okcoinusd.fetchBalance ())

    // sell 1 BTC/USD for market price, sell a bitcoin for dollars immediately
    console.log (okcoinusd.id, await okcoinusd.createMarketSellOrder ('BTC/USD', 1))

    // buy 1 BTC/USD for $2500, you pay $2500 and receive ฿1 when the order is closed
    console.log (okcoinusd.id, await okcoinusd.createLimitBuyOrder ('BTC/USD', 1, 2500.00))

    // pass/redefine custom exchange-specific order params: type, amount, price or whatever
    // use a custom order type
    bitfinex.createLimitSellOrder ('BTC/USD', 1, 10, { 'type': 'trailing-stop' })

}) ();
```
#### ESM

```Javascript
//esm example
import {version, binance} from 'ccxt-js';

console.log(version);
const exchange = new binance();
const ticker = await exchange.fetchTicker('BTC/USDT');
console.log(ticker);
```

## Contributing

I'll be updating the contributing guidelines later.

