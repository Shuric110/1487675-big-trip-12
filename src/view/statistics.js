import ComponentView from "./component.js";

import {EventType, EVENT_TYPES} from "../const.js";
import {formatDuration} from "../util/date.js";

import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 55;

const EVENT_TYPE_TITLES = {
  [EventType.TAXI]: `🚕 TAXI`,
  [EventType.BUS]: `🚌 BUS`,
  [EventType.TRAIN]: `🚂 TRAIN`,
  [EventType.SHIP]: `🚢 SHIP`,
  [EventType.TRANSPORT]: `🚊 TRANSPORT`,
  [EventType.DRIVE]: `🚗 DRIVE`,
  [EventType.FLIGHT]: `✈️ FLY`,
  [EventType.CHECK_IN]: `🏨 STAY`,
  [EventType.SIGHTSEEING]: `🏛 LOOK`,
  [EventType.RESTAURANT]: `🍴 EAT`
};

const renderMoneyChart = function (moneyCtx, moneyStatistics) {
  const labels = Object.keys(moneyStatistics).map((eventType) => EVENT_TYPE_TITLES[eventType]);
  moneyCtx.height = BAR_HEIGHT * labels.length;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: Object.values(moneyStatistics),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTransportChart = function (transportCtx, transportStatistics) {
  const labels = Object.keys(transportStatistics).map((eventType) => EVENT_TYPE_TITLES[eventType]);
  transportCtx.height = BAR_HEIGHT * labels.length;

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: Object.values(transportStatistics),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeSpentChart = function (timeSpentCtx, timeSpentStatistics) {
  const labels = Object.keys(timeSpentStatistics).map((eventType) => EVENT_TYPE_TITLES[eventType]);
  timeSpentCtx.height = BAR_HEIGHT * labels.length;

  return new Chart(timeSpentCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: Object.values(timeSpentStatistics),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => formatDuration(val)
        }
      },
      title: {
        display: true,
        text: `TIME SPENT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const calculateStatistics = function (events) {
  const statistics = {};

  for (let evt of events) {
    let statItem = {cost: 0, timeMinutes: 0, count: 0};
    if (evt.type in statistics) {
      statItem = statistics[evt.type];
    }

    statItem.cost += evt.cost;
    statItem.timeMinutes += Math.floor((evt.endDateTime.getTime() - evt.beginDateTime.getTime()) / 1000 / 60);
    statItem.count++;

    statistics[evt.type] = statItem;
  }

  return {
    money: Object.entries(statistics)
      .sort(([, {cost: costA}], [, {cost: costB}]) => costB - costA)
      .reduce(
          (result, [type, {cost}]) => Object.assign(result, {[type]: cost}),
          {}
      ),
    transport: Object.entries(statistics)
      .sort(([, {cost: countA}], [, {cost: countB}]) => countB - countA)
      .filter(([type]) => EVENT_TYPES[type].isTransport)
      .reduce(
          (result, [type, {count}]) => Object.assign(result, {[type]: count}),
          {}
      ),
    timeSpent: Object.entries(statistics)
      .sort(([, {timeMinutes: timeA}], [, {timeMinutes: timeB}]) => timeB - timeA)
      .reduce(
          (result, [type, {timeMinutes}]) => Object.assign(result, {[type]: timeMinutes}),
          {}
      )
  };
};


export default class Statistics extends ComponentView {
  constructor(tripEvents) {
    super();

    this._statistics = calculateStatistics(tripEvents);
  }

  renderCharts() {
    const moneyCanvasElement = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCanvasElement = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpentCanvasElement = this.getElement().querySelector(`.statistics__chart--time`);

    renderMoneyChart(moneyCanvasElement, this._statistics.money);
    renderTransportChart(transportCanvasElement, this._statistics.transport);
    renderTimeSpentChart(timeSpentCanvasElement, this._statistics.timeSpent);
  }

  getTemplate() {
    return `
      <section class="statistics">
        <h2 class="visually-hidden">Trip statistics</h2>

        <div class="statistics__item statistics__item--money">
          <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--transport">
          <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--time-spend">
          <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
        </div>
      </section>
    `;
  }
}
