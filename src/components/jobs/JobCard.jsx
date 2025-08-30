import React from 'react';
import { Card, CardContent, Typography, Button, Chip, Stack, Box } from '@mui/material';
import { formatSalary, formatDate } from '../../utils/formatters';
import { JobType } from '../../data/enums';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

const JobCard = ({ job, onApply, onViewDetails, isApplied = false, className = '' }) => {
  const getJobTypeColor = (type) => {
    switch (type) {
      case JobType.FULL_TIME:
        return 'primary';
      case JobType.INTERNSHIP:
        return 'secondary';
      case JobType.PART_TIME:
        return 'info';
      default:
        return 'default';
    }
  };

  const getJobTypeLabel = (type) => {
    switch (type) {
      case JobType.FULL_TIME:
        return 'Full Time';
      case JobType.INTERNSHIP:
        return 'Internship';
      case JobType.PART_TIME:
        return 'Part Time';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardContent className="p-6">
        <Box className="flex justify-between items-start mb-4">
          <Box className="flex-1">
            <Typography variant="h6" className="font-semibold mb-2">
              {job.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" className="font-medium mb-1">
              {job.companyName}
            </Typography>
          </Box>
          <Chip
            label={getJobTypeLabel(job.type)}
            color={getJobTypeColor(job.type)}
            size="small"
            variant="outlined"
          />
        </Box>

        <Stack direction="row" spacing={3} className="mb-4 text-sm">
          <Box className="flex items-center gap-1">
            <LocationOnOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {job.location}
            </Typography>
          </Box>
          <Box className="flex items-center gap-1">
            <WorkOutlineOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatSalary(job.salary)}
            </Typography>
          </Box>
          <Box className="flex items-center gap-1">
            <CalendarTodayOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Deadline: {formatDate(job.deadline)}
            </Typography>
          </Box>
        </Stack>

        <Typography variant="body2" color="text.secondary" className="mb-4 line-clamp-2">
          {job.description}
        </Typography>

        <Box className="mb-4">
          <Typography variant="caption" color="text.secondary" className="mb-2 block">
            Required Skills:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {job.requirements.slice(0, 4).map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                variant="outlined"
                color="default"
              />
            ))}
            {job.requirements.length > 4 && (
              <Chip
                label={`+${job.requirements.length - 4} more`}
                size="small"
                variant="outlined"
                color="default"
              />
            )}
          </Stack>
        </Box>

        <Stack direction="row" spacing={2} className="mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={() => onApply(job.id)}
            disabled={isApplied}
            className="flex-1"
          >
            {isApplied ? 'Applied' : 'Apply Now'}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onViewDetails(job.id)}
          >
            View Details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default JobCard;