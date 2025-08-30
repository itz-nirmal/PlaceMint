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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import { BarChart, PieChart, LineChart } from '@mui/x-charts';
import DashboardCard from '../common/DashboardCard';
import StatusBadge from '../common/StatusBadge';
import { mockQuery } from '../../data/placementMockData';
import { formatSalary, formatDate } from '../../utils/formatters';
import { ApplicationStatus, Department } from '../../data/enums';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const CompanyDashboard = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      // Filter data for company view
      setApplications(mockQuery.applications);
      setJobs(mockQuery.jobs.slice(0, 3)); // Company's active jobs
      setCandidates(mockQuery.students.slice(0, 5)); // Potential candidates
      setLoading(false);
    }, 1000);
  }, []);

  const getApplicationStats = () => {
    const total = applications.length;
    const shortlisted = applications.filter(app => app.status === ApplicationStatus.SHORTLISTED).length;
    const interviews = applications.filter(app => app.status === ApplicationStatus.INTERVIEW).length;
    const offers = applications.filter(app => app.status === ApplicationStatus.OFFER).length;
    
    return { total, shortlisted, interviews, offers };
  };

  const stats = getApplicationStats();

  const applicationStatusData = [
    { label: 'Applied', value: applications.filter(app => app.status === ApplicationStatus.APPLIED).length },
    { label: 'Shortlisted', value: applications.filter(app => app.status === ApplicationStatus.SHORTLISTED).length },
    { label: 'Interview', value: applications.filter(app => app.status === ApplicationStatus.INTERVIEW).length },
    { label: 'Offer', value: applications.filter(app => app.status === ApplicationStatus.OFFER).length },
    { label: 'Rejected', value: applications.filter(app => app.status === ApplicationStatus.REJECTED).length }
  ].filter(item => item.value > 0);

  const departmentData = [
    { department: 'CSE', applications: 15 },
    { department: 'IT', applications: 12 },
    { department: 'ECE', applications: 8 },
    { department: 'EEE', applications: 5 },
    { department: 'MECH', applications: 3 }
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" className="py-8">
        <Box className="text-center">
          <Typography variant="h4" className="mb-6 font-bold">Loading Company Dashboard...</Typography>
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
          Company Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" className="font-medium">
          Manage recruitment and track candidate applications
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Applications"
          value={stats.total}
          subtitle="Received applications"
          icon={WorkIcon}
          color="primary"
          trend="+18%"
          trendDirection="up"
          onClick={() => onNavigate('/applications')}
        />
        <DashboardCard
          title="Shortlisted"
          value={stats.shortlisted}
          subtitle="Candidates shortlisted"
          icon={TrendingUpIcon}
          color="success"
          trend="+25%"
          trendDirection="up"
          onClick={() => onNavigate('/candidates')}
        />
        <DashboardCard
          title="Interviews"
          value={stats.interviews}
          subtitle="Scheduled interviews"
          icon={PeopleIcon}
          color="warning"
          trend="+12%"
          trendDirection="up"
          onClick={() => onNavigate('/interviews')}
        />
        <DashboardCard
          title="Offers Made"
          value={stats.offers}
          subtitle="Job offers extended"
          icon={AssessmentIcon}
          color="info"
          trend="+30%"
          trendDirection="up"
          onClick={() => onNavigate('/offers')}
        />
      </Box>

      {/* Main Content Grid */}
      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Applications */}
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
                <PersonIcon sx={{ color: 'primary.main', fontSize: 28 }} />
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
              {applications.slice(0, 5).map((application) => (
                <ListItem 
                  key={application.id}
                  className="px-4 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                  sx={{ 
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 2
                  }}
                  onClick={() => onNavigate('/candidates')}
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        background: 'linear-gradient(45deg, #00d4ff, #a855f7)',
                        width: 48,
                        height: 48
                      }}
                    >
                      {application.jobTitle.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" className="font-semibold mb-1">
                        {application.jobTitle}
                      </Typography>
                    }
                    secondary={
                      <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                          Applied on {formatDate(application.appliedDate)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Last updated: {formatDate(application.lastUpdated)}
                        </Typography>
                      </Stack>
                    }
                  />
                  <StatusBadge status={application.status} size="small" />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        {/* Active Job Postings */}
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
              Active Jobs
            </Typography>
          </Stack>
          
          <Stack spacing={3}>
            {jobs.map((job) => (
              <Box
                key={job.id}
                className="p-4 rounded-xl border border-white/10 hover:border-primary-main/50 transition-all cursor-pointer hover:bg-white/5"
                onClick={() => onNavigate('/jobs')}
              >
                <Typography variant="subtitle1" className="font-semibold mb-2">
                  {job.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mb-3">
                  {job.location}
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
            
            <Button
              variant="contained"
              fullWidth
              onClick={() => onNavigate('/jobs/new')}
              sx={{ 
                py: 2,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #00d4ff, #a855f7)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #00b4d8, #9333ea)',
                }
              }}
            >
              Post New Job
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* Charts Section */}
      <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          <PieChart
            width={500}
            height={350}
            series={[
              {
                data: applicationStatusData,
                innerRadius: 60,
                outerRadius: 140,
                paddingAngle: 2,
                cornerRadius: 4
              }
            ]}
            margin={{ left: 40, right: 40, top: 40, bottom: 40 }}
          />
        </Paper>

        {/* Department-wise Applications */}
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
            Applications by Department
          </Typography>
          <BarChart
            width={500}
            height={350}
            series={[
              {
                data: departmentData.map(dept => dept.applications),
                label: 'Applications',
                color: '#00d4ff'
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

      {/* Top Candidates */}
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
          Top Candidates
        </Typography>
        
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((candidate) => (
            <Box
              key={candidate.id}
              className="p-4 rounded-xl border border-white/10 hover:border-primary-main/50 transition-all cursor-pointer hover:bg-white/5"
              onClick={() => onNavigate('/candidates')}
            >
              <Stack direction="row" alignItems="center" spacing={3} className="mb-3">
                <Avatar 
                  sx={{ 
                    background: 'linear-gradient(45deg, #00d4ff, #a855f7)',
                    width: 48,
                    height: 48
                  }}
                >
                  {candidate.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" className="font-semibold">
                    {candidate.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {candidate.department.toUpperCase()} • CGPA: {candidate.cgpa}
                  </Typography>
                </Box>
              </Stack>
              
              <Stack direction="row" spacing={1} className="mb-2" flexWrap="wrap">
                {candidate.skills.slice(0, 3).map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    size="small"
                    sx={{ 
                      background: 'rgba(0,212,255,0.2)',
                      color: '#00d4ff',
                      fontSize: '0.75rem'
                    }}
                  />
                ))}
              </Stack>
              
              <Typography variant="caption" color="text.secondary">
                {candidate.applications} applications • {candidate.offers} offers
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default CompanyDashboard;