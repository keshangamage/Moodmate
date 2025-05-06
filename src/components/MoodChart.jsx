import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js'


ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)

const MoodChart = ({ data }) => {
  // ChartJS configuration for mood trends
  const chartData = {
    labels: data.map((entry) => entry.date), 
    datasets: [
      {
        label: 'Mood Trend',
        data: data.map((entry) => entry.moodScore), 
        borderColor: '#4c51bf',
        backgroundColor: 'rgba(76, 81, 191, 0.2)',
        fill: true,
      },
    ],
  }

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Mood Trend</h2>
      <Line data={chartData} />
    </div>
  )
}

export default MoodChart
