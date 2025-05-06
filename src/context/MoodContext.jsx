import { createContext, useContext, useState, useEffect } from 'react'
import { db, auth } from '../firebase'
import { ref, onValue, query, orderByKey } from 'firebase/database'

const MoodContext = createContext()

export const useMood = () => useContext(MoodContext)

export const MoodProvider = ({ children }) => {
  const [moodData, setMoodData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const moodRef = ref(db, `moods/${user.uid}`)
        const moodQuery = query(moodRef, orderByKey())
        
        onValue(moodQuery, (snapshot) => {
          const data = snapshot.val()
          if (data) {
            const moodList = Object.values(data).sort((a, b) => 
              new Date(a.date) - new Date(b.date)
            )
            setMoodData(moodList)
          } else {
            setMoodData([])
          }
          setLoading(false)
        })
      } else {
        setMoodData([])
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const addEntry = (entry) => {
    if (!auth.currentUser) return
    setMoodData(prev => [...prev, entry])
  }

  return (
    <MoodContext.Provider value={{ moodData, loading, addEntry }}>
      {children}
    </MoodContext.Provider>
  )
}
