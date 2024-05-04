import Exchange from './abstract/woo.js';
import type { TransferEntry, Balances, Conversion, Currency, FundingRateHistory, Int, Market, Num, OHLCV, Order, OrderBook, OrderSide, OrderType, Str, Strings, Trade, Transaction, Leverage, Account, Currencies, TradingFees } from './base/types.js';
/**
 * @class woo
 * @augments Exchange
 */
export default class woo extends Exchange {
    describe(): any;
    fetchStatus(params?: {}): Promise<{
        status: string;
        updated: any;
        eta: any;
        url: any;
        info: any;
    }>;
    fetchTime(params?: {}): Promise<number>;
    fetchMarkets(params?: {}): Promise<Market[]>;
    parseMarket(market: any): Market;
    fetchTrades(symbol: string, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    parseTrade(trade: any, market?: Market): Trade;
    parseTokenAndFeeTemp(item: any, feeTokenKey: any, feeAmountKey: any): any;
    fetchTradingFees(params?: {}): Promise<TradingFees>;
    fetchCurrencies(params?: {}): Promise<Currencies>;
    createMarketBuyOrderWithCost(symbol: string, cost: number, params?: {}): Promise<Order>;
    createTrailingAmountOrder(symbol: string, type: OrderType, side: OrderSide, amount: number, price?: Num, trailingAmount?: any, trailingTriggerPrice?: any, params?: {}): Promise<Order>;
    createTrailingPercentOrder(symbol: string, type: OrderType, side: OrderSide, amount: number, price?: Num, trailingPercent?: any, trailingTriggerPrice?: any, params?: {}): Promise<Order>;
    createOrder(symbol: string, type: OrderType, side: OrderSide, amount: number, price?: Num, params?: {}): Promise<Order>;
    editOrder(id: string, symbol: string, type: OrderType, side: OrderSide, amount?: Num, price?: Num, params?: {}): Promise<Order>;
    cancelOrder(id: string, symbol?: Str, params?: {}): Promise<any>;
    cancelAllOrders(symbol?: Str, params?: {}): Promise<any>;
    cancelAllOrdersAfter(timeout: Int, params?: {}): Promise<any>;
    fetchOrder(id: string, symbol?: Str, params?: {}): Promise<Order>;
    fetchOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    fetchOpenOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    fetchClosedOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    parseTimeInForce(timeInForce: any): string;
    parseOrder(order: any, market?: Market): Order;
    parseOrderStatus(status: any): any;
    fetchOrderBook(symbol: string, limit?: Int, params?: {}): Promise<OrderBook>;
    fetchOHLCV(symbol: string, timeframe?: string, since?: Int, limit?: Int, params?: {}): Promise<OHLCV[]>;
    parseOHLCV(ohlcv: any, market?: Market): OHLCV;
    fetchOrderTrades(id: string, symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    fetchMyTrades(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    fetchAccounts(params?: {}): Promise<Account[]>;
    parseAccount(account: any): {
        info: any;
        id: string;
        name: string;
        code: any;
        type: string;
    };
    fetchBalance(params?: {}): Promise<Balances>;
    parseBalance(response: any): Balances;
    fetchDepositAddress(code: string, params?: {}): Promise<{
        currency: string;
        address: string;
        tag: string;
        network: string;
        info: any;
    }>;
    getAssetHistoryRows(code?: Str, since?: Int, limit?: Int, params?: {}): Promise<any[]>;
    fetchLedger(code?: Str, since?: Int, limit?: Int, params?: {}): Promise<any>;
    parseLedgerEntry(item: any, currency?: Currency): {
        id: string;
        currency: any;
        account: string;
        referenceAccount: any;
        referenceId: string;
        status: string;
        amount: number;
        before: any;
        after: any;
        fee: any;
        direction: string;
        timestamp: number;
        datetime: string;
        type: string;
        info: any;
    };
    parseLedgerEntryType(type: any): string;
    getCurrencyFromChaincode(networkizedCode: any, currency: any): any;
    fetchDeposits(code?: Str, since?: Int, limit?: Int, params?: {}): Promise<Transaction[]>;
    fetchWithdrawals(code?: Str, since?: Int, limit?: Int, params?: {}): Promise<Transaction[]>;
    fetchDepositsWithdrawals(code?: Str, since?: Int, limit?: Int, params?: {}): Promise<Transaction[]>;
    parseTransaction(transaction: any, currency?: Currency): Transaction;
    parseTransactionStatus(status: any): string;
    transfer(code: string, amount: number, fromAccount: string, toAccount: string, params?: {}): Promise<TransferEntry>;
    fetchTransfers(code?: Str, since?: Int, limit?: Int, params?: {}): Promise<any>;
    parseTransfer(transfer: any, currency?: Currency): {
        id: string;
        timestamp: number;
        datetime: string;
        currency: any;
        amount: number;
        fromAccount: string;
        toAccount: string;
        status: string;
        info: any;
    };
    parseTransferStatus(status: any): string;
    withdraw(code: string, amount: number, address: string, tag?: any, params?: {}): Promise<Transaction>;
    repayMargin(code: string, amount: any, symbol?: Str, params?: {}): Promise<any>;
    parseMarginLoan(info: any, currency?: Currency): {
        id: any;
        currency: string;
        amount: any;
        symbol: any;
        timestamp: any;
        datetime: any;
        info: any;
    };
    nonce(): number;
    sign(path: any, section?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
    handleErrors(httpCode: any, reason: any, url: any, method: any, headers: any, body: any, response: any, requestHeaders: any, requestBody: any): any;
    parseIncome(income: any, market?: Market): {
        info: any;
        symbol: string;
        code: string;
        timestamp: number;
        datetime: string;
        id: string;
        amount: number;
        rate: number;
    };
    fetchFundingHistory(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<import("./base/types.js").FundingHistory[]>;
    parseFundingRate(fundingRate: any, market?: Market): {
        info: any;
        symbol: string;
        markPrice: any;
        indexPrice: any;
        interestRate: number;
        estimatedSettlePrice: any;
        timestamp: number;
        datetime: string;
        fundingRate: number;
        fundingTimestamp: number;
        fundingDatetime: string;
        nextFundingRate: any;
        nextFundingTimestamp: any;
        nextFundingDatetime: any;
        previousFundingRate: number;
        previousFundingTimestamp: number;
        previousFundingDatetime: string;
    };
    fetchFundingRate(symbol: string, params?: {}): Promise<{
        info: any;
        symbol: string;
        markPrice: any;
        indexPrice: any;
        interestRate: number;
        estimatedSettlePrice: any;
        timestamp: number;
        datetime: string;
        fundingRate: number;
        fundingTimestamp: number;
        fundingDatetime: string;
        nextFundingRate: any;
        nextFundingTimestamp: any;
        nextFundingDatetime: any;
        previousFundingRate: number;
        previousFundingTimestamp: number;
        previousFundingDatetime: string;
    }>;
    fetchFundingRates(symbols?: Strings, params?: {}): Promise<any>;
    fetchFundingRateHistory(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<FundingRateHistory[]>;
    setPositionMode(hedged: boolean, symbol?: Str, params?: {}): Promise<any>;
    fetchLeverage(symbol: string, params?: {}): Promise<Leverage>;
    parseLeverage(leverage: any, market?: any): Leverage;
    setLeverage(leverage: Int, symbol?: Str, params?: {}): Promise<any>;
    fetchPosition(symbol?: Str, params?: {}): Promise<import("./base/types.js").Position>;
    fetchPositions(symbols?: Strings, params?: {}): Promise<import("./base/types.js").Position[]>;
    parsePosition(position: any, market?: Market): import("./base/types.js").Position;
    fetchConvertQuote(fromCode: string, toCode: string, amount?: Num, params?: {}): Promise<Conversion>;
    createConvertTrade(id: string, fromCode: string, toCode: string, amount?: Num, params?: {}): Promise<Conversion>;
    fetchConvertTrade(id: string, code?: Str, params?: {}): Promise<Conversion>;
    fetchConvertTradeHistory(code?: Str, since?: Int, limit?: Int, params?: {}): Promise<Conversion[]>;
    parseConversion(conversion: any, fromCurrency?: Currency, toCurrency?: Currency): Conversion;
    fetchConvertCurrencies(params?: {}): Promise<Currencies>;
    defaultNetworkCodeForCurrency(code: any): any;
    setSandboxMode(enable: boolean): void;
}