import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Button,
  LinearProgress,
  Container,
  Chip,
  Avatar,
  AvatarGroup
} from '@mui/material';
import { BarChart, PieChart, LineChart } from '@mui/x-charts';
import DashboardCard from '../common/DashboardCard';
import { mockQuery } from '../../data/placementMockData';
import { formatSalary, formatPercentage } from '../../utils/formatters';
import { Department } from '../../data/enums';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';

const TPODashboard = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [placementStats, setPlacementStats] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setPlacementStats(mockQuery.placementStats);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl" className="py-8">
        <Box className="text-center">
          <Typography variant="h4" className="mb-6 font-bold">Loading TPO Dashboard...</Typography>
          <LinearProgress 
            sx={{ 
              borderRadius: 2,
              height: 8,
              background: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #00d4ff, #a855f7)'
              }
            }} 
          />
        </Box>
      </Container>
    );
  }

  const departmentData = placementStats.departmentWiseStats.map(dept => ({
    department: dept.department.toUpperCase(),
    placed: dept.placed,
    total: dept.total,
    rate: dept.rate
  }));

  const salaryData = placementStats.salaryDistribution.map(item => ({
    range: item.range,
    count: item.count
  }));

  const topRecruiters = placementStats.topRecruiters.slice(0, 5);

  return (
    <Container maxWidth="xl" className="py-8">
      {/* Header Section */}
      <Box className="mb-8">
        <Typography 
          variant="h3" 
          className="font-bold mb-2"
          sx={{ 
            background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: 'clamp(2rem, 5vw, 3rem)'
          }}
        >
          TPO Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" className="font-medium">
          Manage placements and track institutional performance
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Students"
          value={placementStats.totalStudents}
          subtitle="Registered students"
          icon={SchoolIcon}
          color="primary"
          trend="+5%"
          trendDirection="up"
          onClick={() => onNavigate('/students')}
        />
        <DashboardCard
          title="Placed Students"
          value={placementStats.placedStudents}
          subtitle={`${formatPercentage(placementStats.placementRate)} placement rate`}
          icon={TrendingUpIcon}
          color="success"
          trend="+12%"
          trendDirection="up"
          onClick={() => onNavigate('/placements')}
        />
        <DashboardCard
          title="Active Companies"
          value={placementStats.totalCompanies}
          subtitle="Recruiting partners"
          icon={BusinessIcon}
          color="warning"
          trend="+8%"
          trendDirection="up"
          onClick={() => onNavigate('/companies')}
        />
        <DashboardCard
          title="Average Package"
          value={formatSalary(placementStats.averagePackage)}
          subtitle={`Highest: ${formatSalary(placementStats.highestPackage)}`}
          icon={AssessmentIcon}
          color="info"
          trend="+15%"
          trendDirection="up"
          onClick={() => onNavigate('/analytics')}
        />
      </Box>

      {/* Main Content Grid */}
      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Department-wise Performance */}
        <Box className="lg:col-span-2">
          <Paper 
            className="p-6 h-full"
            sx={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" className="mb-6">
              <Stack direction="row" alignItems="center" spacing={2}>
                <PeopleIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" className="font-semibold">
                  Department-wise Placement
                </Typography>
              </Stack>
            </Stack>
            
            <BarChart
              width={700}
              height={350}
              series={[
                {
                  data: departmentData.map(dept => dept.placed),
                  label: 'Placed',
                  color: '#10b981'
                },
                {
                  data: departmentData.map(dept => dept.total - dept.placed),
                  label: 'Remaining',
                  color: '#6b7280'
                }
              ]}
              xAxis={[{
                data: departmentData.map(dept => dept.department),
                scaleType: 'band'
              }]}
              margin={{ left: 60, right: 40, top: 40, bottom: 60 }}
              sx={{
                '& .MuiChartsAxis-tick': {
                  stroke: 'rgba(255,255,255,0.3)'
                },
                '& .MuiChartsAxis-tickLabel': {
                  fill: 'rgba(255,255,255,0.7)'
                }
              }}
            />
          </Paper>
        </Box>

        {/* Top Recruiters */}
        <Paper 
          className="p-6"
          sx={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} className="mb-6">
            <WorkIcon sx={{ color: 'secondary.main', fontSize: 28 }} />
            <Typography variant="h6" className="font-semibold">
              Top Recruiters
            </Typography>
          </Stack>
          
          <Stack spacing={3}>
            {topRecruiters.map((recruiter, index) => (
              <Box key={recruiter.company} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <Stack direction="row" alignItems="center" spacing={3}>
                  <Box 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    sx={{ 
                      background: index === 0 ? 'linear-gradient(45deg, #ffd700, #ffed4e)' : 
                                  index === 1 ? 'linear-gradient(45deg, #c0c0c0, #e5e5e5)' :
                                  index === 2 ? 'linear-gradient(45deg, #cd7f32, #daa520)' :
                                  'linear-gradient(45deg, #00d4ff, #a855f7)',
                      color: index < 3 ? '#000' : '#fff'
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography variant="subtitle1" className="font-medium">
                    {recruiter.company}
                  </Typography>
                </Stack>
                <Chip 
                  label={`${recruiter.hires} hires`}
                  size="small"
                  sx={{ 
                    background: 'rgba(0,212,255,0.2)',
                    color: '#00d4ff',
                    fontWeight: 600
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* Charts Section */}
      <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Distribution */}
        <Paper 
          className="p-6"
          sx={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" className="font-semibold mb-6">
            Salary Distribution
          </Typography>
          <PieChart
            width={500}
            height={350}
            series={[
              {
                data: salaryData,
                innerRadius: 60,
                outerRadius: 140,
                paddingAngle: 2,
                cornerRadius: 4
              }
            ]}
            margin={{ left: 40, right: 40, top: 40, bottom: 40 }}
          />
        </Paper>

        {/* Placement Trends */}
        <Paper 
          className="p-6"
          sx={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" className="font-semibold mb-6">
            Placement Trends
          </Typography>
          <LineChart
            width={500}
            height={350}
            series={[
              {
                data: [65, 68, 72, 75, 71],
                label: 'Placement Rate (%)',
                color: '#00d4ff'
              }
            ]}
            xAxis={[{
              data: ['2020', '2021', '2022', '2023', '2024'],
              scaleType: 'point'
            }]}
            margin={{ left: 60, right: 40, top: 40, bottom: 60 }}
            sx={{
              '& .MuiChartsAxis-tick': {
                stroke: 'rgba(255,255,255,0.3)'
              },
              '& .MuiChartsAxis-tickLabel': {
                fill: 'rgba(255,255,255,0.7)'
              }
            }}
          />
        </Paper>
      </Box>

      {/* Quick Actions */}
      <Paper 
        className="p-6 mt-6"
        sx={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" className="font-semibold mb-6">
          Quick Actions
        </Typography>
        
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="contained"
            fullWidth
            onClick={() => onNavigate('/companies')}
            sx={{ 
              py: 2,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #00d4ff, #a855f7)',
              '&:hover': {
                background: 'linear-gradient(45deg, #00b4d8, #9333ea)',
              }
            }}
          >
            Add Company
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => onNavigate('/jobs')}
            sx={{ 
              py: 2,
              borderRadius: 2,
              borderColor: 'rgba(255,255,255,0.2)',
              '&:hover': {
                borderColor: 'primary.main',
                background: 'rgba(0,212,255,0.1)'
              }
            }}
          >
            Post Job
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => onNavigate('/students')}
            sx={{ 
              py: 2,
              borderRadius: 2,
              borderColor: 'rgba(255,255,255,0.2)',
              '&:hover': {
                borderColor: 'success.main',
                background: 'rgba(16,185,129,0.1)'
              }
            }}
          >
            Manage Students
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => onNavigate('/reports')}
            sx={{ 
              py: 2,
              borderRadius: 2,
              borderColor: 'rgba(255,255,255,0.2)',
              '&:hover': {
                borderColor: 'warning.main',
                background: 'rgba(245,158,11,0.1)'
              }
            }}
          >
            Generate Report
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TPODashboard;