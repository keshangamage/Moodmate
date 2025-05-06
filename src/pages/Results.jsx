import React from 'react'
import { useMood } from '../context/MoodContext'
import MoodChart from '../components/MoodChart'
import TipsCard from '../components/TipsCard'
import { getInsights } from '../utils/moodAnalyzer'

const Results = () => {
  const { moodData } = useMood()
  const latest = moodData[moodData.length - 1] || {}
  const insights = getInsights(moodData)

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    anxious: '😰',
    angry: '😠',
    neutral: '😐',
  }

  const activityEmojis = {
    exercise: '🏃‍♂️',
    meditation: '🧘‍♂️',
    socializing: '👥',
    hobby: '🎨',
    nature: '🌳',
    work: '💼',
    study: '📚',
    rest: '🛋️'
  }

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Today's Mood Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 mb-4 sm:mb-8">
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Today's Check-In</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 space-y-3 sm:space-y-0">
              <div className={`text-5xl sm:text-7xl animated-emoji ${latest.mood ? '' : 'opacity-50'}`}>
                {moodEmojis[latest.mood] || '😴'}
              </div>
              <div className="text-center sm:text-left">
                <div className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-200">Mood Score: {latest.moodScore}/10</div>
                <div className="text-gray-600 dark:text-gray-300">Sleep: {latest.sleepHours} hours</div>
                <div className="text-gray-600 dark:text-gray-300">Stress Level: {latest.stressLevel}/10</div>
              </div>
            </div>

            {latest.activities && latest.activities.length > 0 && (
              <div className="mt-4 sm:mt-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Today's Activities</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {latest.activities.map((activity) => (
                    <div key={activity} className="bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 px-3 sm:px-4 py-1 sm:py-2 rounded-full flex items-center text-sm sm:text-base">
                      <span className="mr-1 sm:mr-2">{activityEmojis[activity]}</span>
                      <span className="capitalize">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 mb-4 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">Your Insights</h2>
            <div className="grid gap-3 sm:gap-4">
              {insights.map((insight, index) => (
                <div 
                  key={index}
                  className={`p-3 sm:p-4 rounded-xl text-sm sm:text-base ${
                    insight.priority === 'high' 
                      ? 'bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-800'
                      : 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800'
                  }`}
                >
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="flex-shrink-0">
                      {insight.type === 'sleep' && '😴'}
                      {insight.type === 'mood' && '🎭'}
                      {insight.type === 'activity' && '⭐'}
                    </div>
                    <p>{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mood Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">Your Mood Journey</h2>
          <div className="space-y-6">
            <div className="h-[300px] sm:h-[400px]">
              <MoodChart data={moodData} />
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden mt-60 mb-8 sm:mb-12">
          <div className="p-6 sm:p-8">
            <TipsCard mood={latest.mood} activities={latest.activities} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results
