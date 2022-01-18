from flask import Flask, render_template, url_for, jsonify, request
from upbit import get_past_price, get_pred_price

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/past", methods=["POST"])
def past():
    ticker = request.form.get("ticker")
    try:
        past_price_df = get_past_price(ticker, 1380)
        labels = past_price_df.index.tolist()
        past_prices = past_price_df["open"].values.tolist()

        return jsonify({"past_prices": past_prices, "labels": labels})
    except:
        return jsonify({"message": "유효하지 않은 코인 심블입니다."})


@app.route("/pred", methods=["POST"])
def pred():
    ticker = request.form.get("ticker")
    pred_prices_ndarray, last_time = get_pred_price(ticker, 1380)
    pred_prices = pred_prices_ndarray.tolist()

    return jsonify(
        {
            "pred_prices": pred_prices,
            "last_time": last_time,
        }
    )


@app.route("/real", methods=["POST"])
def real():
    ticker = request.form.get("ticker")
    time = get_past_price(ticker, 1)["open"].index.tolist()[0]
    real_price = get_past_price(ticker, 1)["open"].values.tolist()[0]

    return jsonify({"real_price": real_price, "time": time})


if __name__ == "__main__":
    app.run(debug=True)