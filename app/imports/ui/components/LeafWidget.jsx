import React from 'react';
import PropTypes from 'prop-types';

// const menuStyle = { height: '500px' };
// const padding = { paddingTop: '100px' };

/** A simple static component to render some text for the landing page. */
class LeafWidget extends React.Component {

  render() {
    return (
        <div>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
               style={{ display: 'none' }}>
            <use xlinkHref={'http://www.w3.org/1999/xlink'}/>
            <symbol id="wave">
              <path
                  d="M420,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C514,6.5,518,4.7,528.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H420z"/>
              <path
                  d="M420,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C326,6.5,322,4.7,311.5,2.7C304.3,1.4,293.6-0.1,280,0c0,0,0,0,0,0v20H420z"/>
              <path
                  d="M140,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C234,6.5,238,4.7,248.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H140z"/>
              <path
                  d="M140,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C46,6.5,42,4.7,31.5,2.7C24.3,1.4,13.6-0.1,0,0c0,0,0,0,0,0l0,20H140z"/>
            </symbol>
          </svg>
          <div className="leaf-box">
            <div className="leaf-percent">
              <div className="percentNum">50</div>
              <div className="percentB">%</div>
            </div>
            <div style={{ transform: 'translateX(0) translateY(50%)' }} className="leaf-water">
              <svg viewBox="0 0 560 20" className="leaf-water_wave leaf-water_wave_back">
                <use href="#wave"/>
              </svg>
              <svg viewBox="0 0 560 20" className="leaf-water_wave leaf-water_wave_front">
                <use href="#wave"/>
              </svg>
            </div>
          </div>
        </div>
    );
  }
}

LeafWidget.propTypes = {
  userData: PropTypes.array.isRequired,
  userVehicles: PropTypes.array.isRequired,
};

export default LeafWidget;