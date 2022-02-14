import React from 'react';
import './App.css';
import { Navigator } from "../Navigator/Navigator";

const App: React.FC = () => {
  return <Navigator />;
}

export default App;

/*
IDEAS:
- When a respondent's name is selected, you can see their availability
- When an event is out of view, display a marker indicating that there is something 
  or below 
- When you hover over a 15minute time slot, it enboldends the names of the respondents
  available at that time.

*/
