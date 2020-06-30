import React, { useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay, faPause, faSync,
} from '@fortawesome/free-solid-svg-icons';

import StateContext from './StateContext';
import DispatchContext from './DispatchContext';
import TimeControl from './components/TimeControl';
import './App.css';

function App() {
  const [state, updateState] = useImmer({
    sessionLength: 25,
    breakLength: 5,
    timerStatus: 'stopped',
    timerLabel: 'Session',
    time: 1500,
  });
  const timerToClear = useRef(false);
  const playIcon = <FontAwesomeIcon icon={faPlay} className="icon" />;
  const pauseIcon = <FontAwesomeIcon icon={faPause} className="icon" />;
  const syncIcon = <FontAwesomeIcon icon={faSync} className="icon" />;

  function handleControls() {
    if (state.timerStatus === 'stopped') {
      updateState((draft) => {
        draft.timerStatus = 'running';
      });
    } else {
      updateState((draft) => {
        draft.timerStatus = 'stopped';
      });
    }
  }

  function handleTime() {
    let minutes = Math.floor(state.time / 60);
    let seconds = state.time - minutes * 60;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
  }

  function reset() {
    updateState((draft) => {
      draft.sessionLength = 25;
      draft.breakLength = 5;
      draft.timerStatus = 'stopped';
      draft.timerLabel = 'Session';
      draft.time = 1500;
    });
  }

  useEffect(() => {
    if (state.timerLabel === 'Session') {
      updateState((draft) => {
        draft.time = state.sessionLength * 60;
      });
    }
  }, [state.sessionLength, state.timerLabel, updateState]);

  useEffect(() => {
    if (state.timerLabel === 'Break') {
      updateState((draft) => {
        draft.time = state.breakLength * 60;
      });
    }
  }, [state.breakLength, state.timerLabel, updateState]);

  useEffect(() => {
    function decrementTimer() {
      updateState((draft) => {
        draft.time -= 1;
      });
    }
    function switchPhase(length, phase) {
      updateState((draft) => {
        draft.time = length;
        draft.timerLabel = phase;
      });
    }
    if (state.timerStatus === 'running') {
      timerToClear.current = setInterval(() => {
        decrementTimer();
      }, 1000);
    }
    const timer = state.time;
    if (timer < 0) {
      if (state.timerLabel === 'Session') {
        if (timerToClear) clearInterval(timerToClear);
        switchPhase(state.breakLength * 60, 'Break');
      } else {
        if (timerToClear) clearInterval(timerToClear);
        switchPhase(state.sessionLength * 60, 'Session');
      }
    }
    return () => clearInterval(timerToClear.current);
  }, [state, updateState]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={updateState}>
        <div className="App">
          <div className="title">Pomodoro Clock</div>
          <div className="controls">
            <TimeControl controlType="break" />
            <TimeControl controlType="session" />
          </div>
          <div className="timer">
            <div className="timer-wrapper">
              <div id="timer-label">{state.timerLabel}</div>
              <div id="time-left" className="time-left">
                {handleTime()}
              </div>
            </div>
          </div>
          <div className="timer-controls">
            <button type="button" id="start_stop" onClick={handleControls}>
              {playIcon}
              {pauseIcon}
            </button>
            <button type="button" id="reset" onClick={reset}>
              {syncIcon}
            </button>
          </div>
        </div>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
