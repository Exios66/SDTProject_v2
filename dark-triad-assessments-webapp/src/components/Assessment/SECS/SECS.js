import React from 'react';
import { useAssessment } from '../../../hooks/useAssessment';
import './SECS.css';

function SECS() {
  const { questions, handleAnswer, submitAssessment } = useAssessment('SECS');

  return (
    <div className="secs">
      <h2>Short Everyday Sadism Scale (SECS) Assessment</h2>
      {questions.map((question, index) => (
        <div key={index} className="question">
          <p>{question.text}</p>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
          />
          <div className="range-labels">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>
      ))}
      <button onClick={submitAssessment}>Submit</button>
    </div>
  );
}

export default SECS;