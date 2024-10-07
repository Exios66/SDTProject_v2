import React from 'react';
import { Bar, Line, Pie, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import './Visualization.css';

ChartJS.register(...registerables);

const Visualization = ({ data, type, assessmentType }) => {
  const chartColors = {
    machiavellianism: 'rgba(255, 99, 132, 0.6)',
    narcissism: 'rgba(54, 162, 235, 0.6)',
    psychopathy: 'rgba(255, 206, 86, 0.6)',
    sadism: 'rgba(75, 192, 192, 0.6)',
    default: 'rgba(153, 102, 255, 0.6)',
  };

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: `${assessmentType} Results`,
        data: Object.values(data),
        backgroundColor: Object.keys(data).map(key => chartColors[key.toLowerCase()] || chartColors.default),
        borderColor: Object.keys(data).map(key => chartColors[key.toLowerCase()] || chartColors.default),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 5
      },
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${assessmentType} Assessment Results`
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2);
            }
            return label;
          }
        }
      }
    }
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      case 'radar':
        return <Radar data={chartData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div className="visualization">
      <div className="chart-container" style={{position: 'relative', height: '60vh', width: '80vw'}}>
        {renderChart()}
      </div>
    </div>
  );
};

export default Visualization;