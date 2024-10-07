import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const assessments = [
    { id: 'sdt3', name: 'Short Dark Triad (SDT3)', description: 'Measures Machiavellianism, Narcissism, and Psychopathy' },
    { id: 'dirty-dozen', name: 'Dirty Dozen', description: 'A brief measure of the Dark Triad personality traits' },
    { id: 'sdt4', name: 'Short Dark Tetrad (SDT4)', description: 'Measures Machiavellianism, Narcissism, Psychopathy, and Sadism' },
    { id: 'mach-iv', name: 'MACH IV', description: 'Assesses Machiavellianism' },
    { id: 'mmpi', name: 'MMPI-style Assessment', description: 'Focuses on psychiatric disorder traits' },
    { id: 'hexaco', name: 'HEXACO Personality Assessment', description: 'Measures six personality traits' },
    { id: 'ocean', name: 'OCEAN (Big Five) Personality Assessment', description: 'Measures five major personality traits' }
  ];

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Dark Triad Assessments</h1>
        <p>Explore various personality assessments related to the Dark Triad and other psychological traits.</p>
      </header>
      
      <main className="home-main">
        <section className="assessment-list">
          <h2>Available Assessments:</h2>
          <ul>
            {assessments.map((assessment) => (
              <li key={assessment.id}>
                <Link to={`/${assessment.id}`}>
                  <h3>{assessment.name}</h3>
                  <p>{assessment.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        
        <section className="disclaimer">
          <h3>Disclaimer</h3>
          <p>
            These assessments are for educational and entertainment purposes only. 
            They are not substitutes for professional psychological evaluation. 
            If you have concerns about your mental health, please consult with a qualified mental health professional.
          </p>
        </section>
      </main>
      
      <footer className="home-footer">
        <p>&copy; 2023 Dark Triad Assessments. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;