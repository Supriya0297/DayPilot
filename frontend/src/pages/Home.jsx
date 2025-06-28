import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to DayPilot</h1>
      <p>
        DayPilot is your personal task manager designed to help you stay organized, focused, and in control of your daily goals.
        Whether you're managing work tasks, study plans, or personal errands, DayPilot ensures nothing slips through the cracks.
      </p>
      <p>
        Start by creating a free account, log in securely, and begin adding your tasks. Edit, complete, or delete them as your day evolves.
        It’s simple, fast, and built with you in mind.
      </p>
      <p>
        Let's take your productivity to new heights—one task at a time!
      </p>
      <div className="get-started">
        <strong>✨ Get started by signing up or logging in from the navigation bar above.</strong>
      </div>
    </div>
  );
}

export default Home;
