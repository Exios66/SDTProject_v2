import React, { createContext, useState, useCallback } from 'react';
import { ASSESSMENT_TYPES } from '../utils/constants';

export const AssessmentContext = createContext();

export const AssessmentProvider = ({ children }) => {
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState(null);

  const startAssessment = useCallback((assessmentType) => {
    if (!Object.values(ASSESSMENT_TYPES).includes(assessmentType)) {
      setError('Invalid assessment type');
      return;
    }
    setCurrentAssessment(assessmentType);
    setAnswers({});
    setError(null);
  }, []);

  const updateAnswer = useCallback((questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  }, []);

  const updateResults = useCallback((assessmentType, newResults) => {
    setResults((prevResults) => ({
      ...prevResults,
      [assessmentType]: newResults,
    }));
  }, []);

  const submitAssessment = useCallback(async () => {
    setLoading(true);
    try {
      // Send answers to the backend
      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assessmentType: currentAssessment, answers }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }

      const calculatedResults = await response.json();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate receiving results
      const simulatedResults = {
        score: Math.random() * 100,
        interpretation: 'This is a simulated interpretation.',
      };
      
      updateResults(currentAssessment, simulatedResults);
      setCurrentAssessment(null);
      setAnswers({});
    } catch (err) {
      setError('Failed to submit assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentAssessment, updateResults]);

  const value = {
    currentAssessment,
    startAssessment,
    answers,
    updateAnswer,
    results,
    submitAssessment,
    error,
    loading,
    assessmentResults,
    setAssessmentResults,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};

export default AssessmentProvider;