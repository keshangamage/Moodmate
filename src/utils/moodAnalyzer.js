export const analyzeMood = (data) => {
  const { mood, sleepHours, activities = [], stressLevel = 5 } = data;
  let score = 5;


  if (sleepHours < 6) score -= 1;
  else if (sleepHours >= 8) score += 1;
  

  const moodScores = {
    happy: 2,
    neutral: 0,
    sad: -2,
    anxious: -1,
    angry: -1.5
  };
  score += moodScores[mood] || 0;

  
  const positiveActivities = ['exercise', 'meditation', 'socializing', 'hobby', 'nature'];
  const activityImpact = activities.reduce((impact, activity) => {
    return impact + (positiveActivities.includes(activity) ? 0.5 : 0);
  }, 0);
  score += activityImpact;

  
  score += (5 - stressLevel) * 0.4;

  
  return Math.max(1, Math.min(10, Math.round(score + 5)));
};

export const getInsights = (moodData) => {
  if (!moodData.length) return [];

  const insights = [];
  const recentEntries = moodData.slice(-7);
  
  // Sleep pattern insight
  const avgSleep = recentEntries.reduce((sum, entry) => sum + entry.sleepHours, 0) / recentEntries.length;
  if (avgSleep < 7) {
    insights.push({
      type: 'sleep',
      message: 'Your average sleep is below recommended levels. Consider establishing a regular sleep schedule.',
      priority: 'high'
    });
  }

  // Mood pattern insight
  const moodFrequency = recentEntries.reduce((freq, entry) => {
    freq[entry.mood] = (freq[entry.mood] || 0) + 1;
    return freq;
  }, {});

  const dominantMood = Object.entries(moodFrequency)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (dominantMood[0] === 'sad' || dominantMood[0] === 'anxious') {
    insights.push({
      type: 'mood',
      message: `You've been feeling ${dominantMood[0]} frequently. Consider talking to a mental health professional.`,
      priority: 'high'
    });
  }

  
  const activitiesWithMood = recentEntries.flatMap(entry => 
    (entry.activities || []).map(activity => ({
      activity,
      moodScore: entry.moodScore
    }))
  );

  const activityImpact = activitiesWithMood.reduce((impact, { activity, moodScore }) => {
    if (!impact[activity]) {
      impact[activity] = { total: 0, count: 0 };
    }
    impact[activity].total += moodScore;
    impact[activity].count += 1;
    return impact;
  }, {});

  Object.entries(activityImpact).forEach(([activity, { total, count }]) => {
    const avgScore = total / count;
    if (avgScore > 7) {
      insights.push({
        type: 'activity',
        message: `${activity} seems to improve your mood. Try to do it more often!`,
        priority: 'medium'
      });
    }
  });

  return insights;
};
