const tickerForm = document.querySelector(".tickerForm");
const pastChartTemplate = document.querySelector(".pastChartTemplate");
const predChartTemplate = document.querySelector(".predChartTemplate");
const description = document.querySelector(".description");

function paintPastChart(ticker, data) {
  pastChartTemplate.insertAdjacentHTML(
    "beforeend",
    `<canvas id="pastChart" width="2" height="1"></canvas>`
  );
  const ctx = document.querySelector("#pastChart");
  // candle stick
  //   const pastChart = new Chart(ctx, {
  //     type: "candlestick",
  //     data: {
  //       datasets: [
  //         {
  //           label: ticker + " 1380분 과거 데이터",
  //           data: data.past_prices,
  //         },
  //       ],
  //     },
  //     options: {},
  //   });
  //   return pastChart;
  // }

  // line chart
  const pastChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.labels.map((x) => x.replace("GMT", "").trim()),
      datasets: [
        {
          label: ticker + " 1380분 과거 시가 데이터",
          data: data.past_prices,
          fill: false,
          borderColor: "blue",
          tension: 0.1,
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

async function handlePastChart(ticker) {
  const pastChart = await getPastPrice(ticker);
  description.insertAdjacentHTML(
    "afterend",
    `<button class="predBtn btn btn-primary">예측하기</button>`
  );
  return pastChart;
}

// function paintPredChart(ticker, data) {
//   predChartTemplate.insertAdjacentHTML(
//     "beforeend",
//     `<canvas id="predChart" width="2" height="1"></canvas>`
//   );
//     const ctx = document.querySelector("#predChart");
//     // candle stick
//   const predChart = new Chart(ctx, {
//     type: "candlestick",
//     data: {
//       datasets: [
//         {
//           label: ticker + " 10분 예측 데이터",
//           data: data.pred_prices,
//         },
//       ],
//     },
//     options: {},
//   });
//   return predChart;
// }

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
  //   paintPredChart(ticker, data);

  let label = new Date(data.last_time).getTime();
  const labels = [];
  for (const pred_price of data.pred_prices) {
    // pastChart.data.datasets[0].data.push(pred_price);
    // pastChart.data.labels.push(new Date(label).toUTCString());
    labels.push(new Date(label).toUTCString());
    label += 60000;
  }
  pastChart.data.labels = pastChart.data.labels.concat(labels);
  pastChart.data.datasets.push({
    label: ticker + " 15분 미래 시가 데이터",
    data: pastChart.data.datasets[0].data
      .map((x) => null)
      .concat(data.pred_prices),
    fill: false,
    borderColor: "red",
    tension: 0.1,
  });
  pastChart.update();
}

tickerForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const ticker = this.ticker.value;
  const pastChart = await handlePastChart(ticker);
  const predBtn = document.querySelector(".predBtn");

  predBtn.addEventListener(
    "click",
    async () => await getPredPrice(ticker, pastChart)
  );
});
