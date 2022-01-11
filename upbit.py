import os
import pyupbit
from dotenv import load_dotenv
from keras.models import load_model
from joblib import load


load_dotenv()

access = os.environ.get("ACCESS")
secret = os.environ.get("SECRET")

upbit = pyupbit.Upbit(access, secret)

# type 화폐 종목 반환
def get_tickers(type):
    return pyupbit.get_tickers(fiat=type)


# 가상화폐 현재가 반환
# 여러 종목 조회할 때는 리스트로
def get_current_price(ticker):
    return pyupbit.get_current_price(ticker)


# 현재 시점에서 과거 1380분 시가 반환
def get_past_price(ticker, count):
    past_price_df = pyupbit.get_ohlcv(ticker, interval="minute10", count=count)

    return past_price_df


# 예측
def get_pred_price(ticker, count):
    model = load("./model/lightgbm.joblib")
    past_price_df = get_past_price(ticker, count)[["open"]].T
    last_past_price = past_price_df.iloc[:, -1].open
    idx = past_price_df.columns[-1]
    pred_prices = last_past_price * model.predict(past_price_df)[0]

    return pred_prices, idx


if __name__ == "__main__":
    ticker = "KRW-BTC"
    get_pred_price(ticker, 1380)
    # past_price_df = get_past_price(ticker, 138)
    # for idx, _ in past_price_df.iterrows():
    #     print(int(idx.strftime("%s%f")) / 1000)
    # pred_prices, idx = get_pred_price(ticker, 1380)
    # print(idx)
    # past_price_df = get_past_price("KRW-BTC")
    # list = []
    # for idx, row in past_price_df.iloc[::10, :].iterrows():
    #     # print(idx.timestamp())
    #     print(int(idx.strftime("%s%f")) / 1000)

    #     dic = {
    #         "x": idx.timestamp(),
    #         "o": row["open"],
    #         "h": row["high"],
    #         "l": row["low"],
    #         "c": row["close"],
    #     }
    #     list.append(dic)
    # print(list)
    # print(len(list))