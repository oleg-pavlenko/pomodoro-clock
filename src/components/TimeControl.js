import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown, faArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

function TimeControl(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const arrowDown = <FontAwesomeIcon icon={faArrowDown} className="icon" />;
  const arrowUp = <FontAwesomeIcon icon={faArrowUp} className="icon" />;
  const { controlType } = props;
  function incrementSession() {
    if (appState.timerStatus === 'running') return;
    if (appState.sessionLength < 60) {
      appDispatch((draft) => {
        draft.sessionLength += 1;
      });
    }
  }

  function decrementSession() {
    if (appState.timerStatus === 'running') return;
    if (appState.sessionLength > 1) {
      appDispatch((draft) => {
        draft.sessionLength -= 1;
      });
    }
  }

  function incrementBreak() {
    if (appState.timerStatus === 'running') return;
    if (appState.breakLength < 60) {
      appDispatch((draft) => {
        draft.breakLength += 1;
      });
    }
  }

  function decrementBreak() {
    if (appState.timerStatus === 'running') return;
    if (appState.breakLength > 1) {
      appDispatch((draft) => {
        draft.breakLength -= 1;
      });
    }
  }
  return (
    <div className="time-control">
      <div id={`${controlType}-label`} className={`${controlType}-label`}>
        {controlType}
        {' '}
        Length
      </div>
      <button
        type="button"
        id={`${controlType}-decrement`}
        className="btn-lvl"
        onClick={controlType === 'session' ? decrementSession : decrementBreak}
      >
        {arrowDown}
      </button>
      <div id={`${controlType}-length`} className="btn-lvl">
        {
            controlType === 'session' ? appState.sessionLength : appState.breakLength
          }
      </div>
      <button
        type="button"
        id={`${controlType}-increment`}
        className="btn-lvl"
        onClick={controlType === 'session' ? incrementSession : incrementBreak}
      >
        {arrowUp}
      </button>
    </div>
  );
}

TimeControl.propTypes = {
  controlType: PropTypes.string.isRequired,
};

export default TimeControl;
