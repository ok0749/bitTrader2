const tickerForm = document.querySelector(".tickerForm");
const pastChartTemplate = document.querySelector(".pastChartTemplate");
const description = document.querySelector(".description");

function paintPastChart(ticker, data) {
  pastChartTemplate.insertAdjacentHTML(
    "beforeend",
    `<canvas id="pastChart" width="2" height="1"></canvas>`
  );
  const ctx = document.querySelector("#pastChart");
  const pastChart = new Chart(ctx, {
    type: "candlestick",
    data: {
      datasets: [
        {
          label: ticker + " 1380분 데이터",
          data: data.past_prices,
        },
      ],
    },
    options: {},
  });
  return pastChart;
}

async function getPastPrice(ticker) {
  const res = await fetch("/past", {
    method: "POST",
    cache: "no-cache",
    headers: {},
    body: new URLSearchParams({
      ticker,
    }),
  });
  const data = await res.json();
  return paintPastChart(ticker, data);
}

async function handleSubmit(ticker) {
  const pastChart = await getPastPrice(ticker);
  description.insertAdjacentHTML(
    "afterend",
    `<button class="predBtn btn btn-primary">예측하기</button>`
  );
  return pastChart;
}

async function getPredPrice(ticker, pastChart) {
  const res = await fetch("/pred", {
    method: "POST",
    cache: "no-cache",
    headers: {},
    body: new URLSearchParams({
      ticker,
    }),
  });
  const data = await res.json();
  for (const dic of data.pred_prices) {
    pastChart.data.datasets[0].data.push(dic);
  }
  pastChart.update();
}

tickerForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const ticker = this.ticker.value;
  const pastChart = await handleSubmit(ticker);
  const predBtn = document.querySelector(".predBtn");

  predBtn.addEventListener("click", () => getPredPrice(ticker, pastChart));
});
