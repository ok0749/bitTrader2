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
    past_price_df = pyupbit.get_ohlcv(ticker, interval="minute1", count=count)

    return past_price_df


# 예측
def get_pred_price(ticker, count):
    model = load("./model/lightgbm.joblib")
    past_price_df = get_past_price(ticker, count)[["open"]].T
    last_price = past_price_df.iloc[:, -1].open
    last_time = past_price_df.columns[-1]
    pred_prices_ndarray = last_price * model.predict(past_price_df)[0]

    return pred_prices_ndarray, last_time


if __name__ == "__main__":
    ticker = "KRW-BTC"
    print(get_past_price(ticker, 15)["open"].index)
    print(get_past_price(ticker, 15)["open"].values)
