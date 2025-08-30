import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { Timer, Quiz, TrendingUp, EmojiEvents } from '@mui/icons-material';
import { TestType } from '../../data/enums';
import { mockQuery } from '../../data/placementMockData';
import { formatDateTime } from '../../utils/formatters';

const PracticeTests = () => {
  const [testResults, setTestResults] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load test results
    setTimeout(() => {
      setTestResults(mockQuery.testResults);
      setLoading(false);
    }, 500);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (activeTest && timeLeft > 0 && !testCompleted) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTestSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTest, timeLeft, testCompleted]);

  const testTypes = [
    {
      type: TestType.APTITUDE,
      title: 'Aptitude Test',
      description: 'Mathematical reasoning, logical thinking, and problem-solving',
      duration: 60,
      questions: 30,
      icon: Quiz,
      color: 'primary'
    },
    {
      type: TestType.REASONING,
      title: 'Reasoning Test',
      description: 'Logical reasoning, pattern recognition, and analytical skills',
      duration: 45,
      questions: 25,
      icon: TrendingUp,
      color: 'secondary'
    },
    {
      type: TestType.CODING,
      title: 'Coding Test',
      description: 'Programming concepts, algorithms, and data structures',
      duration: 120,
      questions: 20,
      icon: EmojiEvents,
      color: 'success'
    },
    {
      type: TestType.ENGLISH,
      title: 'English Test',
      description: 'Grammar, vocabulary, comprehension, and communication',
      duration: 30,
      questions: 20,
      icon: Quiz,
      color: 'info'
    }
  ];

  const sampleQuestions = {
    [TestType.APTITUDE]: [
      {
        question: "If a train travels 120 km in 2 hours, what is its average speed?",
        options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
        correct: 1
      },
      {
        question: "What is 15% of 200?",
        options: ["25", "30", "35", "40"],
        correct: 1
      }
    ],
    [TestType.REASONING]: [
      {
        question: "Complete the series: 2, 6, 12, 20, ?",
        options: ["28", "30", "32", "34"],
        correct: 1
      },
      {
        question: "If all roses are flowers and some flowers are red, then:",
        options: ["All roses are red", "Some roses are red", "No roses are red", "Cannot be determined"],
        correct: 3
      }
    ],
    [TestType.CODING]: [
      {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correct: 1
      },
      {
        question: "Which data structure uses LIFO principle?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correct: 1
      }
    ],
    [TestType.ENGLISH]: [
      {
        question: "Choose the correct sentence:",
        options: ["He don't like coffee", "He doesn't likes coffee", "He doesn't like coffee", "He not like coffee"],
        correct: 2
      },
      {
        question: "What is the synonym of 'abundant'?",
        options: ["Scarce", "Plentiful", "Limited", "Rare"],
        correct: 1
      }
    ]
  };

  const startTest = (testType) => {
    const testConfig = testTypes.find(t => t.type === testType);
    setActiveTest({
      ...testConfig,
      questions: sampleQuestions[testType] || []
    });
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(testConfig.duration * 60); // Convert to seconds
    setTestCompleted(false);
  };

  const handleAnswerChange = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < activeTest.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleTestSubmit = () => {
    // Calculate score
    let correctAnswers = 0;
    activeTest.questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / activeTest.questions.length) * 100);
    
    // Add to results
    const newResult = {
      id: `test_${Date.now()}`,
      type: activeTest.type,
      score: score,
      maxScore: 100,
      completedDate: new Date().toISOString(),
      duration: activeTest.duration,
      rank: Math.floor(Math.random() * 50) + 1 // Mock rank
    };

    setTestResults(prev => [newResult, ...prev]);
    setTestCompleted(true);
  };

  const closeTest = () => {
    setActiveTest(null);
    setTestCompleted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box className="p-6">
        <Typography variant="h4" className="mb-6">Loading Tests...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box className="p-6">
      <Typography variant="h4" className="font-bold mb-6">
        Practice Tests
      </Typography>

      {/* Test Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {testTypes.map((test) => {
          const IconComponent = test.icon;
          const lastResult = testResults.find(result => result.type === test.type);
          
          return (
            <Card key={test.type} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Stack alignItems="center" spacing={2} className="text-center">
                  <IconComponent 
                    sx={{ fontSize: 48, color: `${test.color}.main` }} 
                  />
                  <Typography variant="h6" className="font-semibold">
                    {test.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="text-center">
                    {test.description}
                  </Typography>
                  
                  <Stack direction="row" spacing={2} className="text-sm">
                    <Chip
                      icon={<Timer />}
                      label={`${test.duration} min`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<Quiz />}
                      label={`${test.questions} questions`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>

                  {lastResult && (
                    <Chip
                      label={`Last Score: ${lastResult.score}%`}
                      color={getScoreColor(lastResult.score)}
                      size="small"
                    />
                  )}

                  <Button
                    variant="contained"
                    color={test.color}
                    fullWidth
                    onClick={() => startTest(test.type)}
                  >
                    Start Test
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Test Results History */}
      <Paper className="p-6">
        <Typography variant="h6" className="font-semibold mb-4">
          Test History
        </Typography>
        
        {testResults.length > 0 ? (
          <List>
            {testResults.map((result, index) => (
              <React.Fragment key={result.id}>
                <ListItem className="px-0">
                  <ListItemText
                    primary={
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" className="font-medium">
                          {result.type.charAt(0).toUpperCase() + result.type.slice(1)} Test
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Chip
                            label={`${result.score}%`}
                            color={getScoreColor(result.score)}
                            size="small"
                          />
                          <Chip
                            label={`Rank: ${result.rank}`}
                            variant="outlined"
                            size="small"
                          />
                        </Stack>
                      </Stack>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Completed on {formatDateTime(result.completedDate)} • Duration: {result.duration} minutes
                      </Typography>
                    }
                  />
                </ListItem>
                {index < testResults.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" className="text-center py-8">
            No test results yet. Take your first practice test!
          </Typography>
        )}
      </Paper>

      {/* Test Dialog */}
      <Dialog
        open={!!activeTest}
        onClose={closeTest}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown={!testCompleted}
      >
        {activeTest && (
          <>
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  {activeTest.title}
                </Typography>
                {!testCompleted && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip
                      icon={<Timer />}
                      label={formatTime(timeLeft)}
                      color={timeLeft < 300 ? 'error' : 'primary'}
                    />
                    <Typography variant="body2">
                      Question {currentQuestion + 1} of {activeTest.questions.length}
                    </Typography>
                  </Stack>
                )}
              </Stack>
              {!testCompleted && (
                <LinearProgress
                  variant="determinate"
                  value={(currentQuestion + 1) / activeTest.questions.length * 100}
                  className="mt-2"
                />
              )}
            </DialogTitle>

            <DialogContent>
              {!testCompleted ? (
                <Box>
                  <Typography variant="h6" className="mb-4">
                    {activeTest.questions[currentQuestion]?.question}
                  </Typography>
                  
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={answers[currentQuestion] || ''}
                      onChange={(e) => handleAnswerChange(currentQuestion, parseInt(e.target.value))}
                    >
                      {activeTest.questions[currentQuestion]?.options.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={index}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              ) : (
                <Box className="text-center py-8">
                  <EmojiEvents sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                  <Typography variant="h4" className="font-bold mb-2">
                    Test Completed!
                  </Typography>
                  <Typography variant="h6" color="text.secondary" className="mb-4">
                    Your Score: {testResults[0]?.score}%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Great job! Keep practicing to improve your skills.
                  </Typography>
                </Box>
              )}
            </DialogContent>

            <DialogActions>
              {!testCompleted ? (
                <Stack direction="row" spacing={2} className="w-full p-4">
                  <Button
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  <Box className="flex-1" />
                  {currentQuestion === activeTest.questions.length - 1 ? (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleTestSubmit}
                    >
                      Submit Test
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={nextQuestion}
                    >
                      Next
                    </Button>
                  )}
                </Stack>
              ) : (
                <Button onClick={closeTest} variant="contained">
                  Close
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default PracticeTests;