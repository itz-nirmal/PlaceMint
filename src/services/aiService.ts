import { Question } from '@/lib/testStore';

const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "deepseek/deepseek-chat-v3.1:free";

interface QuestionRequest {
  subject: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
  marksPerQuestion: number;
}

export class AIService {
  private async callOpenRouter(prompt: string): Promise<any> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'PlaceMint Test System'
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are an expert test creator for placement preparation. Generate high-quality multiple choice questions with exactly 4 options each. Always provide the correct answer index (0-3) and a brief explanation.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      throw error;
    }
  }

  async generateQuestions(requests: QuestionRequest[]): Promise<Question[]> {
    const allQuestions: Question[] = [];

    for (const request of requests) {
      const prompt = this.createPrompt(request);
      
      try {
        const response = await this.callOpenRouter(prompt);
        const questions = this.parseQuestions(response, request);
        allQuestions.push(...questions);
      } catch (error) {
        console.error(`Error generating questions for ${request.subject}:`, error);
        // Fallback to sample questions if AI fails
        const fallbackQuestions = this.generateFallbackQuestions(request);
        allQuestions.push(...fallbackQuestions);
      }
    }

    return allQuestions;
  }

  private createPrompt(request: QuestionRequest): string {
    return `
Generate ${request.questionCount} multiple choice questions for a ${request.difficulty} level ${request.subject} test in the ${request.category} category.

Requirements:
- Each question should be worth ${request.marksPerQuestion} marks
- Provide exactly 4 options (A, B, C, D) for each question
- Include the correct answer index (0 for A, 1 for B, 2 for C, 3 for D)
- Add a brief explanation for the correct answer
- Questions should be relevant for placement/job interviews
- Difficulty level: ${request.difficulty}

Format your response as a JSON array with this structure:
[
  {
    "questionText": "Question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this is correct"
  }
]

Subject: ${request.subject}
Category: ${request.category}
Difficulty: ${request.difficulty}
Number of questions: ${request.questionCount}
`;
  }

  private parseQuestions(response: string, request: QuestionRequest): Question[] {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const questionsData = JSON.parse(jsonMatch[0]);
      
      return questionsData.map((q: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        questionText: q.questionText || q.question || '',
        options: q.options || [],
        correctAnswer: q.correctAnswer || 0,
        marks: request.marksPerQuestion,
        difficulty: request.difficulty,
        category: request.category,
        explanation: q.explanation || ''
      }));
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.generateFallbackQuestions(request);
    }
  }

  private generateFallbackQuestions(request: QuestionRequest): Question[] {
    const fallbackQuestions = this.getFallbackQuestionsByCategory(request.category, request.subject);
    
    return fallbackQuestions.slice(0, request.questionCount).map((q, index) => ({
      id: `fallback-${Date.now()}-${index}`,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      marks: request.marksPerQuestion,
      difficulty: request.difficulty,
      category: request.category,
      explanation: q.explanation
    }));
  }

  private getFallbackQuestionsByCategory(category: string, subject: string): any[] {
    const fallbackQuestions: { [key: string]: any[] } = {
      'coding': [
        {
          questionText: "What is the time complexity of binary search?",
          options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
          correctAnswer: 1,
          explanation: "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity."
        },
        {
          questionText: "Which data structure uses LIFO principle?",
          options: ["Queue", "Stack", "Array", "Linked List"],
          correctAnswer: 1,
          explanation: "Stack follows Last In First Out (LIFO) principle where the last element added is the first one to be removed."
        },
        {
          questionText: "What does 'null' represent in programming?",
          options: ["Zero value", "Empty string", "Absence of value", "Boolean false"],
          correctAnswer: 2,
          explanation: "Null represents the absence of any value or a null reference to an object."
        }
      ],
      'aptitude': [
        {
          questionText: "If 5x + 3 = 18, what is the value of x?",
          options: ["2", "3", "4", "5"],
          correctAnswer: 1,
          explanation: "5x + 3 = 18, so 5x = 15, therefore x = 3."
        },
        {
          questionText: "What is 15% of 200?",
          options: ["25", "30", "35", "40"],
          correctAnswer: 1,
          explanation: "15% of 200 = (15/100) × 200 = 30."
        },
        {
          questionText: "If a train travels 60 km in 1 hour, how far will it travel in 2.5 hours?",
          options: ["120 km", "130 km", "140 km", "150 km"],
          correctAnswer: 3,
          explanation: "Distance = Speed × Time = 60 × 2.5 = 150 km."
        }
      ],
      'technical': [
        {
          questionText: "What does HTTP stand for?",
          options: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Transport Protocol", "High Text Transfer Protocol"],
          correctAnswer: 0,
          explanation: "HTTP stands for HyperText Transfer Protocol, which is used for transferring web pages."
        },
        {
          questionText: "Which of the following is a relational database?",
          options: ["MongoDB", "Redis", "MySQL", "Cassandra"],
          correctAnswer: 2,
          explanation: "MySQL is a relational database management system that uses SQL for querying."
        },
        {
          questionText: "What is the default port for HTTPS?",
          options: ["80", "443", "8080", "3000"],
          correctAnswer: 1,
          explanation: "HTTPS uses port 443 by default for secure web communication."
        }
      ],
      'mathematics': [
        {
          questionText: "What is the derivative of x²?",
          options: ["x", "2x", "x²", "2"],
          correctAnswer: 1,
          explanation: "The derivative of x² is 2x using the power rule."
        },
        {
          questionText: "What is the value of sin(90°)?",
          options: ["0", "1", "-1", "0.5"],
          correctAnswer: 1,
          explanation: "sin(90°) = 1, which is the maximum value of the sine function."
        },
        {
          questionText: "What is the square root of 144?",
          options: ["10", "11", "12", "13"],
          correctAnswer: 2,
          explanation: "√144 = 12 because 12 × 12 = 144."
        }
      ]
    };

    return fallbackQuestions[category] || fallbackQuestions['coding'];
  }

  // Method to verify answers and calculate results
  async verifyAnswers(questions: Question[], studentAnswers: (number | null)[]): Promise<{
    score: number;
    totalMarks: number;
    correctAnswers: number;
    results: Array<{
      questionId: string;
      correct: boolean;
      studentAnswer: number | null;
      correctAnswer: number;
      marks: number;
    }>;
  }> {
    let score = 0;
    let correctAnswers = 0;
    const results = [];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const studentAnswer = studentAnswers[i];
      const isCorrect = studentAnswer === question.correctAnswer;

      if (isCorrect) {
        score += question.marks;
        correctAnswers++;
      }

      results.push({
        questionId: question.id,
        correct: isCorrect,
        studentAnswer,
        correctAnswer: question.correctAnswer,
        marks: isCorrect ? question.marks : 0
      });
    }

    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

    return {
      score,
      totalMarks,
      correctAnswers,
      results
    };
  }
}

export const aiService = new AIService();