export const analyzeMood = (data) => {
  const { 
    mood, 
    sleepHours, 
    activities = [], 
    stressLevel = 5,
    energyLevel = 5,
    weather,
    physicalHealth = []
  } = data;
  
  let score = 5;

  // Sleep impact
  if (sleepHours < 6) score -= 1;
  else if (sleepHours >= 8) score += 1;
  
  // Mood impact
  const moodScores = {
    happy: 2,
    neutral: 0,
    sad: -2,
    anxious: -1,
    angry: -1.5
  };
  score += moodScores[mood] || 0;

  // Activities impact
  const positiveActivities = ['exercise', 'meditation', 'socializing', 'hobby', 'nature'];
  const activityImpact = activities.reduce((impact, activity) => {
    return impact + (positiveActivities.includes(activity) ? 0.5 : 0);
  }, 0);
  score += activityImpact;

  // Stress impact
  score += (5 - stressLevel) * 0.4;

  // Energy level impact
  score += (energyLevel - 5) * 0.3;

  // Weather impact
  const weatherScores = {
    sunny: 0.5,
    cloudy: 0,
    rainy: -0.2,
    snowy: 0.3,
    stormy: -0.4
  };
  score += weatherScores[weather] || 0;

  // Physical health impact
  const healthImpact = physicalHealth.reduce((impact, condition) => {
    if (condition === 'healthy') return impact + 0.5;
    return impact - 0.3;
  }, 0);
  score += healthImpact;

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

  // Energy level insight
  const avgEnergy = recentEntries.reduce((sum, entry) => sum + entry.energyLevel, 0) / recentEntries.length;
  if (avgEnergy < 4) {
    insights.push({
      type: 'energy',
      message: 'Your energy levels have been low. Try to get more rest and consider light exercise.',
      priority: 'medium'
    });
  }

  // Weather-mood correlation
  const weatherMood = recentEntries.reduce((acc, entry) => {
    if (!acc[entry.weather]) {
      acc[entry.weather] = { total: 0, count: 0 };
    }
    acc[entry.weather].total += entry.moodScore;
    acc[entry.weather].count += 1;
    return acc;
  }, {});

  Object.entries(weatherMood).forEach(([weather, { total, count }]) => {
    const avgMood = total / count;
    if (avgMood < 5 && count >= 3) {
      insights.push({
        type: 'weather',
        message: `Your mood tends to be lower during ${weather} weather. Plan indoor activities for these days.`,
        priority: 'low'
      });
    }
  });

  // Physical health patterns
  const healthIssues = recentEntries.reduce((acc, entry) => {
    entry.physicalHealth.forEach(issue => {
      acc[issue] = (acc[issue] || 0) + 1;
    });
    return acc;
  }, {});

  Object.entries(healthIssues).forEach(([issue, count]) => {
    if (count >= 3 && issue !== 'healthy') {
      insights.push({
        type: 'health',
        message: `You've reported ${issue} frequently. Consider consulting a healthcare provider.`,
        priority: 'high'
      });
    }
  });

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

  // Activity correlations
  const activitiesWithMood = recentEntries.flatMap(entry => 
    (entry.activities || []).map(activity => ({
      activity,
      moodScore: entry.moodScore,
      energyLevel: entry.energyLevel
    }))
  );

  const activityImpact = activitiesWithMood.reduce((impact, { activity, moodScore, energyLevel }) => {
    if (!impact[activity]) {
      impact[activity] = { moodTotal: 0, energyTotal: 0, count: 0 };
    }
    impact[activity].moodTotal += moodScore;
    impact[activity].energyTotal += energyLevel;
    impact[activity].count += 1;
    return impact;
  }, {});

  Object.entries(activityImpact).forEach(([activity, { moodTotal, energyTotal, count }]) => {
    const avgMood = moodTotal / count;
    const avgEnergy = energyTotal / count;
    if (avgMood > 7 && avgEnergy > 6) {
      insights.push({
        type: 'activity',
        message: `${activity} seems to improve both your mood and energy levels. Try to do it more often!`,
        priority: 'medium'
      });
    }
  });

  return insights;
};
