'use client';

import React from 'react';
// import Chart from 'react-apexcharts';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ApexChart = ({ title, series, colors, categories }) => {
  const options = {
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false,
      },
    },
    colors: colors,
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 5,
      curve: 'smooth',
    },
    title: {
      text: title,
      align: 'left',
    },
    xaxis: {
      categories: categories,
    },
    grid: {
      borderColor: '#f1f1f1',
    },
  };

  return (
    <div className="mixed-chart">
      <Chart options={options} series={series} type="line" height={350} width="100%" />
    </div>
  );
};

export default ApexChart;
