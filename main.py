from flask import Flask, render_template, url_for, jsonify, request
from upbit import get_past_price, get_pred_price

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/past", methods=["POST"])
def past():
    # candle stick
    # ticker = request.form.get("ticker")
    # past_price_df = get_past_price(ticker, 1380)
    # past_prices = []
    # for idx, row in past_price_df.iterrows():
    #     dic = {
    #         "x": int(idx.strftime("%s%f")) / 1000,
    #         "o": row["open"],
    #         "h": row["high"],
    #         "l": row["low"],
    #         "c": row["close"],
    #     }
    #     past_prices.append(dic)

    # return jsonify({"past_prices": past_prices})

    # line chart
    ticker = request.form.get("ticker")
    past_price_df = get_past_price(ticker, 1380)
    labels = past_price_df.index.tolist()
    past_prices = past_price_df["open"].values.tolist()

    return jsonify({"past_prices": past_prices, "labels": labels})


@app.route("/pred", methods=["POST"])
def pred():
    # candle stick
    # ticker = request.form.get("ticker")
    # pred_prices_ndarray, idx = get_pred_price(ticker, 1380)
    # idx = int(idx.strftime("%s%f")) / 1000

    # pred_prices = []
    # for pred_price in pred_prices_ndarray:
    #     idx += 60000
    #     dic = {
    #         "x": idx,
    #         "o": pred_price,
    #         "h": pred_price,
    #         "l": pred_price,
    #         "c": pred_price,
    #     }
    #     pred_prices.append(dic)

    # return jsonify({"pred_prices": pred_prices})

    # line chart
    ticker = request.form.get("ticker")
    pred_prices_ndarray, last_time = get_pred_price(ticker, 1380)
    pred_prices = pred_prices_ndarray.tolist()

    return jsonify({"pred_prices": pred_prices, "last_time": last_time})


if __name__ == "__main__":
    app.run(debug=True)