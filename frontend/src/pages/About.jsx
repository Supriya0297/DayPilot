import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1>About DayPilot - Your Smart ToDo App</h1>
      <p>
        DayPilot is a lightweight, user-friendly ToDo management application designed to simplify your daily productivity. 
        Whether you're a student, professional, or anyone in between, DayPilot helps you keep track of your tasks, stay organized, and never miss a deadline.
      </p>

      <h2>Key Features</h2>
      <ul className="features-list">
        <li>✅ Secure Sign-Up & Login using FastAPI and SQLite backend</li>
        <li>📝 Create, update, and delete your tasks easily</li>
        <li>⏰ Task tracking with due dates for better time management</li>
        <li>🧠 Simple UI built using React, styled with custom CSS</li>
        <li>🔐 Session-based authentication for secure access</li>
      </ul>

      <div className="about-footer">
        <p><strong>Technologies Used:</strong> React · FastAPI · SQL</p>
        <p>Developed with ❤️ by Supriya</p>
      </div>
    </div>
  );
}

export default About;
