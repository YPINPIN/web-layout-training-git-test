import Chart from "chart.js/auto";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";
import dayjs from "dayjs";

// plugin
const averageLinePlugin = {
  id: "averageLine",
  beforeDraw: (chart) => {
    const {
      ctx,
      chartArea: { left, right, top, bottom },
      scales: { y },
    } = chart;

    // 取得 Y 軸平均值的像素位置
    const averageY = y.getPixelForValue(average);

    // 繪製平均線
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "#C5CCCB";
    ctx.lineWidth = 2;
    ctx.setLineDash([2, 2]);
    ctx.moveTo(left, averageY);
    ctx.lineTo(right, averageY);
    ctx.stroke();

    // 繪製平均文字
    ctx.fillStyle = "#C5CCCB";
    ctx.textAlign = "right";
    ctx.fillText(`${average}`, left - 8, averageY + 4);
    ctx.restore();
  },
};

const verticalLinePlugin = {
  id: "verticalLine",
  beforeDraw: (chart) => {
    // 檢查是否有顯示的tooltip，判斷資料是否被點擊
    if (chart.tooltip?._active?.length) {
      const activePoint = chart.tooltip._active[0];
      // 取得被點擊的 data 座標
      const x = activePoint.element.x;
      const y = activePoint.element.y;
      // 取得 Y 軸
      const yAxis = chart.scales.y;
      const ctx = chart.ctx;

      // 垂直線 shadow 設定
      ctx.shadowColor = "rgba(123, 201, 194, 0.5)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // 繪製垂直線
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, yAxis.bottom);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#7BC9C2";
      ctx.stroke();
      ctx.restore();

      // 重置 shadow
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
    }
  },
};

// -----------------------------------------------------------------------------------------------------------

// chart_1
const ctx_1 = document.getElementById("chart_1");
const data = [7.4, 8.0, 7.0, 6.0, 7.0, 8.5, 7.5];
const average = (
  data.reduce((sum, value) => sum + value, 0) / data.length
).toFixed(1);

let chart_1;
chart_1 = new Chart(ctx_1, {
  type: "bar",
  data: {
    // x 軸標籤
    labels: ["7/21", "7/22", "7/23", "7/24", "7/25", "7/26", "7/27"],
    // 資料
    datasets: [
      {
        data: data,
        barThickness: "20",
        backgroundColor: Array(data.length).fill("#C5CCCB"),
        hoverBackgroundColor: "#7BC9C2",
        minBarLength: "1",
        borderRadius: {
          topRight: 4,
          topLeft: 4,
        },
      },
    ],
  },
  options: {
    // 不維持比例
    maintainAspectRatio: false,
    plugins: {
      legend: {
        // 是否顯示上方分類文字
        display: false,
      },
      tooltip: {
        // tooltip 只會在點擊時觸發
        events: ["click"],
        backgroundColor: "#F6F7F7",
        bodyColor: "#15312F",
        bodyFont: {
          size: 12,
          weight: "bold",
        },
        padding: 4,
        cornerRadius: 4,
        // 是否顯示顏色色塊
        displayColors: false,
        // 顯示的位置
        xAlign: "center",
        yAlign: "bottom",
        callbacks: {
          title: function (tooltipItem) {
            // 返回空字串不顯示 title
            return "";
          },
          label: function (tooltipItem) {
            // 返回值加上單位
            return tooltipItem.formattedValue + " H";
          },
        },
      },
    },
    // 圖表邊距
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 24,
        bottom: 0,
      },
    },
    // 圖表軸線
    scales: {
      x: {
        grid: {
          // 是否顯示 x 軸線
          display: false,
        },
        // x 軸底邊線
        border: {
          color: "#C5CCCB",
          width: 1,
        },
        // x 軸標籤
        ticks: {
          color: "rgba(197, 204, 203, 0.6)",
          padding: 0,
          // 設定字重根據點擊變化
          font: (context) => {
            // 預設
            let fontWeight = "normal";
            // 如果為點擊的 index，設為粗體
            if (chart_1 && chart_1.selectedBarIndex === context.index) {
              fontWeight = "bold";
            }
            return {
              size: 12,
              family: "Inter",
              style: "normal",
              weight: fontWeight,
              lineHeight: 1.33,
            };
          },
        },
      },
      y: {
        // 從 0 開始
        beginAtZero: true,
        // 最大值
        max: Math.ceil(Math.max(...data)),
        grid: {
          // 不顯示 y 軸刻度
          drawTicks: false,
          // y 軸線顏色
          color: "rgba(197, 204, 203, 0.6)",
        },
        // y 軸側邊線
        border: {
          // 不顯示
          display: false,
          // 樣式
          dash: [2, 2],
          // dashOffset: 2,
          // 寬度
          width: 1,
        },
        // y 軸標籤
        ticks: {
          color: "rgba(197, 204, 203, 0.6)",
          padding: 12,
          // y 軸刻度間距
          stepSize: 3,
          font: {
            // 字體
            family: "Inter",
            // 字體大小
            size: 12,
            // 字體樣式
            style: "normal",
            // 字體粗細
            weight: "normal",
            // 行高
            lineHeight: 1.33,
          },
        },
      },
    },
    // 點擊事件
    onClick: function (event, elements, chart) {
      // 取得點擊的元素
      const clickedElement = elements[0];
      if (clickedElement) {
        const datasetIndex = clickedElement.datasetIndex;
        const index = clickedElement.index;
        const dataset = chart.data.datasets[datasetIndex];

        // 紀錄點擊的 index
        chart.selectedBarIndex = index;

        const originalColor = "#C5CCCB";
        const newColor = "#7BC9C2";
        // 重製所有 backgroundColor
        const length = dataset.data.length;
        dataset.backgroundColor = Array(length).fill(originalColor);
        // 設定點擊的 backgroundColor
        dataset.backgroundColor[index] = newColor;

        // 圖表更新
        chart.update();
      } else {
        // 如果點擊空白區域，刪除 index 紀錄
        // if (chart.selectedBarIndex !== undefined) {
        //   chart.selectedBarIndex = undefined;
        //   chart.update();
        // }
      }
    },
  },
  // 插件
  plugins: [averageLinePlugin],
});

// -----------------------------------------------------------------------------------------------------------

// chart_2
const ctx_2 = document.getElementById("chart_2");
let chart_2;
chart_2 = new Chart(ctx_2, {
  type: "bar",
  data: {
    // 資料
    datasets: [
      {
        data: [
          { x: "2025-07-21", y: "2025-07-21T23:20:00" },
          { x: "2025-07-22", y: "2025-07-21T23:40:00" },
          { x: "2025-07-23", y: "2025-07-22T00:50:00" },
          { x: "2025-07-24", y: "2025-07-22T00:20:00" },
          { x: "2025-07-25", y: "2025-07-21T24:00:00" },
          { x: "2025-07-26", y: "2025-07-22T00:30:00" },
          { x: "2025-07-27", y: "2025-07-21T23:20:00" },
        ],
        // 設定為折線
        type: "line",
        borderColor: "#C5CCCB",
        borderWidth: 2,
        backgroundColor: Array(7).fill("#C5CCCB"),
        hoverBackgroundColor: "#7BC9C2",
        // minBarLength: "1",
      },
    ],
  },
  options: {
    // 不維持比例
    maintainAspectRatio: false,
    plugins: {
      legend: {
        // 是否顯示上方分類文字
        display: false,
      },
      tooltip: {
        // tooltip 只會在點擊時觸發
        events: ["click"],
        backgroundColor: "#F6F7F7",
        bodyColor: "#15312F",
        bodyFont: {
          size: 12,
          weight: "bold",
        },
        padding: 4,
        cornerRadius: 4,
        // 是否顯示顏色色塊
        displayColors: false,
        // 顯示的位置
        xAlign: "center",
        yAlign: "bottom",
        callbacks: {
          title: function (tooltipItem) {
            // 返回空字串不顯示 title
            return "";
          },
          label: function (tooltipItem) {
            // 返回格式化的時間
            return dayjs(tooltipItem.raw.y).format("HH:mm A");
          },
        },
      },
    },
    // 圖表邊距
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 24,
        bottom: 0,
      },
    },
    // 圖表軸線
    scales: {
      x: {
        // 使用時間軸
        type: "time",
        // 時間軸顯示格式
        time: {
          unit: "day",
          displayFormats: {
            day: "M/D",
          },
        },
        grid: {
          // 是否顯示 x 軸線
          display: false,
        },
        // x 軸底邊線
        border: {
          color: "#C5CCCB",
          width: 1,
        },
        // x 軸標籤
        ticks: {
          color: "rgba(197, 204, 203, 0.6)",
          padding: 0,
          // 設定字重根據點擊變化
          font: (context) => {
            // 預設
            let fontWeight = "normal";
            // 如果為點擊的 index，設為粗體
            if (chart_2 && chart_2.selectedBarIndex === context.index) {
              fontWeight = "bold";
            }
            return {
              size: 12,
              family: "Inter",
              style: "normal",
              weight: fontWeight,
              lineHeight: 1.33,
            };
          },
        },
      },
      y: {
        // 使用時間軸
        type: "time",
        // 最小值
        min: "2025-07-21T23:00:00",
        // 最大值
        max: "2025-07-22T01:00:00",
        // 時間軸顯示格式
        time: {
          unit: "hour",
          displayFormats: {
            hour: "hh:mm",
          },
        },
        grid: {
          // 不顯示 y 軸刻度
          drawTicks: false,
          // y 軸線顏色
          color: "rgba(197, 204, 203, 0.6)",
        },
        // y 軸側邊線
        border: {
          // 不顯示
          display: false,
          // 樣式
          dash: [2, 2],
          // dashOffset: 2,
          // 寬度
          width: 1,
        },
        // y 軸標籤
        ticks: {
          color: "rgba(197, 204, 203, 0.6)",
          font: {
            // 字體
            family: "Inter",
            // 字體大小
            size: 12,
            // 字體樣式
            style: "normal",
            // 字體粗細
            weight: "normal",
            // 行高
            lineHeight: 1.33,
          },
        },
      },
    },
    // 點擊事件
    onClick: function (event, elements, chart) {
      // 取得點擊的元素
      const clickedElement = elements[0];
      if (clickedElement) {
        const datasetIndex = clickedElement.datasetIndex;
        const index = clickedElement.index;
        const dataset = chart.data.datasets[datasetIndex];

        // 紀錄點擊的 index
        chart.selectedBarIndex = index;

        const originalColor = "#C5CCCB";
        const newColor = "#7BC9C2";
        // 重製所有 backgroundColor
        const length = dataset.data.length;
        dataset.backgroundColor = Array(length).fill(originalColor);
        // 設定點擊的 backgroundColor
        dataset.backgroundColor[index] = newColor;

        // 圖表更新
        chart.update();
      } else {
        // 如果點擊空白區域，刪除 index 紀錄
        // if (chart.selectedBarIndex !== undefined) {
        //   chart.selectedBarIndex = undefined;
        //   chart.update();
        // }
      }
    },
  },
  // 插件
  plugins: [verticalLinePlugin],
});
