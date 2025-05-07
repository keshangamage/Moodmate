import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMood } from '../context/MoodContext'
import { analyzeMood } from '../utils/moodAnalyzer'
import { addMoodEntryToDB } from '../firebase'

const ACTIVITIES = [
  { id: 'exercise', label: 'Exercise', icon: '🏃‍♂️' },
  { id: 'meditation', label: 'Meditation', icon: '🧘‍♂️' },
  { id: 'socializing', label: 'Socializing', icon: '👥' },
  { id: 'hobby', label: 'Hobby', icon: '🎨' },
  { id: 'nature', label: 'Nature', icon: '🌳' },
  { id: 'work', label: 'Work', icon: '💼' },
  { id: 'study', label: 'Study', icon: '📚' },
  { id: 'rest', label: 'Rest', icon: '🛋️' }
];

const WEATHER_OPTIONS = [
  { value: 'sunny', emoji: '☀️', label: 'Sunny' },
  { value: 'cloudy', emoji: '☁️', label: 'Cloudy' },
  { value: 'rainy', emoji: '🌧️', label: 'Rainy' },
  { value: 'snowy', emoji: '🌨️', label: 'Snowy' },
  { value: 'stormy', emoji: '⛈️', label: 'Stormy' }
];

const PHYSICAL_SYMPTOMS = [
  { id: 'headache', label: 'Headache', icon: '🤕' },
  { id: 'fatigue', label: 'Fatigue', icon: '😴' },
  { id: 'nausea', label: 'Nausea', icon: '🤢' },
  { id: 'pain', label: 'Pain', icon: '😣' },
  { id: 'healthy', label: 'Healthy', icon: '💪' }
];

const MoodForm = () => {
  const [mood, setMood] = useState('happy')
  const [sleepHours, setSleepHours] = useState(8)
  const [activities, setActivities] = useState([])
  const [stressLevel, setStressLevel] = useState(5)
  const [energyLevel, setEnergyLevel] = useState(5)
  const [notes, setNotes] = useState('')
  const [weather, setWeather] = useState('sunny')
  const [physicalHealth, setPhysicalHealth] = useState([])

  const { addEntry } = useMood()
  const navigate = useNavigate()

  const handleActivityToggle = (activityId) => {
    setActivities(prev => 
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const entry = {
      date: new Date().toISOString().split('T')[0],
      mood,
      sleepHours,
      activities,
      stressLevel,
      energyLevel,
      notes,
      weather,
      physicalHealth,
    }
    entry.moodScore = analyzeMood(entry)
    addEntry(entry)
    addMoodEntryToDB(entry)
      .then(() => console.log('Entry saved to Firebase'))
      .catch((err) => console.error('Firebase error:', err))
    navigate('/results')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 sm:p-9 bg-white dark:bg-gray-800 rounded-3xl shadow-xl w-full max-w-md mx-auto mt-4 sm:mt-5 transform transition-all duration-300 hover:shadow-2xl"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent dark:from-indigo-400 dark:to-indigo-200">
        How are you feeling today?
      </h2>

      {/* Mood Selection */}
      <div className="mb-6 sm:mb-8">
        <label className="block mb-3 font-medium text-gray-700 dark:text-gray-200 text-base sm:text-lg">Select your mood</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
          {[
            { value: 'happy', emoji: '😊', label: 'Happy' },
            { value: 'sad', emoji: '😢', label: 'Sad' },
            { value: 'anxious', emoji: '😰', label: 'Anxious' },
            { value: 'angry', emoji: '😠', label: 'Angry' },
            { value: 'neutral', emoji: '😐', label: 'Neutral' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMood(option.value)}
              className={`p-2 sm:p-3 rounded-xl transition-all ${
                mood === option.value
                  ? 'bg-indigo-100 dark:bg-indigo-900 ring-2 ring-indigo-500'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="text-xl sm:text-2xl mb-1">{option.emoji}</div>
              <div className="text-[10px] sm:text-xs dark:text-gray-300">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sleep Hours */}
      <div className="mb-6 sm:mb-8">
        <label className="block mb-3 font-medium text-gray-700 dark:text-gray-200 text-base sm:text-lg">
          Hours of Sleep Last Night
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            max="24"
            value={sleepHours}
            onChange={(e) => setSleepHours(Number(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Enter hours..."
          />
          <div className="absolute right-3 top-3 text-gray-400 dark:text-gray-500">hrs</div>
        </div>
      </div>

      {/* Activities */}
      <div className="mb-6 sm:mb-8">
        <label className="block mb-3 font-medium text-gray-700 dark:text-gray-200 text-base sm:text-lg">
          What activities did you do today?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ACTIVITIES.map((activity) => (
            <button
              key={activity.id}
              type="button"
              onClick={() => handleActivityToggle(activity.id)}
              className={`p-2 sm:p-3 rounded-xl transition-all ${
                activities.includes(activity.id)
                  ? 'bg-indigo-100 dark:bg-indigo-900 ring-2 ring-indigo-500'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="text-xl sm:text-2xl mb-1">{activity.icon}</div>
              <div className="text-[10px] sm:text-xs dark:text-gray-300">{activity.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Stress Level */}
      <div className="mb-6 sm:mb-8">
        <label className="block mb-3 font-medium text-gray-700 dark:text-gray-200 text-base sm:text-lg">
          Stress Level
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={stressLevel}
          onChange={(e) => setStressLevel(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
          <span>Low Stress</span>
          <span>High Stress</span>
        </div>
      </div>

      {/* Energy Level */}
      <div className="mb-6 sm:mb-8">
        <label className="block mb-3 font-medium text-gray-700 dark:text-gray-200 text-base sm:text-lg">
          Energy Level
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={energyLevel}
          onChange={(e) => setEnergyLevel(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
          <span>Low Energy</span>
          <span>High Energy</span>
        </div>
      </div>

      {/* Weather */}
      <div className="mb-6 sm:mb-8">
        <label className="block mb-3 font-medium text-gray-700 dark:text-gray-200 text-base sm:text-lg">
          Weather Today
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {WEATHER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setWeather(option.value)}
              className={`p-2 sm:p-3 rounded-xl transition-all ${
                weather === option.value
                  ? 'bg-indigo-100 dark:bg-indigo-900 ring-2 ring-indigo-500'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="text-xl sm:text-2xl mb-1">{option.emoji}</div>
              <div className="text-[10px] sm:text-xs dark:text-gray-300">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Physical Health */}
      <div className="mb-6 sm:mb-8">
        <label className="block mb-3 font-medium text-gray-700 dark:text-gray-200 text-base sm:text-lg">
          Physical Health
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {PHYSICAL_SYMPTOMS.map((symptom) => (
            <button
              key={symptom.id}
              type="button"
              onClick={() => setPhysicalHealth(prev =>
                prev.includes(symptom.id)
                  ? prev.filter(id => id !== symptom.id)
                  : [...prev, symptom.id]
              )}
              className={`p-2 sm:p-3 rounded-xl transition-all ${
                physicalHealth.includes(symptom.id)
                  ? 'bg-indigo-100 dark:bg-indigo-900 ring-2 ring-indigo-500'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="text-xl sm:text-2xl mb-1">{symptom.icon}</div>
              <div className="text-[10px] sm:text-xs dark:text-gray-300">{symptom.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Notes*/}
      <div className="mb-6 sm:mb-8">
        <label className="block mb-3 font-medium text-gray-700 dark:text-gray-200 text-base sm:text-lg">
          Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Add any thoughts or reflections..."
          rows="3"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3 sm:py-4 px-6 rounded-xl text-base sm:text-lg font-semibold hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transform transition-all duration-300"
      >
        Submit Check-In
      </button>
    </form>
  )
}

export default MoodForm
