import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { saveUserPreferences, getUserPreferences } from '../firebase/userPreferences';
import { Notifications } from 'react-push-notification';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    enabled: false,
    checkInTime: '20:00',
    frequency: 'daily',
    weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    customDays: [],
  });

  useEffect(() => {
    if (user) {
      loadUserPreferences();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    try {
      const userPrefs = await getUserPreferences(user.uid);
      if (userPrefs) {
        setPreferences(userPrefs);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  useEffect(() => {
    if (!preferences.enabled || !user) return;

    const checkAndSendNotification = () => {
      const now = new Date();
      const [hours, minutes] = preferences.checkInTime.split(':');
      const scheduleTime = new Date();
      scheduleTime.setHours(parseInt(hours), parseInt(minutes), 0);

      const shouldNotify = () => {
        if (preferences.frequency === 'daily') return true;
        if (preferences.frequency === 'weekdays') {
          const day = now.toLocaleDateString('en-US', { weekday: 'long' });
          return preferences.weekdays.includes(day);
        }
        if (preferences.frequency === 'custom') {
          const today = now.toLocaleDateString();
          return preferences.customDays.includes(today);
        }
        return false;
      };

      if (Math.abs(now - scheduleTime) < 60000 && shouldNotify()) {
        new Notification('MoodMate Check-in Reminder', {
          body: "How are you feeling today? Don't forget to log your mood and activities.",
          icon: '/favicon.ico',
        });
      }
    };

    const interval = setInterval(checkAndSendNotification, 60000);
    return () => clearInterval(interval);
  }, [preferences, user]);

  const updatePreferences = async (newPrefs) => {
    try {
      const updatedPreferences = { ...preferences, ...newPrefs };
      setPreferences(updatedPreferences);
      if (user) {
        await saveUserPreferences(user.uid, updatedPreferences);
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await updatePreferences({ enabled: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  return (
    <NotificationsContext.Provider 
      value={{ 
        preferences, 
        updatePreferences,
        requestNotificationPermission 
      }}
    >
      <Notifications />
      {children}
    </NotificationsContext.Provider>
  );
};