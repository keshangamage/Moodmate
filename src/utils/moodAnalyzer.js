export const analyzeMood = (mood, sleepHours) => {
  
  if (sleepHours < 6) {
    if (mood === 'happy') return 8
    if (mood === 'sad') return 3
  } else {
    if (mood === 'happy') return 9
    if (mood === 'sad') return 5
  }
  return 5
}
