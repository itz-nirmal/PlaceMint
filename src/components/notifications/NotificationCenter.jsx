import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Chip,
  Button,
  Paper,
  Stack,
  Divider,
  AppBar,
  Toolbar,
  Avatar
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MarkEmailRead,
  Delete,
  Clear,
  Work,
  Quiz,
  Announcement,
  LocalOffer
} from '@mui/icons-material';
import { mockStore } from '../../data/placementMockData';
import { NotificationType } from '../../data/enums';
import { formatDateTime } from '../../utils/formatters';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const allNotifications = [
        ...mockStore.notifications,
        ...generateMoreNotifications()
      ];
      setNotifications(allNotifications);
      setLoading(false);
    }, 500);
  }, []);

  const generateMoreNotifications = () => {
    return [
      {
        id: "notif_003",
        type: NotificationType.DEADLINE,
        message: "Application deadline for Microsoft Software Engineer position is tomorrow",
        isRead: false,
        createdAt: "2024-01-14T16:00:00Z"
      },
      {
        id: "notif_004",
        type: NotificationType.ANNOUNCEMENT,
        message: "New placement drive by Google scheduled for next week. Register now!",
        isRead: true,
        createdAt: "2024-01-13T10:00:00Z"
      },
      {
        id: "notif_005",
        type: NotificationType.OFFER_RECEIVED,
        message: "Congratulations! You have received an offer from Amazon for SDE role",
        isRead: false,
        createdAt: "2024-01-12T14:30:00Z"
      },
      {
        id: "notif_006",
        type: NotificationType.TEST_REMINDER,
        message: "Coding test for Wipro starts in 1 hour. Good luck!",
        isRead: true,
        createdAt: "2024-01-11T09:00:00Z"
      }
    ];
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case NotificationType.APPLICATION_STATUS:
        return <Work color="primary" />;
      case NotificationType.TEST_REMINDER:
        return <Quiz color="warning" />;
      case NotificationType.DEADLINE:
        return <NotificationsIcon color="error" />;
      case NotificationType.ANNOUNCEMENT:
        return <Announcement color="info" />;
      case NotificationType.OFFER_RECEIVED:
        return <LocalOffer color="success" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case NotificationType.APPLICATION_STATUS:
        return 'primary';
      case NotificationType.TEST_REMINDER:
        return 'warning';
      case NotificationType.DEADLINE:
        return 'error';
      case NotificationType.ANNOUNCEMENT:
        return 'info';
      case NotificationType.OFFER_RECEIVED:
        return 'success';
      default:
        return 'default';
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;
  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (loading) {
    return (
      <Box className="p-6">
        <Typography variant="h4" className="mb-6">Loading Notifications...</Typography>
      </Box>
    );
  }

  return (
    <Box className="p-6">
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Left side: (if you want to keep menu or logo here, else leave empty) */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Right side: Website name, Notifications, Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" component="div">
              Placemint
            </Typography>
            <IconButton color="inherit" onClick={() => onNavigate('/notifications')}>
              {/* Notification Icon */}
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={() => onNavigate('/profile')}>
              <Avatar alt={currentUser?.name} src={currentUser?.avatarUrl} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Stack direction="row" justifyContent="space-between" alignItems="center" className="mb-6">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h4" className="font-bold">
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          )}
        </Stack>

        <Stack direction="row" spacing={2}>
          {unreadCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<MarkEmailRead />}
              onClick={markAllAsRead}
            >
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Clear />}
              onClick={clearAllNotifications}
            >
              Clear All
            </Button>
          )}
        </Stack>
      </Stack>

      {notifications.length > 0 ? (
        <Paper>
          <List>
            {sortedNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  className={`${!notification.isRead ? 'bg-blue-50' : ''} hover:bg-gray-50`}
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      {!notification.isRead && (
                        <IconButton
                          edge="end"
                          onClick={() => markAsRead(notification.id)}
                          size="small"
                        >
                          <MarkEmailRead />
                        </IconButton>
                      )}
                      <IconButton
                        edge="end"
                        onClick={() => deleteNotification(notification.id)}
                        size="small"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={2} className="mb-1">
                        <Typography
                          variant="body1"
                          className={`flex-1 ${!notification.isRead ? 'font-semibold' : ''}`}
                        >
                          {notification.message}
                        </Typography>
                        <Chip
                          label={notification.type.replace('_', ' ').toUpperCase()}
                          size="small"
                          color={getNotificationColor(notification.type)}
                          variant="outlined"
                        />
                      </Stack>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(notification.createdAt)}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < sortedNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Paper className="p-8 text-center">
          <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" className="mb-2">
            No notifications yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You'll see important updates and alerts here
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default NotificationCenter;