import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

const BarChart = ({ chartData }) => {
  return <Doughnut data={chartData} options={options}></Doughnut>;
};

export default BarChart;
