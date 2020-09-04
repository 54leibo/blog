import React from 'react';
// import logo from './logo.svg';
import './App.css';
import HomePage from './pages/HomePage'
import DetailPage from './pages/DetailPage'
import MembersPage from './pages/MembersPage'
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { BrowserRouter as Router, Route, Link } from '../index'

function App() {
  return (
    <div className="App">
      <h1>react-route-dom</h1>
      <Router>
        <Link to='/'>HomePage</Link> | 
        <Link to='/detail'>DetailPage</Link> | 
        <Link to='/members'>MembersPage</Link> | 

        <Route exact path='/' component={HomePage} />
        <Route path='/detail' component={DetailPage} />
        <Route path='/member' component={MembersPage} />
      </Router>
    </div>
  );
}

export default App;
