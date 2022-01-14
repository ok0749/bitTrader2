const tickerForm = document.querySelector(".tickerForm");
const pastChartTemplate = document.querySelector(".pastChartTemplate");
const predChartTemplate = document.querySelector(".predChartTemplate");
const description = document.querySelector(".description");

function removeAllChild(node) {
  while (node.firstChild) {
    node.removeChild(node.lastChild);
  }
}

function paintPastChart(ticker, data) {
  removeAllChild(pastChartTemplate);
  pastChartTemplate.insertAdjacentHTML(
    "beforeend",
    `<canvas id="pastChart" width="2" height="1"></canvas>`
  );
  const ctx = document.querySelector("#pastChart");
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
          pointRadius: 1,
          pointHoverRadius: 1,
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
  const predBtn = document.querySelector(".predBtn");
  if (predBtn) predBtn.remove();
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
  paintPredAtPastChartAndPredChart(data, ticker, pastChart);
}

function paintPredAtPastChart(data, ticker, pastChart) {
  if (pastChart.data.datasets.length >= 2) pastChart.data.datasets.pop();
  let label = new Date(data.last_time).getTime();
  const labels = [];
  for (const _ of data.pred_prices) {
    labels.push(new Date(label).toUTCString().replace("GMT", "").trim());
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
    pointRadius: 1,
    pointHoverRadius: 1,
  });
  pastChart.update();
}

const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));

function paintPredChart(data, ticker, pastChart) {
  removeAllChild(predChartTemplate);
  predChartTemplate.insertAdjacentHTML(
    "beforeend",
    `<canvas id="predChart" width="2" height="1"></canvas>`
  );
  const ctx = document.querySelector("#predChart");
  const predChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: pastChart.data.labels.slice(-15),
      datasets: [
        {
          label: ticker + " 15분 예측 시가 데이터",
          data: data.pred_prices,
          fill: false,
          borderColor: "red",
          tension: 0.1,
          pointRadius: 1,
          pointHoverRadius: 1,
        },
        {
          label: ticker + " 15분 실제 시가 데이터",
          data: new Array(15),
          fill: false,
          borderColor: "blue",
          tension: 0.1,
          pointRadius: 1,
          pointHoverRadius: 1,
        },
      ],
    },
    options: {},
  });

  return predChart;
}

async function paintRealAtPredChart(ticker, predChart, i) {
  const res = await fetch("/real", {
    method: "POST",
    cache: "no-cache",
    headers: {},
    body: new URLSearchParams({
      ticker,
    }),
  });
  const data = await res.json();
  predChart.data.datasets[1].data[i] = data.real_price;
  predChart.update();
  await wait(60 * 1000);
}

async function paintPredAtPastChartAndPredChart(data, ticker, pastChart) {
  paintPredAtPastChart(data, ticker, pastChart);
  const predChart = paintPredChart(data, ticker, pastChart);
  for (let i = 0; i < 15; i++) {
    await paintRealAtPredChart(ticker, predChart, i);
  }
}

tickerForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const ticker = this.ticker.value;
  const pastChart = await handlePastChart(ticker);
  const predBtn = document.querySelector(".predBtn");

  predBtn.addEventListener("click", () => getPredPrice(ticker, pastChart));
});
