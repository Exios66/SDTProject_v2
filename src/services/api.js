import { TRAIT_TYPES } from '../constants/traitTypes';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export const fetchQuestions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/questions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

export const submitAssessment = async (answers) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/submit`, { answers });
    return response.data;
  } catch (error) {
    console.error('Error submitting assessment:', error);
    throw error;
  }
};

export function calculateTraitScore(answers, traitType) {
  return answers
    .filter(answer => answer.trait === traitType)
    .reduce((sum, answer) => sum + answer.score, 0);
};

const interpretScore = (score) => {
  // Implementation of score interpretation
  // This is a placeholder and should be replaced with actual logic
  if (score < 10) return 'Low';
  if (score < 20) return 'Average';
  return 'High';
};

export const processResults = (answers) => {
  // Calculate raw scores for each trait
  const rawScores = Object.values(TRAIT_TYPES).reduce((acc, traitType) => {
    acc[traitType] = calculateTraitScore(answers, traitType);
    return acc;
  }, {});

  // Interpret raw scores
  const interpretedScores = Object.entries(rawScores).reduce((acc, [traitType, score]) => {
    acc[traitType] = interpretScore(score);
    return acc;
  }, {});

  // Calculate percentiles (assuming we have a function for this)
  const percentiles = calculatePercentiles(rawScores);

  // Generate detailed analysis for each trait
  const traitAnalysis = Object.entries(rawScores).reduce((acc, [traitType, score]) => {
    acc[traitType] = generateTraitAnalysis(traitType, score, interpretedScores[traitType], percentiles[traitType]);
    return acc;
  }, {});

  // Calculate overall Dark Triad score
  const overallScore = calculateOverallScore(rawScores);

  // Generate personalized recommendations
  const recommendations = generateRecommendations(interpretedScores, percentiles);

  return {
    rawScores,
    interpretedScores,
    percentiles,
    traitAnalysis,
    overallScore,
    recommendations
  };
};

const calculatePercentiles = (rawScores) => {
  // This function would compare the raw scores to a normative sample
  // and return percentile ranks for each trait
  // Placeholder implementation:
  return Object.entries(rawScores).reduce((acc, [traitType, score]) => {
    acc[traitType] = Math.min(Math.round((score / 30) * 100), 100); // Assuming max score is 30
    return acc;
  }, {});
};

const generateTraitAnalysis = (traitType, rawScore, interpretation, percentile) => {
  return {
    trait: traitType,
    rawScore,
    interpretation,
    percentile,
    description: TRAIT_DESCRIPTIONS[traitType],
    implications: getTraitImplications(traitType, interpretation),
  };
};

const calculateOverallScore = (rawScores) => {
  const totalScore = Object.values(rawScores).reduce((sum, score) => sum + score, 0);
  const maxPossibleScore = Object.keys(rawScores).length * 30; // Assuming max score per trait is 30
  return (totalScore / maxPossibleScore) * 100;
};

const generateRecommendations = (interpretedScores, percentiles) => {
  const recommendations = [];

  Object.entries(interpretedScores).forEach(([traitType, interpretation]) => {
    const percentile = percentiles[traitType];
    const traitName = getTraitName(traitType);
    const traitDescription = getTraitDescription(traitType);

    let recommendation = `Your ${traitName} score is at the ${percentile}th percentile, which is considered ${interpretation.toLowerCase()}. ${traitDescription}\n\n`;

    switch (interpretation.toUpperCase()) {
      case 'LOW':
        recommendation += `While a low score in ${traitName} is generally positive, it's important to maintain a balance. Consider the following:\n`;
        recommendation += `- Develop assertiveness skills to ensure your needs are met in social situations.\n`;
        recommendation += `- Practice setting healthy boundaries in personal and professional relationships.\n`;
        recommendation += `- Explore ways to increase self-confidence without compromising your values.\n`;
        break;
      case 'AVERAGE':
        recommendation += `An average score in ${traitName} suggests a balanced approach. To maintain this balance:\n`;
        recommendation += `- Continue to practice empathy and consider others' perspectives.\n`;
        recommendation += `- Regularly reflect on your motivations and behaviors to ensure they align with your values.\n`;
        recommendation += `- Seek feedback from trusted friends or mentors to gain insights into your interpersonal dynamics.\n`;
        break;
      case 'HIGH':
        recommendation += `A high score in ${traitName} may present challenges in interpersonal relationships. Consider the following steps:\n`;
        recommendation += `- Engage in self-reflection to understand the root causes of these traits.\n`;
        recommendation += `- Practice empathy exercises to develop a stronger connection with others' emotions.\n`;
        recommendation += `- Seek professional help, such as therapy or counseling, to work on managing these traits effectively.\n`;
        recommendation += `- Focus on building genuine, mutually beneficial relationships rather than exploitative ones.\n`;
        break;
      default:
        recommendation += `Unable to provide specific recommendations for this score. Please consult with a mental health professional for personalized advice.\n`;
    }

    recommendation += `\nRemember, personality traits exist on a spectrum, and there's always room for personal growth and development.`;

    recommendations.push(recommendation);
  });

  return recommendations;
};

const getTraitImplications = (traitType, interpretation) => {
  const traitName = getTraitName(traitType);
  const implications = {
    MACHIAVELLIANISM: {
      LOW: `Your low level of Machiavellianism suggests you tend to be honest and straightforward in your interactions. This can lead to more genuine relationships, but you may sometimes struggle in competitive environments where others might take advantage of your transparency.`,
      AVERAGE: `Your average level of Machiavellianism indicates a balanced approach to social interactions. You can be strategic when necessary but generally prefer honest dealings. This balance can be beneficial in navigating complex social and professional situations.`,
      HIGH: `Your high level of Machiavellianism may lead you to frequently engage in manipulative behaviors. While this can sometimes be advantageous in achieving short-term goals, it often results in strained relationships and a lack of trust from others in the long run.`
    },
    NARCISSISM: {
      LOW: `Your low level of Narcissism suggests you may have a more modest self-view. While this can lead to more harmonious relationships, it might also result in undervaluing your own worth or contributions in certain situations.`,
      AVERAGE: `Your average level of Narcissism indicates a healthy self-esteem balanced with consideration for others. This can lead to confident decision-making while maintaining positive relationships.`,
      HIGH: `Your high level of Narcissism may result in an inflated sense of self-importance and a constant need for admiration. This can lead to difficulties in maintaining long-term relationships and may blind you to your own faults or areas for improvement.`
    },
    PSYCHOPATHY: {
      LOW: `Your low level of Psychopathy suggests high empathy and emotional responsiveness. While this often leads to strong, caring relationships, it may also make you more vulnerable to emotional manipulation or distress in high-pressure situations.`,
      AVERAGE: `Your average level of Psychopathy indicates a balance between empathy and emotional detachment. This can be beneficial in maintaining professional boundaries while still forming meaningful personal connections.`,
      HIGH: `Your high level of Psychopathy may manifest as a lack of empathy and disregard for others' feelings. This can lead to impulsive and potentially harmful decision-making, and difficulty in forming genuine emotional connections.`
    },
    SADISM: {
      LOW: `Your low level of Sadism suggests a strong aversion to causing others pain or discomfort. This often results in nurturing relationships but may sometimes lead to difficulty in asserting yourself or dealing with conflict.`,
      AVERAGE: `Your average level of Sadism indicates a normal range of assertiveness without deriving pleasure from others' pain. This balance allows for healthy boundary-setting without resorting to cruel behavior.`,
      HIGH: `Your high level of Sadism may manifest as a tendency to derive pleasure from others' pain or discomfort. This can severely impact your relationships and may lead to engaging in harmful or abusive behaviors.`
    }
  };

  if (!implications[traitType] || !implications[traitType][interpretation]) {
    console.error(`Invalid trait type or interpretation: ${traitType}, ${interpretation}`);
    return `Unable to provide specific implications for ${traitName}. Please consult with a mental health professional for personalized insights.`;
  }

  return implications[traitType][interpretation];
};

const getTraitActionItems = (traitType, interpretation) => {
  const traitName = getTraitName(traitType);
  const actionItems = {
    MACHIAVELLIANISM: {
      LOW: [
        "Practice assertiveness in professional settings without compromising your integrity",
        "Learn to recognize manipulative behaviors in others to protect yourself",
        "Develop strategic thinking skills for complex negotiations or conflicts"
      ],
      AVERAGE: [
        "Continue to balance honesty with strategic thinking in your interactions",
        "Reflect on your motivations regularly to ensure they align with your values",
        "Practice ethical decision-making in challenging situations"
      ],
      HIGH: [
        "Work on developing genuine empathy for others",
        "Practice transparent communication to build trust in your relationships",
        "Seek therapy to understand and manage manipulative tendencies"
      ]
    },
    NARCISSISM: {
      LOW: [
        "Practice self-affirmation and recognizing your own achievements",
        "Set personal goals and celebrate when you achieve them",
        "Learn to respectfully disagree with others when necessary"
      ],
      AVERAGE: [
        "Continue to balance self-confidence with humility",
        "Regularly seek and be open to feedback from others",
        "Practice active listening to further improve your relationships"
      ],
      HIGH: [
        "Practice empathy by actively trying to understand others' perspectives",
        "Seek honest feedback and work on accepting constructive criticism",
        "Engage in activities that promote humility and service to others"
      ]
    },
    PSYCHOPATHY: {
      LOW: [
        "Learn techniques to manage emotional overwhelm in stressful situations",
        "Practice setting healthy boundaries in your relationships",
        "Develop resilience strategies to cope with others' negative emotions"
      ],
      AVERAGE: [
        "Continue to balance empathy with emotional self-regulation",
        "Practice mindfulness to enhance your emotional awareness",
        "Seek feedback on your interpersonal skills and emotional responses"
      ],
      HIGH: [
        "Engage in empathy-building exercises, such as volunteering",
        "Seek professional help to develop emotional recognition and regulation skills",
        "Practice impulse control techniques to manage potentially harmful behaviors"
      ]
    },
    SADISM: {
      LOW: [
        "Learn assertiveness techniques to stand up for yourself when necessary",
        "Practice conflict resolution skills to address issues directly",
        "Develop strategies to maintain your compassion while setting firm boundaries"
      ],
      AVERAGE: [
        "Continue to practice empathy and kindness in your daily interactions",
        "Learn to recognize and manage any sadistic impulses that may arise",
        "Seek healthy outlets for competitive or aggressive feelings"
      ],
      HIGH: [
        "Seek immediate professional help to address sadistic tendencies",
        "Practice empathy-building exercises daily",
        "Engage in activities that promote compassion and kindness towards others"
      ]
    }
  };

  if (!actionItems[traitType] || !actionItems[traitType][interpretation]) {
    console.error(`Invalid trait type or interpretation: ${traitType}, ${interpretation}`);
    return [`Unable to provide specific action items for ${traitName}. Please consult with a mental health professional for personalized advice.`];
  }

  return actionItems[traitType][interpretation];
};

const getTraitImplicationsAndActions = (traitType, interpretation) => {
  const implications = getTraitImplications(traitType, interpretation);
  const actionItems = getTraitActionItems(traitType, interpretation);

  return {
    implications,
    actionItems
  };
};