import React, { useRef, useState } from 'react';
import { useMood } from '../context/MoodContext';
import { useNotifications } from '../context/NotificationsContext';
import MoodChart from '../components/MoodChart';
import HeatmapCalendar from '../components/HeatmapCalendar';
import TipsCard from '../components/TipsCard';
import { getInsights, getAdvancedInsights } from '../utils/moodAnalyzer';


const Results = () => {
  const { moodData } = useMood();
  const { preferences, updatePreferences, requestNotificationPermission } = useNotifications();
  const latest = moodData[moodData.length - 1] || {};
  const insights = getInsights(moodData);
  const advancedInsights = getAdvancedInsights(moodData);

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    anxious: '😰',
    angry: '😠',
    neutral: '😐',
  };

  const activityEmojis = {
    exercise: '🏃‍♂️',
    meditation: '🧘‍♂️',
    socializing: '👥',
    hobby: '🎨',
    nature: '🌳',
    work: '💼',
    study: '📚',
    rest: '🛋️',
  };

  const weatherEmojis = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '🌨️',
    stormy: '⛈️',
  };

  const healthEmojis = {
    headache: '🤕',
    fatigue: '😴',
    nausea: '🤢',
    pain: '😣',
    healthy: '💪',
  };

  const [isSharing, setIsSharing] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const chartRef = useRef(null);

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      await shareViaEmail(recipientEmail, moodData, chartRef);
      setIsSharing(false);
      setRecipientEmail('');
      alert('Report shared successfully!');
    } catch (error) {
      console.error('Error sharing report:', error);
      alert('Failed to share report. Please try again.');
    }
  };

  const handleDownload = async () => {
    try {
      await downloadReport(moodData, chartRef);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again.');
    }
  };

  const handleNotificationToggle = async () => {
    if (!preferences.enabled) {
      const permissionGranted = await requestNotificationPermission();
      if (!permissionGranted) {
        alert('Notification permission is required to enable reminders');
        return;
      }
    }
    await updatePreferences({ enabled: !preferences.enabled });
  };

  const handleUpdateFrequency = async (frequency) => {
    await updatePreferences({ frequency });
  };

  const handleUpdateCheckInTime = async (time) => {
    await updatePreferences({ checkInTime: time });
  };

  const handleUpdateWeekdays = async (weekday, checked) => {
    const newWeekdays = checked 
      ? [...preferences.weekdays, weekday]
      : preferences.weekdays.filter(day => day !== weekday);
    await updatePreferences({ weekdays: newWeekdays });
  };

  return (
    <div className="mt-3 min-h-screen p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Today's Mood Card */}
        <div className="bg-bluegray rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 mb-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-200 ">Today's Check-In</h2>

            <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-6 space-y-4 sm:space-y-0">
              <div className={`text-6xl sm:text-7xl animated-emoji ${latest.mood ? '' : 'opacity-50'}`}>
                {moodEmojis[latest.mood] || '😴'}
              </div>
              <div className="text-center sm:text-left space-y-2">
                <div className="text-xl sm:text-2xl font-semibold text-gray-300 ">
                  Mood Score: {latest.moodScore}/10
                </div>
                <div className="text-base sm:text-lg text-gray-300 flex items-center justify-center sm:justify-start">
                  <span className="mr-2">⚡</span>
                  Energy: {latest.energyLevel}/10
                </div>
                <div className="text-base sm:text-lg text-gray-300 flex items-center justify-center sm:justify-start">
                  <span className="mr-2">😴</span>
                  Sleep: {latest.sleepHours} hours
                </div>
                <div className="text-base sm:text-lg text-gray-300 flex items-center justify-center sm:justify-start">
                  <span className="mr-2">📊</span>
                  Stress: {latest.stressLevel}/10
                </div>
              </div>
            </div>

            {/* Weather */}
            {latest.weather && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-200">Weather</h3>
                <div className="inline-flex items-center bg-indigo-900/50 px-4 py-2 rounded-full text-indigo-200">
                  <span className="text-2xl mr-2">{weatherEmojis[latest.weather]}</span>
                  <span className="capitalize">{latest.weather}</span>
                </div>
              </div>
            )}

            {/* Physical Health */}
            {latest.physicalHealth && latest.physicalHealth.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-200">Physical Health</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {latest.physicalHealth.map((health) => (
                    <div
                      key={health}
                      className="bg-indigo-900/50 text-indigo-200 px-3 py-2 rounded-full flex items-center"
                    >
                      <span className="text-xl mr-2">{healthEmojis[health]}</span>
                      <span className="capitalize">{health}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activities */}
            {latest.activities && latest.activities.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-200">Today's Activities</h3>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {latest.activities.map((activity) => (
                    <div
                      key={activity}
                      className="bg-indigo-900/50 text-indigo-200 
                        px-3 sm:px-4 py-2 rounded-full flex items-center text-sm sm:text-base"
                    >
                      <span className="mr-2">{activityEmojis[activity]}</span>
                      <span className="capitalize">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {latest.notes && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-200">Notes</h3>
                <div className="bg-indigo-900/50 p-4 rounded-xl text-gray-200">
                  {latest.notes}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="bg-bluegray rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Your Insights</h2>
            <div className="grid gap-3 sm:gap-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl text-sm sm:text-base transition-all
                    ${insight.priority === 'high' 
                      ? 'bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-800'
                      : insight.priority === 'medium'
                      ? 'bg-yellow-50 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800'
                      : 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800'
                    }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 text-xl sm:text-2xl">
                      {insight.type === 'sleep' && '😴'}
                      {insight.type === 'mood' && '🎭'}
                      {insight.type === 'activity' && '⭐'}
                      {insight.type === 'energy' && '⚡'}
                      {insight.type === 'weather' && '🌤️'}
                      {insight.type === 'health' && '🏥'}
                    </div>
                    <p className="flex-1 pt-1">{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <button
            onClick={() => setShowNotificationSettings(!showNotificationSettings)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-all"
          >
            Notification Settings
          </button>
         
        </div>

        {/* Notification Settings Modal */}
        {showNotificationSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Enable Notifications</span>
                  <input
                    type="checkbox"
                    checked={preferences.enabled}
                    onChange={handleNotificationToggle}
                    className="w-4 h-4"
                  />
                </div>
                <div>
                  <label className="block mb-2">Check-in Time</label>
                  <input
                    type="time"
                    value={preferences.checkInTime}
                    onChange={(e) => handleUpdateCheckInTime(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">Frequency</label>
                  <select
                    value={preferences.frequency}
                    onChange={(e) => handleUpdateFrequency(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays Only</option>
                    <option value="custom">Custom Days</option>
                  </select>
                </div>
                {preferences.frequency === 'weekdays' && (
                  <div className="space-y-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <div key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          id={day}
                          checked={preferences.weekdays.includes(day)}
                          onChange={(e) => handleUpdateWeekdays(day, e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor={day}>{day}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowNotificationSettings(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}



        {/* Mood Chart*/}
        <div 
          ref={chartRef}
          className="bg-bluegray rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 mb-6"
          style={{
            
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Your Mood Journey</h2>
          <MoodChart data={moodData} />
        </div>

        {/* Heatmap Calendar */}

        <div className="bg-bluegray rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Mood Heatmap</h2>
          <HeatmapCalendar data={moodData} />
        </div>
        

        {/* Advanced Insights */}
        <div className="bg-bluegray rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Advanced Insights</h2>
          <div className="grid gap-4">
            {advancedInsights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl ${
                  insight.category === 'health'
                    ? 'bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200'
                    : insight.category === 'pattern'
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200'
                    : 'bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 text-xl sm:text-2xl">
                    {insight.category === 'health' && '🏥'}
                    {insight.category === 'pattern' && '📊'}
                    {insight.category === 'suggestion' && '💡'}
                  </div>
                  <p className="flex-1">{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600" style={{ background: 'linear-gradient(to right, rgb(99, 102, 241), rgb(147, 51, 234))' }}>
          <div className="p-4 sm:p-8 ">
            <TipsCard
              mood={latest.mood}
              activities={latest.activities}
              weather={latest.weather}
              energyLevel={latest.energyLevel}
              physicalHealth={latest.physicalHealth}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
