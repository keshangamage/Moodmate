import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const MoodChart = ({ data }) => {
  const [timeRange, setTimeRange] = useState('week'); 
  const [selectedMetric, setSelectedMetric] = useState('all'); 

  const filterData = () => {
    if (timeRange === 'all') return data;

    const now = new Date();
    const daysToShow = timeRange === 'week' ? 7 : 30;
    const cutoff = new Date(now.setDate(now.getDate() - daysToShow));

    return data.filter(entry => new Date(entry.date) > cutoff);
  };

  const calculateStats = (data) => {
    if (!data.length) return null;

    const moodScores = data.map(entry => entry.moodScore);
    const stressScores = data.map(entry => entry.stressLevel);
    const energyScores = data.map(entry => entry.energyLevel);

    return {
      mood: {
        average: (moodScores.reduce((a, b) => a + b, 0) / moodScores.length).toFixed(1),
        highest: Math.max(...moodScores),
        lowest: Math.min(...moodScores),
        trend: moodScores[moodScores.length - 1] - moodScores[0]
      },
      stress: {
        average: (stressScores.reduce((a, b) => a + b, 0) / stressScores.length).toFixed(1),
        highest: Math.max(...stressScores),
        lowest: Math.min(...stressScores),
        trend: stressScores[stressScores.length - 1] - stressScores[0]
      },
      energy: {
        average: (energyScores.reduce((a, b) => a + b, 0) / energyScores.length).toFixed(1),
        highest: Math.max(...energyScores),
        lowest: Math.min(...energyScores),
        trend: energyScores[energyScores.length - 1] - energyScores[0]
      }
    };
  };

  const calculateActivityImpact = () => {
    const impact = {};
    filteredData.forEach(entry => {
      entry.activities?.forEach(activity => {
        if (!impact[activity]) {
          impact[activity] = { total: 0, count: 0 };
        }
        impact[activity].total += entry.moodScore;
        impact[activity].count += 1;
      });
    });

    return Object.entries(impact)
      .map(([activity, stats]) => ({
        activity,
        average: stats.total / stats.count,
        count: stats.count
      }))
      .sort((a, b) => b.average - a.average);
  };

  const calculateWeatherImpact = () => {
    const impact = {};
    filteredData.forEach(entry => {
      if (!entry.weather) return;
      if (!impact[entry.weather]) {
        impact[entry.weather] = { total: 0, count: 0 };
      }
      impact[entry.weather].total += entry.moodScore;
      impact[entry.weather].count += 1;
    });

    return Object.entries(impact)
      .map(([weather, stats]) => ({
        weather,
        average: stats.total / stats.count,
        count: stats.count
      }))
      .sort((a, b) => b.average - a.average);
  };

  const calculateTrendLine = (data, metric) => {
    const n = data.length;
    if (n < 2) return null;

    const xValues = Array.from({ length: n }, (_, i) => i);
    const yValues = data.map(entry => entry[metric]);

    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return xValues.map(x => slope * x + intercept);
  };

  const filteredData = filterData();
  const stats = calculateStats(filteredData);
  const activityImpact = calculateActivityImpact();
  const weatherImpact = calculateWeatherImpact();
  const moodTrendData = calculateTrendLine(filteredData, 'moodScore');
  const stressTrendData = calculateTrendLine(filteredData, 'stressLevel');
  const energyTrendData = calculateTrendLine(filteredData, 'energyLevel');

  const chartData = {
    labels: filteredData.map((entry) => {
      const date = new Date(entry.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Mood Score',
        data: filteredData.map((entry) => entry.moodScore),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: 'rgb(79, 70, 229)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
        hidden: selectedMetric !== 'all' && selectedMetric !== 'mood',
      },
      {
        label: 'Mood Trend',
        data: moodTrendData,
        borderColor: 'rgb(99, 102, 241)',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0,
        hidden: selectedMetric !== 'all' && selectedMetric !== 'mood',
      },
      {
        label: 'Stress Level',
        data: filteredData.map((entry) => entry.stressLevel),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: 'rgb(220, 38, 38)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
        hidden: selectedMetric !== 'all' && selectedMetric !== 'stress',
      },
      {
        label: 'Stress Trend',
        data: stressTrendData,
        borderColor: 'rgb(239, 68, 68)',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0,
        hidden: selectedMetric !== 'all' && selectedMetric !== 'stress',
      },
      {
        label: 'Energy Level',
        data: filteredData.map((entry) => entry.energyLevel),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(245, 158, 11)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: 'rgb(217, 119, 6)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
        hidden: selectedMetric !== 'all' && selectedMetric !== 'energy',
      },
      {
        label: 'Energy Trend',
        data: energyTrendData,
        borderColor: 'rgb(245, 158, 11)',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0,
        hidden: selectedMetric !== 'all' && selectedMetric !== 'energy',
      },
    ].filter(dataset => dataset.data),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 16,
          filter: function(legendItem, data) {
            
            return !legendItem.text.includes('Trend');
          },
          font: {
            size: window.innerWidth < 640 ? 10 : 12
          },
          color: document.body.classList.contains('dark-mode') ? '#fff' : '#1f2937'
        }
      },
      tooltip: {
        backgroundColor: document.body.classList.contains('dark-mode') ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: document.body.classList.contains('dark-mode') ? '#fff' : '#1f2937',
        bodyColor: document.body.classList.contains('dark-mode') ? '#e5e7eb' : '#4b5563',
        borderColor: document.body.classList.contains('dark-mode') ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: window.innerWidth < 640 ? 8 : 12,
        cornerRadius: 8,
        titleFont: {
          size: window.innerWidth < 640 ? 12 : 14,
          weight: 'bold',
        },
        bodyFont: {
          size: window.innerWidth < 640 ? 11 : 13,
        },
        callbacks: {
          title: (context) => {
            return `Date: ${context[0].label}`;
          },
          afterBody: (context) => {
            const index = context[0].dataIndex;
            const entry = filteredData[index];
            const lines = [];
            if (entry.sleepHours) lines.push(`Sleep: ${entry.sleepHours} hours`);
            if (entry.activities?.length) lines.push(`Activities: ${entry.activities.join(', ')}`);
            if (entry.weather) lines.push(`Weather: ${entry.weather}`);
            if (entry.physicalHealth?.length) lines.push(`Health: ${entry.physicalHealth.join(', ')}`);
            if (entry.notes) lines.push(`Notes: ${entry.notes.substring(0, 50)}${entry.notes.length > 50 ? '...' : ''}`);
            return lines;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          color: '#6b7280',
          maxRotation: 45,
          minRotation: 45
        },
      },
      y: {
        beginAtZero: true,
        max: 10,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          stepSize: window.innerWidth < 640 ? 2 : 1,
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          color: '#6b7280',
        },
      },
    },
  };

  const renderStatCard = (title, value, icon, trend = null) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-gray-500 dark:text-gray-400 text-sm">{title}</span>
        {icon}
      </div>
      <div className="mt-2 flex items-baseline">
        <span className="text-xl font-semibold text-gray-900 dark:text-white">{value}</span>
        {trend !== null && (
          <span className={`ml-2 text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700">Mood & Stress Trends</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
              timeRange === 'week'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
              timeRange === 'month'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
              timeRange === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Time
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedMetric('all')}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
              selectedMetric === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Metrics
          </button>
          <button
            onClick={() => setSelectedMetric('mood')}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
              selectedMetric === 'mood'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Mood
          </button>
          <button
            onClick={() => setSelectedMetric('stress')}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
              selectedMetric === 'stress'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Stress
          </button>
          <button
            onClick={() => setSelectedMetric('energy')}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
              selectedMetric === 'energy'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Energy
          </button>
        </div>
      </div>

      <div className="h-[180px] sm:h-[220px] mb-4 relative">
        <Line 
          data={chartData} 
          options={options} 
          className="filter drop-shadow-lg"
          canvas={{
            willReadFrequently: true,
            style: {
              backgroundColor: document.body.classList.contains('dark-mode') ? '#1f2937' : '#ffffff'
            }
          }} 
        />
        {filteredData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90 rounded-lg">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-2">📊</div>
              <p className="text-gray-500 text-sm sm:text-base">No mood data recorded yet</p>
              <p className="text-xs sm:text-sm text-gray-400">Start tracking to see your mood journey</p>
            </div>
          </div>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {renderStatCard('Average Mood', stats.mood.average, '😊', stats.mood.trend)}
          {renderStatCard('Average Stress', stats.stress.average, '😟', -stats.stress.trend)}
          {renderStatCard('Average Energy', stats.energy.average, '⚡', stats.energy.trend)}
        </div>
      )}

      {weatherImpact.length > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
            Weather Impact on Mood
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {weatherImpact.map(({ weather, average, count }) => (
              <div key={weather} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">
                    {weather === 'sunny' ? '☀️' :
                     weather === 'cloudy' ? '☁️' :
                     weather === 'rainy' ? '🌧️' :
                     weather === 'snowy' ? '🌨️' :
                     weather === 'stormy' ? '⛈️' : '🌤️'}
                  </span>
                  <span className="text-sm text-gray-500">{count} days</span>
                </div>
                <div className="space-y-1">
                  <div className="font-medium capitalize">{weather}</div>
                  <div className="text-sm text-gray-500">
                    Average mood: {average.toFixed(1)}/10
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activityImpact.length > 0 && (
        <div className="pt-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Activity Impact on Mood</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activityImpact.map(({ activity, average, count }) => (
              <div key={activity} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl flex items-center space-x-3">
                <div className="text-xl sm:text-2xl">
                  {activity === 'exercise' ? '🏃‍♂️' :
                   activity === 'meditation' ? '🧘‍♂️' :
                   activity === 'socializing' ? '👥' :
                   activity === 'hobby' ? '🎨' :
                   activity === 'nature' ? '🌳' :
                   activity === 'work' ? '💼' :
                   activity === 'study' ? '📚' : '✨'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium capitalize text-sm sm:text-base">{activity}</span>
                    <span className="text-xs sm:text-sm text-gray-500">{count} times</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div
                      className="bg-indigo-500 h-1.5 sm:h-2 rounded-full"
                      style={{ width: `${(average / 10) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">
                    Average mood: {average.toFixed(1)}/10
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodChart;
