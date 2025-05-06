import { createContext, useContext, useState } from 'react'

const MoodContext = createContext()

export const useMood = () => useContext(MoodContext)

export const MoodProvider = ({ children }) => {
  const [moodData, setMoodData] = useState(() => {
    const stored = localStorage.getItem('moodData')
    return stored ? JSON.parse(stored) : []
  })

  const addEntry = (entry) => {
    const updated = [...moodData, entry]
    setMoodData(updated)
    localStorage.setItem('moodData', JSON.stringify(updated))
  }

  return (
    <MoodContext.Provider value={{ moodData, addEntry }}>
      {children}
    </MoodContext.Provider>
  )
}
