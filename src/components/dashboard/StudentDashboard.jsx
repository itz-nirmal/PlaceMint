import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  LinearProgress,
  Chip,
  Container,
  Divider
} from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import DashboardCard from '../common/DashboardCard';
import StatusBadge from '../common/StatusBadge';
import { mockQuery } from '../../data/placementMockData';
import { formatSalary, formatDate, formatPercentage } from '../../utils/formatters';
import { ApplicationStatus, TestType } from '../../data/enums';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const StudentDashboard = ({ onNavigate }) => {
  const [applications, setApplications] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setApplications(mockQuery.applications);
      setTestResults(mockQuery.testResults);
      setRecentJobs(mockQuery.jobs.slice(0, 3));
      setLoading(false);
    }, 1000);
  }, []);

  const getApplicationStats = () => {
    const total = applications.length;
    const shortlisted = applications.filter(app => app.status === ApplicationStatus.SHORTLISTED).length;
    const offers = applications.filter(app => app.status === ApplicationStatus.OFFER).length;
    
    return { total, shortlisted, offers };
  };

  const getTestStats = () => {
    if (testResults.length === 0) return { avgScore: 0, totalTests: 0 };
    
    const totalScore = testResults.reduce((sum, test) => sum + test.score, 0);
    const avgScore = totalScore / testResults.length;
    
    return { avgScore, totalTests: testResults.length };
  };

  const stats = getApplicationStats();
  const testStats = getTestStats();

  // Chart data
  const testScoreData = testResults.map(test => ({
    type: test.type,
    score: test.score,
    maxScore: test.maxScore
  }));

  const applicationStatusData = [
    { label: 'Applied', value: applications.filter(app => app.status === ApplicationStatus.APPLIED).length },
    { label: 'Shortlisted', value: applications.filter(app => app.status === ApplicationStatus.SHORTLISTED).length },
    { label: 'Interview', value: applications.filter(app => app.status === ApplicationStatus.INTERVIEW).length },
    { label: 'Offer', value: applications.filter(app => app.status === ApplicationStatus.OFFER).length },
    { label: 'Rejected', value: applications.filter(app => app.status === ApplicationStatus.REJECTED).length }
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <Container maxWidth="xl" className="py-8">
        <Box className="text-center">
          <Typography variant="h4" className="mb-6 font-bold">Loading Dashboard...</Typography>
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
          Student Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" className="font-medium">
          Track your placement journey and performance
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Applications"
          value={stats.total}
          subtitle="Jobs applied to"
          icon={TextSnippetOutlinedIcon}
          color="primary"
          trend="+12%"
          trendDirection="up"
          onClick={() => onNavigate('/applications')}
        />
        <DashboardCard
          title="Shortlisted"
          value={stats.shortlisted}
          subtitle="Applications shortlisted"
          icon={TrendingUpIcon}
          color="success"
          trend="+8%"
          trendDirection="up"
          onClick={() => onNavigate('/applications')}
        />
        <DashboardCard
          title="Offers Received"
          value={stats.offers}
          subtitle="Job offers"
          icon={WorkOutlineOutlinedIcon}
          color="warning"
          trend="+25%"
          trendDirection="up"
          onClick={() => onNavigate('/applications')}
        />
        <DashboardCard
          title="Test Average"
          value={`${testStats.avgScore.toFixed(0)}%`}
          subtitle={`${testStats.totalTests} tests taken`}
          icon={HelpOutlineOutlinedIcon}
          color="info"
          trend="+5%"
          trendDirection="up"
          onClick={() => onNavigate('/tests')}
        />
      </Box>

      {/* Main Content Grid */}
      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Applications - Takes 2 columns */}
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
                <AssessmentIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" className="font-semibold">
                  Recent Applications
                </Typography>
              </Stack>
              <Button
                variant="outlined"
                size="small"
                onClick={() => onNavigate('/applications')}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                View All
              </Button>
            </Stack>
            
            <List className="space-y-2">
              {applications.slice(0, 5).map((application, index) => (
                <React.Fragment key={application.id}>
                  <ListItem 
                    className="px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                    sx={{ 
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 2
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" className="font-semibold mb-1">
                          {application.jobTitle}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" spacing={2} alignItems="center" className="mt-2">
                          <Typography variant="body2" color="text.secondary">
                            {application.companyName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            • {formatDate(application.appliedDate)}
                          </Typography>
                        </Stack>
                      }
                    />
                    <StatusBadge status={application.status} size="small" />
                  </ListItem>
                  {index < applications.slice(0, 5).length - 1 && (
                    <Divider sx={{ opacity: 0.1, my: 1 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>

        {/* Quick Actions */}
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
            <BusinessCenterIcon sx={{ color: 'secondary.main', fontSize: 28 }} />
            <Typography variant="h6" className="font-semibold">
              Quick Actions
            </Typography>
          </Stack>
          
          <Stack spacing={3}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => onNavigate('/jobs')}
              sx={{ 
                py: 2,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #00d4ff, #a855f7)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #00b4d8, #9333ea)',
                }
              }}
            >
              Browse New Jobs
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => onNavigate('/tests')}
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
              Take Practice Test
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => onNavigate('/resume')}
              sx={{ 
                py: 2,
                borderRadius: 2,
                borderColor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  borderColor: 'secondary.main',
                  background: 'rgba(168,85,247,0.1)'
                }
              }}
            >
              Update Resume
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* Charts Section */}
      <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Performance Chart */}
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
            Test Performance
          </Typography>
          {testResults.length > 0 ? (
            <BarChart
              width={500}
              height={300}
              series={[
                {
                  data: testScoreData.map(test => test.score),
                  label: 'Score',
                  color: '#00d4ff'
                }
              ]}
              xAxis={[{
                data: testScoreData.map(test => test.type.charAt(0).toUpperCase() + test.type.slice(1)),
                scaleType: 'band'
              }]}
              margin={{ left: 40, right: 40, top: 40, bottom: 60 }}
              sx={{
                '& .MuiChartsAxis-tick': {
                  stroke: 'rgba(255,255,255,0.3)'
                },
                '& .MuiChartsAxis-tickLabel': {
                  fill: 'rgba(255,255,255,0.7)'
                }
              }}
            />
          ) : (
            <Box className="text-center py-12">
              <Typography variant="body2" color="text.secondary" className="mb-4">
                No test results available. Take your first test!
              </Typography>
              <Button
                variant="contained"
                onClick={() => onNavigate('/tests')}
                sx={{ 
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #00d4ff, #a855f7)'
                }}
              >
                Start Practice Test
              </Button>
            </Box>
          )}
        </Paper>

        {/* Application Status Distribution */}
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
            Application Status
          </Typography>
          {applicationStatusData.length > 0 ? (
            <PieChart
              width={500}
              height={300}
              series={[
                {
                  data: applicationStatusData,
                  innerRadius: 60,
                  outerRadius: 120,
                  paddingAngle: 2,
                  cornerRadius: 4
                }
              ]}
              margin={{ left: 40, right: 40, top: 40, bottom: 40 }}
            />
          ) : (
            <Box className="text-center py-12">
              <Typography variant="body2" color="text.secondary" className="mb-4">
                No applications yet. Start applying to jobs!
              </Typography>
              <Button
                variant="contained"
                onClick={() => onNavigate('/jobs')}
                sx={{ 
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #00d4ff, #a855f7)'
                }}
              >
                Browse Jobs
              </Button>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Recent Job Openings */}
      <Paper 
        className="p-6 mt-6"
        sx={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 3,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" className="mb-6">
          <Typography variant="h6" className="font-semibold">
            Recent Job Openings
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onNavigate('/jobs')}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            View All
          </Button>
        </Stack>
        
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentJobs.map((job) => (
            <Box
              key={job.id}
              className="p-4 rounded-xl border border-white/10 hover:border-primary-main/50 transition-all cursor-pointer hover:bg-white/5"
              onClick={() => onNavigate('/jobs')}
            >
              <Typography variant="subtitle1" className="font-semibold mb-2">
                {job.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-3">
                {job.companyName} • {job.location}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" className="mb-2">
                <Chip
                  label={formatSalary(job.salary)}
                  size="small"
                  sx={{ 
                    background: 'linear-gradient(45deg, #00d4ff, #a855f7)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Deadline: {formatDate(job.deadline)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default StudentDashboard;