import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import SDT4 from './components/assessments/SDT4/SDT4';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/sdt4" component={SDT4} />
            <Route path="/hexaco" component={HEXACO} />
            <Route path="/dark-triad" component={DarkTriad} />
            <Route path="/big-five" component={BigFive} />
            <Route path="/narcissism" component={Narcissism} />
            <Route path="/machiavellianism" component={Machiavellianism} />
            <Route path="/psychopathy" component={Psychopathy} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;