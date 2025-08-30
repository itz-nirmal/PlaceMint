import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
  Button,
  Pagination,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Checkbox,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import JobCard from './JobCard';
import { mockQuery } from '../../data/placementMockData';
import { JobType, Department } from '../../data/enums';
import { formatSalary } from '../../utils/formatters';

const JobListings = ({ onApply, onViewDetails }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('postedDate');
  const [filters, setFilters] = useState({
    jobType: [],
    departments: [],
    salaryRange: [0, 2000000],
    location: ''
  });

  const jobsPerPage = 6;

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const allJobs = [...mockQuery.jobs, ...generateMoreJobs()];
      setJobs(allJobs);
      setFilteredJobs(allJobs);
      setLoading(false);
    }, 1000);
  }, []);

  const generateMoreJobs = () => {
    const companies = ['Microsoft', 'Google', 'Amazon', 'Wipro', 'Accenture', 'Cognizant'];
    const positions = ['Software Developer', 'Data Scientist', 'Product Manager', 'Business Analyst'];
    const locations = ['Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata'];
    
    return Array.from({ length: 10 }, (_, index) => ({
      id: `job_${index + 3}`,
      title: positions[index % positions.length],
      companyName: companies[index % companies.length],
      location: locations[index % locations.length],
      salary: 300000 + (index * 50000),
      type: index % 2 === 0 ? JobType.FULL_TIME : JobType.INTERNSHIP,
      deadline: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
      eligibilityCriteria: {
        minCGPA: 6.0 + (index % 3),
        allowedDepartments: [Department.CSE, Department.IT],
        maxBacklogs: index % 2
      },
      description: `Join our team and work on exciting projects with cutting-edge technology.`,
      requirements: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      postedDate: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString()
    }));
  };

  useEffect(() => {
    let filtered = [...jobs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Job type filter
    if (filters.jobType.length > 0) {
      filtered = filtered.filter(job => filters.jobType.includes(job.type));
    }

    // Salary range filter
    filtered = filtered.filter(job =>
      job.salary >= filters.salaryRange[0] && job.salary <= filters.salaryRange[1]
    );

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'salary':
          return b.salary - a.salary;
        case 'deadline':
          return new Date(a.deadline) - new Date(b.deadline);
        case 'postedDate':
        default:
          return new Date(b.postedDate) - new Date(a.postedDate);
      }
    });

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [jobs, searchTerm, filters, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleJobTypeChange = (jobType) => {
    const updatedTypes = filters.jobType.includes(jobType)
      ? filters.jobType.filter(type => type !== jobType)
      : [...filters.jobType, jobType];
    
    handleFilterChange('jobType', updatedTypes);
  };

  const clearFilters = () => {
    setFilters({
      jobType: [],
      departments: [],
      salaryRange: [0, 2000000],
      location: ''
    });
    setSearchTerm('');
  };

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  if (loading) {
    return (
      <Box className="p-6">
        <Typography variant="h4" className="mb-6">Loading Jobs...</Typography>
      </Box>
    );
  }

  return (
    <Box className="p-6">
      <Typography variant="h4" className="font-bold mb-6">
        Job Opportunities
      </Typography>

      {/* Search and Sort */}
      <Paper className="p-4 mb-6">
        <Stack direction="row" spacing={2} alignItems="center" className="mb-4">
          <TextField
            placeholder="Search jobs, companies, locations..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon className="mr-2 text-gray-400" />
            }}
            className="flex-1"
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="postedDate">Latest</MenuItem>
              <MenuItem value="salary">Salary</MenuItem>
              <MenuItem value="deadline">Deadline</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Filters */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <FilterIcon />
              <Typography>Filters</Typography>
              {(filters.jobType.length > 0 || filters.location) && (
                <Chip
                  label={`${filters.jobType.length + (filters.location ? 1 : 0)} active`}
                  size="small"
                  color="primary"
                />
              )}
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Job Type Filter */}
              <Box>
                <Typography variant="subtitle2" className="mb-2">Job Type</Typography>
                <FormGroup>
                  {Object.values(JobType).map((type) => (
                    <FormControlLabel
                      key={type}
                      control={
                        <Checkbox
                          checked={filters.jobType.includes(type)}
                          onChange={() => handleJobTypeChange(type)}
                        />
                      }
                      label={type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    />
                  ))}
                </FormGroup>
              </Box>

              {/* Salary Range Filter */}
              <Box>
                <Typography variant="subtitle2" className="mb-2">
                  Salary Range: {formatSalary(filters.salaryRange[0])} - {formatSalary(filters.salaryRange[1])}
                </Typography>
                <Slider
                  value={filters.salaryRange}
                  onChange={(e, newValue) => handleFilterChange('salaryRange', newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={2000000}
                  step={50000}
                  valueLabelFormat={(value) => formatSalary(value)}
                />
              </Box>

              {/* Location Filter */}
              <Box>
                <Typography variant="subtitle2" className="mb-2">Location</Typography>
                <TextField
                  placeholder="Enter location"
                  variant="outlined"
                  size="small"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  fullWidth
                />
              </Box>
            </div>

            <Stack direction="row" spacing={2} className="mt-4">
              <Button variant="outlined" onClick={clearFilters}>
                Clear All Filters
              </Button>
              <Typography variant="body2" color="text.secondary" className="flex items-center">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </Typography>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Job Cards */}
      {currentJobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {currentJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={onApply}
                onViewDetails={onViewDetails}
                isApplied={false} // This should come from application state
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box className="flex justify-center">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Paper className="p-8 text-center">
          <Typography variant="h6" color="text.secondary" className="mb-2">
            No jobs found
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mb-4">
            Try adjusting your search criteria or filters
          </Typography>
          <Button variant="contained" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default JobListings;