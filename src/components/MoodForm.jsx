import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMood } from '../context/MoodContext'
import { analyzeMood } from '../utils/moodAnalyzer'
import { addMoodEntryToDB } from '../firebase'


const MoodForm = () => {
  const [mood, setMood] = useState('happy')
  const [sleepHours, setSleepHours] = useState(8)

  const { addEntry } = useMood()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    const moodScore = analyzeMood(mood, sleepHours)

    const entry = {
      date: new Date().toISOString().split('T')[0],
      mood,
      sleepHours,
      moodScore,
    }

    addEntry(entry);
    addMoodEntryToDB(entry)
      .then(() => console.log('Entry saved to Firebase'))
      .catch((err) => console.error('Firebase error:', err));

    navigate('/results');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-2xl shadow-lg max-w-md w-full mx-auto mt-10"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Daily Mood Check-In</h2>

      <label className="block mb-2 font-medium text-gray-700">How are you feeling?</label>
      <select
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="happy">😊 Happy</option>
        <option value="sad">😢 Sad</option>
        <option value="anxious">😰 Anxious</option>
        <option value="angry">😠 Angry</option>
        <option value="neutral">😐 Neutral</option>
      </select>

      <label className="block mb-2 font-medium text-gray-700">Hours of Sleep Last Night</label>
      <input
        type="number"
        min="0"
        max="24"
        value={sleepHours}
        onChange={(e) => setSleepHours(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  )
}

export default MoodForm
