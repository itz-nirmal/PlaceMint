import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  LinearProgress,
  Chip
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
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

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
      <Box className="p-6">
        <Typography variant="h4" className="mb-6">Loading Dashboard...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box className="p-6 space-y-6">
      <Typography variant="h4" className="font-bold mb-6">
        Student Dashboard
      </Typography>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Applications"
          value={stats.total}
          subtitle="Jobs applied to"
          icon={TextSnippetOutlinedIcon}
          color="primary"
          onClick={() => onNavigate('/applications')}
        />
        <DashboardCard
          title="Shortlisted"
          value={stats.shortlisted}
          subtitle="Applications shortlisted"
          icon={TrendingUpIcon}
          color="success"
          onClick={() => onNavigate('/applications')}
        />
        <DashboardCard
          title="Offers Received"
          value={stats.offers}
          subtitle="Job offers"
          icon={WorkOutlineOutlinedIcon}
          color="warning"
          onClick={() => onNavigate('/applications')}
        />
        <DashboardCard
          title="Test Average"
          value={`${testStats.avgScore.toFixed(0)}%`}
          subtitle={`${testStats.totalTests} tests taken`}
          icon={HelpOutlineOutlinedIcon}
          color="info"
          onClick={() => onNavigate('/tests')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Paper className="p-6">
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h6" className="font-semibold">
              Recent Applications
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onNavigate('/applications')}
            >
              View All
            </Button>
          </Box>
          
          <List>
            {applications.slice(0, 5).map((application) => (
              <ListItem key={application.id} className="px-0">
                <ListItemText
                  primary={application.jobTitle}
                  secondary={
                    <Stack direction="row" spacing={1} alignItems="center" className="mt-1">
                      <Typography variant="caption" color="text.secondary">
                        {application.companyName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        • {formatDate(application.appliedDate)}
                      </Typography>
                    </Stack>
                  }
                />
                <StatusBadge status={application.status} size="small" />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Test Performance Chart */}
        <Paper className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            Test Performance
          </Typography>
          {testResults.length > 0 ? (
            <BarChart
              width={400}
              height={300}
              series={[
                {
                  data: testScoreData.map(test => test.score),
                  label: 'Score',
                  color: '#1976d2'
                }
              ]}
              xAxis={[{
                data: testScoreData.map(test => test.type.charAt(0).toUpperCase() + test.type.slice(1)),
                scaleType: 'band'
              }]}
              margin={{ left: 40, right: 40, top: 40, bottom: 40 }}
            />
          ) : (
            <Box className="text-center py-8">
              <Typography variant="body2" color="text.secondary">
                No test results available. Take your first test!
              </Typography>
              <Button
                variant="contained"
                className="mt-4"
                onClick={() => onNavigate('/tests')}
              >
                Start Practice Test
              </Button>
            </Box>
          )}
        </Paper>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Distribution */}
        <Paper className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            Application Status
          </Typography>
          {applicationStatusData.length > 0 ? (
            <PieChart
              width={400}
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
            <Box className="text-center py-8">
              <Typography variant="body2" color="text.secondary">
                No applications yet. Start applying to jobs!
              </Typography>
              <Button
                variant="contained"
                className="mt-4"
                onClick={() => onNavigate('/jobs')}
              >
                Browse Jobs
              </Button>
            </Box>
          )}
        </Paper>

        {/* Recent Job Openings */}
        <Paper className="p-6">
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h6" className="font-semibold">
              Recent Job Openings
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onNavigate('/jobs')}
            >
              View All
            </Button>
          </Box>
          
          <List>
            {recentJobs.map((job) => (
              <ListItem key={job.id} className="px-0">
                <ListItemText
                  primary={job.title}
                  secondary={
                    <Stack direction="column" spacing={1} className="mt-1">
                      <Typography variant="caption" color="text.secondary">
                        {job.companyName} • {job.location}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={formatSalary(job.salary)}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          Deadline: {formatDate(job.deadline)}
                        </Typography>
                      </Stack>
                    </Stack>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
    </Box>
  );
};

export default StudentDashboard;