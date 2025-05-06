import React from 'react'

const TipsCard = ({ mood, activities = [] }) => {
  const moodTips = {
    happy: {
      tips: [
        'Journal about what made you happy today',
        'Share your positive energy with others',
        'Plan something fun for tomorrow',
      ],
      icon: '🌟'
    },
    sad: {
      tips: [
        'Practice self-compassion and be gentle with yourself',
        'Reach out to a friend or family member',
        'Try a calm, soothing activity you enjoy',
      ],
      icon: '💙'
    },
    anxious: {
      tips: [
        'Try deep breathing exercises: 4 seconds in, 4 seconds out',
        'Ground yourself by naming 5 things you can see',
        'Take a short walk if possible',
      ],
      icon: '🍃'
    },
    angry: {
      tips: [
        'Take a moment to pause before reacting',
        'Express your feelings through writing or art',
        'Try progressive muscle relaxation',
      ],
      icon: '🌊'
    },
    neutral: {
      tips: [
        'Reflect on what you\'re grateful for today',
        'Set a small goal for tomorrow',
        'Try something new to spark joy',
      ],
      icon: '✨'
    }
  }

  const activitySuggestions = {
    exercise: [
      'Try a new workout routine tomorrow',
      'Schedule your next exercise session',
      'Remember to stretch and stay hydrated'
    ],
    meditation: [
      'Set a regular meditation time',
      'Try guided meditation apps',
      'Create a peaceful meditation space'
    ],
    socializing: [
      'Plan your next social gathering',
      'Stay connected with friends virtually',
      'Join a community group or club'
    ],
    hobby: [
      'Set aside dedicated time for your hobbies',
      'Share your creations with others',
      'Try expanding your skills in this area'
    ],
    nature: [
      'Plan your next outdoor adventure',
      'Start a small garden or care for plants',
      'Find new nature spots to explore'
    ]
  }

  const getMissingSuggestions = () => {
    const recommendedActivities = ['exercise', 'meditation', 'socializing', 'nature'];
    const missing = recommendedActivities.filter(act => !activities.includes(act));
    return missing.map(activity => ({
      activity,
      suggestion: `Consider adding ${activity} to improve your mood`
    }));
  }

  const currentMood = moodTips[mood] || moodTips.neutral;
  const missingActivities = getMissingSuggestions();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <span className="text-4xl">{currentMood.icon}</span>
        <div>
          <h3 className="text-xl font-semibold">Personalized Tips</h3>
          <p className="text-white/90 text-sm">Based on your current mood and activities</p>
        </div>
      </div>
      
      {/* Mood-based tips */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Mood Recommendations</h4>
        <div className="grid gap-3">
          {currentMood.tips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                {index + 1}
              </div>
              <p className="flex-1">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity-based suggestions */}
      {activities.length > 0 && (
        <div className="space-y-4 border-t border-white/20 pt-6">
          <h4 className="font-semibold text-lg">Activity Follow-up</h4>
          <div className="grid gap-3">
            {activities.map(activity => 
              activitySuggestions[activity] && (
                <div key={activity} className="bg-white/10 p-4 rounded-xl">
                  <div className="font-medium mb-2 flex items-center">
                    <span className="text-2xl mr-2">{
                      activity === 'exercise' ? '🏃‍♂️' :
                      activity === 'meditation' ? '🧘‍♂️' :
                      activity === 'socializing' ? '👥' :
                      activity === 'hobby' ? '🎨' :
                      activity === 'nature' ? '🌳' : '✨'
                    }</span>
                    <span className="capitalize">{activity}</span>
                  </div>
                  <p className="text-white/90">
                    {activitySuggestions[activity][Math.floor(Math.random() * activitySuggestions[activity].length)]}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Suggestions for missing beneficial activities */}
      {missingActivities.length > 0 && (
        <div className="space-y-4 border-t border-white/20 pt-6">
          <h4 className="font-semibold text-lg">Try These Activities</h4>
          <div className="grid gap-3">
            {missingActivities.map(({ activity, suggestion }) => (
              <div key={activity} className="bg-white/10 p-4 rounded-xl flex items-center space-x-3">
                <span className="text-2xl">{
                  activity === 'exercise' ? '🏃‍♂️' :
                  activity === 'meditation' ? '🧘‍♂️' :
                  activity === 'socializing' ? '👥' :
                  activity === 'nature' ? '🌳' : '✨'
                }</span>
                <p className="flex-1">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-white/20 pt-6">
        <p className="text-sm text-white/90">
          Remember: Your emotions are valid, and it's okay to feel the way you do. 
          These tips are suggestions to help you navigate your current mood.
          If you're consistently feeling down, consider talking to a mental health professional.
        </p>
      </div>
    </div>
  )
}

export default TipsCard
