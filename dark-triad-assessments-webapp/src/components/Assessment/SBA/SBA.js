import React from 'react';
import { useAssessment } from '../../../hooks/useAssessment';
import './SBA.css';

function SBA() {
  const { questions, handleAnswer, submitAssessment } = useAssessment('SBA');

  return (
    <div className="sba">
      <h2>Short Buss-Perry Aggression Questionnaire (SBA) Assessment</h2>
      {questions.map((question, index) => (
        <div key={index} className="question">
          <p>{question.text}</p>
          <div className="true-false-buttons">
            <button onClick={() => handleAnswer(question.id, true)}>True</button>
            <button onClick={() => handleAnswer(question.id, false)}>False</button>
          </div>
        </div>
      ))}
      <button onClick={submitAssessment}>Submit</button>
    </div>
  );
}

export default SBA;