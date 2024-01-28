import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css';

import Landing from './pages/Landing'
import Sidebar from './components/Sidebar';
import Courses from './pages/Courses';
import Inbox from './pages/Inbox';
import SignIn from './pages/SignIn';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <div className='flex'>
          <Sidebar className='flex-none' />
          <Routes>
            <Route path='/' index element={<Landing title={'LMS'} />} />
            <Route path='/courses' element={<Courses />} />
            <Route path='/inbox' element={<Inbox />} />
            <Route path='/signin' element={<SignIn />} />
          </Routes>
        </div>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
