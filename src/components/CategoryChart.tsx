import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  chartData: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
}

const CategoryChart: React.FC<CategoryChartProps> = ({ chartData }) => {
  return <Pie data={chartData} />;
};

export default CategoryChart;
