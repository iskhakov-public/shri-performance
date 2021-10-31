function quantile(arr, q) {
  const sorted = arr.sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;

  if (sorted[base + 1] !== undefined) {
    return Math.floor(sorted[base] + rest * (sorted[base + 1] - sorted[base]));
  } else {
    return Math.floor(sorted[base]);
  }
}

function prepareData(result) {
  return result.data.map((item) => {
    item.date = item.timestamp.split("T")[0];

    return item;
  });
}

// TODO: реализовать
// показать значение метрики за несколько день
function addMetric(data, name, filterFn) {
  let sampleData = data.filter(filterFn(name)).map((item) => item.value);

  let result = {};

  result.hits = sampleData.length;
  result.p25 = quantile(sampleData, 0.25);
  result.p50 = quantile(sampleData, 0.5);
  result.p75 = quantile(sampleData, 0.75);
  result.p95 = quantile(sampleData, 0.95);

  return result;
}

function showMetric(data, filterFn) {
  let table = {};
  table.connect = addMetric(data, "connect", filterFn);
  table.ttfb = addMetric(data, "ttfb", filterFn);
  table.fcp = addMetric(data, "first-contentful-paint", filterFn);
  table.fp = addMetric(data, "first-paint", filterFn);
  table.add = addMetric(data, "render-add", filterFn);
  table.add_by_one = addMetric(data, "render-add-by-one", filterFn);
  table.render_drop = addMetric(data, "render-drop", filterFn);
  table.pageloadtime = addMetric(data, "pageloadtime", filterFn);
  table.resptime_send_js = addMetric(data, "resptime-send.js", filterFn);
  table.resptime_tailwind = addMetric(
    data,
    "resptime-tailwind.min.css",
    filterFn
  );
  console.table(table);
}

// показать сессию пользователя
function showSession(data, sessionId, page) {
  console.log(
    `All metrics for session ${sessionId} (click on index header to sort by timestamp):`
  );

  let sampleData = data.filter(
    (item) => item.requestId == sessionId && item.page == page
  );

  sampleData = sampleData.sort(
    (a, b) => Date.parse(a.timestamp) < Date.parse(b.timestamp)
  );

  if (sampleData.length == 0) {
    console.log(`There is no metrics for session ${sessionId}`);
  }
  let table = {
    init_env: { name: "env", value: sampleData[0].additional.env },
    init_plt: { name: "platform", value: sampleData[0].additional.platform },
  };
  for (let entry of sampleData) {
    table[entry.timestamp] = {
      name: entry.name,
      value: entry.value,
    };
  }
  console.table(table);
}

// сравнить метрику в разных срезах
function compareMetric(
  data,
  metricName,
  page,
  dateStart1,
  dateEnd1,
  dateStart2,
  dateEnd2
) {
  console.log(
    `Comparing metric ${metricName} within period1: ${dateStart1} - ${dateEnd1} and period2: ${dateStart2} - ${dateEnd2}`
  );
  let filterFn1 = (name) => (item) =>
    item.page == page &&
    item.name == name &&
    Date.parse(item.date) >= Date.parse(dateStart1) &&
    Date.parse(item.date) <= Date.parse(dateEnd1);
  let filterFn2 = (name) => (item) =>
    item.page == page &&
    item.name == name &&
    Date.parse(item.date) >= Date.parse(dateStart2) &&
    Date.parse(item.date) <= Date.parse(dateEnd2);

  const table = {};
  table[`${metricName}: ${dateStart1} - ${dateEnd1}`] = addMetric(
    data,
    metricName,
    filterFn1
  );
  table[`${metricName}: ${dateStart2} - ${dateEnd2}`] = addMetric(
    data,
    metricName,
    filterFn2
  );
  console.table(table);
}

function calcMetricsByPeriod(data, page, date1, date2) {
  console.log(`All metrics between ${date1} and ${date2}:`);
  let filterFn = (name) => (item) =>
    item.page == page &&
    item.name == name &&
    Date.parse(item.date) >= Date.parse(date1) &&
    Date.parse(item.date) <= Date.parse(date2);
  showMetric(data, filterFn);
}

// рассчитывает все метрики за день
function calcMetricsByDate(data, page, date) {
  console.log(`All metrics for ${date}:`);

  let filterFn = (name) => (item) =>
    item.page == page && item.name == name && item.date == date;

  showMetric(data, filterFn);
}

fetch(
  "https://shri.yandex/hw/stat/data?counterId=fa8b905f-ee0c-4345-afb0-d7b4da249d49"
)
  .then((res) => res.json())
  .then((result) => {
    let data = prepareData(result);
    console.log(data);

    calcMetricsByDate(data, "todo-app", "2021-10-31");

    calcMetricsByPeriod(data, "todo-app", "2021-10-31", "2021-11-2");

    showSession(data, "77189161", "todo-app");

    compareMetric(
      data,
      "first-paint",
      "todo-app",
      "2021-10-31",
      "2021-10-31",
      "2021-11-1",
      "2021-11-1"
    );
  });
