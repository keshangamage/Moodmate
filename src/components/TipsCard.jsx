import React from 'react'

const TipsCard = ({ mood }) => {
  const tips = {
    happy: 'Keep up the great work! Stay positive and enjoy your day.',
    sad: 'It’s okay to feel sad sometimes. Reach out to a friend or take a walk.',
    anxious: 'Try deep breathing exercises. Relax, you’ve got this.',
    angry: 'Take a break. Try some light exercise to release the tension.',
    neutral: 'Stay balanced. Take things one step at a time.',
  }

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Self-Care Tips</h2>
      <p>{tips[mood]}</p>
    </div>
  )
}

export default TipsCard
