const tickerForm = document.querySelector(".tickerForm");
const pastChartTemplate = document.querySelector(".pastChartTemplate");
const predChartTemplate = document.querySelector(".predChartTemplate");
const description = document.querySelector(".description");

function removeAllChild(node) {
  while (node.firstChild) {
    node.removeChild(node.lastChild);
  }
}

const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));

async function getPastPrice(ticker) {
  const res = await fetch("/past", {
    method: "POST",
    cache: "no-cache",
    headers: {},
    body: new URLSearchParams({
      ticker,
    }),
  });
  return await res.json();
}

async function paintPastChart(ticker) {
  removeAllChild(pastChartTemplate);
  pastChartTemplate.insertAdjacentHTML(
    "beforeend",
    `<canvas id="pastChart" width="2" height="1"></canvas>`
  );

  const data = await getPastPrice(ticker);
  if (data.message) return data;
  const pastChart = new Chart(document.querySelector("#pastChart"), {
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

async function updatePastChart(ticker, pastChart, predBtn) {
  while (predBtn.getAttribute("clicked") === "false") {
    await wait(60 * 1000);
    const data = await getRealPrice(ticker);
    pastChart.data.labels.shift();
    pastChart.data.labels.push(data.time.replace("GMT", "").trim());
    pastChart.data.datasets[0].data.shift();
    pastChart.data.datasets[0].data.push(data.real_price);
    pastChart.update();
  }
}

async function handlePastChart(ticker) {
  const canvas = predChartTemplate.querySelector("canvas");
  if (canvas) canvas.remove();
  const pastChart = await paintPastChart(ticker);
  if (pastChart.message) return pastChart;
  const predBtn = document.querySelector(".predBtn");
  if (predBtn) predBtn.remove();
  description.insertAdjacentHTML(
    "afterend",
    `<button class="predBtn btn btn-primary" clicked=false>예측하기</button>`
  );
  return pastChart;
}

async function getPredPrice(ticker) {
  const res = await fetch("/pred", {
    method: "POST",
    cache: "no-cache",
    headers: {},
    body: new URLSearchParams({
      ticker,
    }),
  });
  return await res.json();
}

function paintPredAtPastChart(data, ticker, pastChart) {
  if (pastChart.data.datasets.length >= 2) pastChart.data.datasets.pop();
  let label = new Date(data.last_time).getTime();
  const labels = [];
  for (const _ of data.pred_prices) {
    labels.push(new Date(label).toUTCString().replace("GMT", "").trim());
    label += 60000;
  }
  //   const labels = data.times.map((x) => x.replace("GMT", "").trim());
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

function paintPredChart(data, ticker, pastChart) {
  removeAllChild(predChartTemplate);
  predChartTemplate.insertAdjacentHTML(
    "beforeend",
    `<canvas id="predChart" width="2" height="1"></canvas>`
  );
  const predChart = new Chart(document.querySelector("#predChart"), {
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

async function getRealPrice(ticker) {
  const res = await fetch("/real", {
    method: "POST",
    cache: "no-cache",
    headers: {},
    body: new URLSearchParams({
      ticker,
    }),
  });
  return await res.json();
}

async function paintRealAtPredChart(ticker, pastChart, predChart) {
  for (let i = 0; i < 15; i++) {
    const data = await getRealPrice(ticker);
    predChart.data.datasets[1].data[i] = data.real_price;
    pastChart.data.datasets[0].data.push(data.real_price);
    predChart.update();
    pastChart.update();
    await wait(60 * 1000);
  }
}

async function paintPastAndPredChart(ticker, pastChart) {
  const predData = await getPredPrice(ticker);
  paintPredAtPastChart(predData, ticker, pastChart);
  const predChart = paintPredChart(predData, ticker, pastChart);
  await paintRealAtPredChart(ticker, pastChart, predChart);
}

tickerForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const ticker = this.ticker.value.toUpperCase();
  const pastChart = await handlePastChart(ticker);
  if (pastChart.message) {
    alert(pastChart.message);
    window.location.reload();
  }
  const predBtn = document.querySelector(".predBtn");
  predBtn.addEventListener("click", () => {
    predBtn.setAttribute("clicked", true);
    paintPastAndPredChart(ticker, pastChart);
  });
  await updatePastChart(ticker, pastChart, predBtn);
});
