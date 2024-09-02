// src/components/Notifications.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`/api/notifications/${userId}`);
        const notificationsData = Array.isArray(response.data) ? response.data : [];
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications([]); // Set to an empty array on error
      }
    };

    fetchNotifications();
  }, [userId]);

  const toggleNotifications = async () => {
    try {
      const response = await axios.post(`/api/notifications/toggle/${userId}`);
      setNotificationsEnabled(response.data.notificationsEnabled);
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
    }
  };

  return (
    <div>
      <h3>Notifications</h3>
      <button onClick={toggleNotifications}>
        {notificationsEnabled ? 'Turn Off Notifications' : 'Turn On Notifications'}
      </button>
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id}>
            {notification.message}
            {notification.read ? '' : ' (New)'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
