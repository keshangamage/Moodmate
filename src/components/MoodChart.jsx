import React, { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler)

const MoodChart = ({ data }) => {
  const [timeRange, setTimeRange] = useState('week') // week, month, all

  const filterData = () => {
    if (timeRange === 'all') return data;
    
    const now = new Date();
    const daysToShow = timeRange === 'week' ? 7 : 30;
    const cutoff = new Date(now.setDate(now.getDate() - daysToShow));
    
    return data.filter(entry => new Date(entry.date) > cutoff);
  }

  const filteredData = filterData();

  const chartData = {
    labels: filteredData.map((entry) => {
      const date = new Date(entry.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: 'Mood Score',
        data: filteredData.map((entry) => entry.moodScore),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#4f46e5',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
      },
      {
        label: 'Stress Level',
        data: filteredData.map((entry) => entry.stressLevel),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#dc2626',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
      }
    ],
  }

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
            return `Date: ${context[0].label}`
          },
          afterBody: (context) => {
            const index = context[0].dataIndex;
            const entry = filteredData[index];
            const lines = [];
            if (entry.sleepHours) lines.push(`Sleep: ${entry.sleepHours} hours`);
            if (entry.activities?.length) lines.push(`Activities: ${entry.activities.join(', ')}`);
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
  }

  // Calculate activity correlations
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

  const activityImpact = calculateActivityImpact();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
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
      </div>

      <div className="relative h-[250px] sm:h-[400px] w-full">
        <Line data={chartData} options={options} className="filter drop-shadow-lg" />
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

      {activityImpact.length > 0 && (
        <div className="mt-6 sm:mt-8 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 sm:mb-4">Activity Impact on Mood</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {activityImpact.map(({ activity, average, count }) => (
              <div key={activity} className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-xl flex items-center space-x-3 sm:space-x-4">
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
  )
}

export default MoodChart
