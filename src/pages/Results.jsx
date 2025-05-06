import React from 'react'
import { useMood } from '../context/MoodContext'
import MoodChart from '../components/MoodChart'
import TipsCard from '../components/TipsCard'

const Results = () => {
  const { moodData } = useMood()
  const latest = moodData[moodData.length - 1] || {}

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    anxious: '😰',
    angry: '😠',
    neutral: '😐',
  }

  const moodMessages = {
    happy: 'You’re feeling great today! Keep it up!',
    sad: 'It’s okay to feel sad. Take it slow and take care.',
    anxious: 'Try some deep breathing. You’re doing fine!',
    angry: 'Take a moment to relax. Tomorrow’s a new day.',
    neutral: 'Nice and steady — a balanced day.',
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-md w-full mb-6">
        <h2 className="text-2xl font-bold mb-2">Today's Mood</h2>
        <div className="text-6xl mb-2 animated-emoji">{moodEmojis[latest.mood]}</div>
        <p className="text-lg text-gray-700">{moodMessages[latest.mood]}</p>

        {/* Progress Bar for Mood Score */}
        <div className="mt-6 w-full">
          <p className="text-sm font-medium text-gray-600 mb-1">
            Mood Score: {latest.moodScore}/10
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${(latest.moodScore / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mood Chart and Tips */}
      <MoodChart data={moodData} />
      <TipsCard mood={latest.mood} />
    </div>
  )
}

export default Results
