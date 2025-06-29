import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useCalendly() {
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.calendly.com/event_types/${process.env.REACT_APP_EVENT_TYPE_URI}/availability`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_CALENDLY_TOKEN}`,
          },
          params: {
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
        }
      );
      
      // Process dates
      const dates = [...new Set(
        response.data.collection.map(slot => 
          slot.start_time.split('T')[0]
        )
      )];
      
      setAvailableDates(dates);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching availability:", error);
      setLoading(false);
    }
  };

  const fetchTimesForDate = async (date) => {
    try {
      const response = await axios.get(
        `https://api.calendly.com/event_types/${process.env.REACT_APP_EVENT_TYPE_URI}/availability`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_CALENDLY_TOKEN}`,
          },
          params: {
            start_time: `${date}T00:00:00.000Z`,
            end_time: `${date}T23:59:59.999Z`,
          },
        }
      );
      
      setAvailableTimes(
        response.data.collection.map(slot => 
          slot.start_time.split('T')[1].substring(0, 5)
        )
      );
    } catch (error) {
      console.error("Error fetching times:", error);
    }
  };

  const submitBooking = async (data) => {
    try {
      await axios.post(
        'https://api.calendly.com/scheduled_events',
        {
          event_type: process.env.REACT_APP_EVENT_TYPE_URI,
          invitee: {
            email: data.email,
            name: data.name,
          },
          start_time: `${data.date}T${data.time}:00.000Z`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_CALENDLY_TOKEN}`,
          },
        }
      );
      return true;
    } catch (error) {
      console.error("Booking failed:", error);
      return false;
    }
  };

  return { availableDates, availableTimes, loading, fetchAvailability, fetchTimesForDate, submitBooking };
}