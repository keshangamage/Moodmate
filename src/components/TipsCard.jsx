import React from 'react'


const moodTips = {
  happy: {
    tips: [
      'Journal about what made you happy today',
      'Share your positive energy with others',
      'Plan something fun for tomorrow',
    ],
    icon: '🌟',
  },
  sad: {
    tips: [
      'Practice self-compassion and be gentle with yourself',
      'Reach out to a friend or family member',
      'Try a calm, soothing activity you enjoy',
    ],
    icon: '💙',
  },
  anxious: {
    tips: [
      'Try deep breathing exercises: 4 seconds in, 4 seconds out',
      'Ground yourself by naming 5 things you can see',
      'Take a short walk if possible',
    ],
    icon: '🍃',
  },
  angry: {
    tips: [
      'Take a moment to pause before reacting',
      'Express your feelings through writing or art',
      'Try progressive muscle relaxation',
    ],
    icon: '🌊',
  },
  neutral: {
    tips: [
      'Reflect on what you\'re grateful for today',
      'Set a small goal for tomorrow',
      'Try something new to spark joy',
    ],
    icon: '✨',
  },
}

const activitySuggestions = {
  exercise: [
    'Try a new workout routine tomorrow',
    'Schedule your next exercise session',
    'Remember to stretch and stay hydrated',
  ],
  meditation: [
    'Set a regular meditation time',
    'Try guided meditation apps',
    'Create a peaceful meditation space',
  ],
  socializing: [
    'Plan your next social gathering',
    'Stay connected with friends virtually',
    'Join a community group or club',
  ],
  hobby: [
    'Set aside dedicated time for your hobbies',
    'Share your creations with others',
    'Try expanding your skills in this area',
  ],
  nature: [
    'Plan your next outdoor adventure',
    'Start a small garden or care for plants',
    'Find new nature spots to explore',
  ],
}

const weatherTips = {
  sunny: [
    'Take advantage of the sunshine with outdoor activities',
    'Get some natural vitamin D with a short walk',
    'Consider having lunch outside',
  ],
  cloudy: [
    'Indoor activities can be just as energizing',
    'Use this calm weather for a peaceful walk',
    'Practice indoor exercises or stretching',
  ],
  rainy: [
    'Create a cozy indoor environment',
    'Use the rain sounds for meditation',
    'Catch up on indoor hobbies or reading',
  ],
  snowy: [
    'Stay warm and maintain your routine indoors',
    'Try winter sports if conditions permit',
    'Use this time for creative indoor activities',
  ],
  stormy: [
    'Focus on calming indoor activities',
    'Practice relaxation techniques during the storm',
    'Use this time for self-reflection or journaling',
  ],
}

const energyTips = {
  low: [
    'Take short, frequent breaks',
    'Try light stretching exercises',
    'Focus on proper hydration',
    'Consider a power nap (15-20 minutes)',
  ],
  medium: [
    'Maintain your current energy with regular movement',
    'Balance activity with rest periods',
    'Stay consistent with your routine',
  ],
  high: [
    'Channel your energy into productive activities',
    'Try more challenging exercises',
    'Use this boost for tasks requiring focus',
  ],
}

const healthTips = {
  headache: [
    'Take regular screen breaks',
    'Stay hydrated and consider rest',
    'Practice neck and shoulder stretches',
  ],
  fatigue: [
    'Listen to your body and rest when needed',
    'Maintain a consistent sleep schedule',
    'Consider light exercise to boost energy',
  ],
  nausea: [
    'Stay hydrated with small sips of water',
    'Try ginger tea or mint',
    'Rest in a well-ventilated space',
  ],
  pain: [
    'Practice gentle stretching if appropriate',
    'Consider relaxation techniques',
    'Apply hot or cold compress as needed',
  ],
  healthy: [
    'Maintain your healthy habits',
    'Stay active and keep moving',
    'Focus on prevention and self-care',
  ],
}


const TipsCard = ({ mood, activities = [], weather, energyLevel, physicalHealth = [] }) => {
  const getMissingSuggestions = () => {
    const recommended = ['exercise', 'meditation', 'socializing', 'nature']
    return recommended
      .filter(activity => !activities.includes(activity))
      .map(activity => ({
        activity,
        suggestion: `Consider adding ${activity} to improve your mood`,
      }))
  }

  const getEnergyLevel = () => {
    if (energyLevel <= 3) return 'low'
    if (energyLevel <= 7) return 'medium'
    return 'high'
  }

  const currentMood = moodTips[mood] || moodTips.neutral
  const currentWeather = weatherTips[weather] || []
  const currentEnergyTips = energyTips[getEnergyLevel()] || []
  const missingActivities = getMissingSuggestions()

  const getActivityIcon = activity => ({
    exercise: '🏃‍♂️',
    meditation: '🧘‍♂️',
    socializing: '👥',
    hobby: '🎨',
    nature: '🌳',
  }[activity] || '✨')

  const getHealthIcon = condition => ({
    headache: '🤕',
    fatigue: '😴',
    nausea: '🤢',
    pain: '😣',
    healthy: '💪',
  }[condition] || '🏥')

  const getWeatherIcon = weather => ({
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '🌨️',
    stormy: '⛈️',
  }[weather] || '🌤️')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <span className="text-4xl">{currentMood.icon}</span>
        <div>
          <h3 className="text-white text-xl font-semibold">Personalized Tips</h3>
          <p className="text-white/90 text-sm">Based on your current mood and activities</p>
        </div>
      </div>

      {/* Mood Tips */}
      <Section title="Mood Recommendations">
        {currentMood.tips.map((tip, i) => (
          <TipItem key={i} index={i + 1} text={tip} />
        ))}
      </Section>

      {/* Weather Tips */}
      {weather && (
        <Section title="Weather Tips">
          {currentWeather.map((tip, i) => (
            <TipCard key={i} icon={getWeatherIcon(weather)} text={tip} />
          ))}
        </Section>
      )}

      {/* Energy Tips */}
      {energyLevel && (
        <Section title="Energy Management">
          {currentEnergyTips.map((tip, i) => (
            <TipCard key={i} icon="⚡" text={tip} />
          ))}
        </Section>
      )}

      {/* Health Tips */}
      {physicalHealth.length > 0 && (
        <Section title="Health Tips">
          {physicalHealth.flatMap(condition =>
            healthTips[condition]?.map((tip, i) => (
              <TipCard key={`${condition}-${i}`} icon={getHealthIcon(condition)} text={tip} label={condition} />
            ))
          )}
        </Section>
      )}

      {/* Activity Follow-ups */}
      {activities.length > 0 && (
        <Section title="Activity Follow-up">
          {activities.map(activity =>
            activitySuggestions[activity] ? (
              <TipCard
                key={activity}
                icon={getActivityIcon(activity)}
                text={
                  activitySuggestions[activity][Math.floor(Math.random() * activitySuggestions[activity].length)]
                }
                label={activity}
              />
            ) : null
          )}
        </Section>
      )}

      {/* Missing Activity Suggestions */}
      {missingActivities.length > 0 && (
        <Section title="Try These Activities">
          {missingActivities.map(({ activity, suggestion }) => (
            <TipCard key={activity} icon={getActivityIcon(activity)} text={suggestion} />
          ))}
        </Section>
      )}

      
      <div className="border-t border-white/20 pt-6">
        <p className="text-sm text-white/90">
          Remember: Your emotions are valid, and it's okay to feel the way you do. These tips are suggestions to help
          you navigate your current mood. If you're consistently feeling down, consider talking to a mental health
          professional.
        </p>
      </div>
    </div>
  )
}


const Section = ({ title, children }) => (
  <div className="space-y-4 border-t border-white/20 pt-6">
    <h4 className="text-white font-semibold text-lg">{title}</h4>
    <div className="grid gap-3">{children}</div>
  </div>
)

const TipCard = ({ icon, text, label }) => (
  <div className="bg-white/10 p-4 rounded-xl text-white">
    <div className="font-medium mb-2 flex items-center space-x-2">
      <span className="text-2xl">{icon}</span>
      {label && <span className="capitalize">{label}</span>}
    </div>
    <p className="text-white/90">{text}</p>
  </div>
)

const TipItem = ({ index, text }) => (
  <div className="text-white flex items-start space-x-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">{index}</div>
    <p className="flex-1">{text}</p>
  </div>
)

export default TipsCard
