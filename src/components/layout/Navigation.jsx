import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout,
  Settings
} from '@mui/icons-material';
import BentoOutlinedIcon from '@mui/icons-material/BentoOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import { UserRole } from '../../data/enums';

const Navigation = ({ 
  userRole, 
  currentUser, 
  notificationCount = 0, 
  onNavigate, 
  onLogout,
  currentPath = '/dashboard'
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const getNavigationItems = (role) => {
    const commonItems = [
      { text: 'Dashboard', icon: BentoOutlinedIcon, path: '/dashboard' },
      { text: 'Profile', icon: AccountCircle, path: '/profile' },
      { text: 'Settings', icon: Settings, path: '/settings' }
    ];

    switch (role) {
      case UserRole.STUDENT:
        return [
          { text: 'Dashboard', icon: BentoOutlinedIcon, path: '/dashboard' },
          { text: 'Jobs', icon: WorkOutlineOutlinedIcon, path: '/jobs' },
          { text: 'Applications', icon: TextSnippetOutlinedIcon, path: '/applications' },
          { text: 'Resume Builder', icon: TextSnippetOutlinedIcon, path: '/resume' },
          { text: 'Practice Tests', icon: HelpOutlineOutlinedIcon, path: '/tests' },
          { text: 'Analytics', icon: PollOutlinedIcon, path: '/analytics' },
          ...commonItems.slice(1)
        ];
      case UserRole.TPO_ADMIN:
        return [
          { text: 'Dashboard', icon: BentoOutlinedIcon, path: '/admin/dashboard' },
          { text: 'Students', icon: AccountCircle, path: '/admin/students' },
          { text: 'Companies', icon: WorkOutlineOutlinedIcon, path: '/admin/companies' },
          { text: 'Job Postings', icon: TextSnippetOutlinedIcon, path: '/admin/jobs' },
          { text: 'Reports', icon: PollOutlinedIcon, path: '/admin/reports' },
          ...commonItems.slice(1)
        ];
      case UserRole.COMPANY:
        return [
          { text: 'Dashboard', icon: BentoOutlinedIcon, path: '/company/dashboard' },
          { text: 'Job Postings', icon: WorkOutlineOutlinedIcon, path: '/company/jobs' },
          { text: 'Applications', icon: TextSnippetOutlinedIcon, path: '/company/applications' },
          { text: 'Analytics', icon: PollOutlinedIcon, path: '/company/analytics' },
          ...commonItems.slice(1)
        ];
      default:
        return commonItems;
    }
  };

  const navigationItems = getNavigationItems(userRole);

  const handleNavigation = (path) => {
    onNavigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            className="mr-2"
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" className="flex-1 font-semibold">
            PlaceMint
          </Typography>

          <Box className="flex items-center gap-2">
            <IconButton color="inherit" onClick={() => onNavigate('/notifications')}>
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {currentUser?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }} className="h-full">
          <Box className="p-4 bg-primary-50">
            <Typography variant="h6" className="font-bold text-primary-700">
              PlaceMint
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentUser?.name}
            </Typography>
          </Box>
          
          <Divider />
          
          <List>
            {navigationItems.map((item) => (
              <ListItem
                button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                selected={currentPath === item.path}
              >
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => { handleNavigation('/profile'); handleProfileMenuClose(); }}>
          <AccountCircle className="mr-2" />
          Profile
        </MenuItem>
        <MenuItem onClick={() => { handleNavigation('/settings'); handleProfileMenuClose(); }}>
          <Settings className="mr-2" />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { onLogout(); handleProfileMenuClose(); }}>
          <Logout className="mr-2" />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navigation;