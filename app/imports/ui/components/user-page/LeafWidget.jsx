import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import { getCumulativeGHG } from '../../utilities/CumulativeGHGData';

/** A simple static component to render some text for the landing page. */
class LeafWidget extends React.Component {

  constructor(props) {
    super(props);
    this.data = getCumulativeGHG(this.props.userData, this.props.userVehicles);
    this.startPer = 0;
    this.endPer = ((this.data.cO2Reduced.toFixed(1) % 48) / 48) * 100;
    this.state = { percent: 0 };
  }

  componentDidMount() {
    this.elementID = setInterval(
        () => this.fill(),
        60,
    );
  }

  componentWillUnmount() {
    clearInterval(this.elementID);
  }

  fill() {
    if (this.startPer.toFixed(1) === this.endPer.toFixed(1)) {
      clearInterval(this.elementID);
    } else if (this.endPer - this.startPer <= 1) {
      this.setState({
        percent: this.startPer += 0.1,
      });
    } else {
      this.setState({
        percent: this.startPer += 1,
      });
    }
  }

  render() {
    return (
        <Card className={'leaf-card'} fluid>
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
          <Card.Content textAlign='center'>
            <Card.Description>
              <span className={'alt-vehicle-card-label'}>
                You are {this.endPer.toFixed(1)}% to saving another 48 lbs of CO2.
              </span>
              <br/>
              <span className={'alt-vehicle-card-label'}>
                It would take a tree one year to absorb more than 48 pounds of CO2!
              </span>
            </Card.Description>
            <div className="leaf-box">
              <div className="leaf-percent">
                <div className="percentNum">{this.startPer.toFixed(1)}</div>
                <div className="percentB">%</div>
              </div>
              <div style={{ transform: `translateX(0px) translateY(${100 - this.startPer}%)` }} className="leaf-water">
                <svg viewBox="0 0 560 20" className="leaf-water_wave leaf-water_wave_back">
                  <use href="#wave"/>
                </svg>
                <svg viewBox="0 0 560 20" className="leaf-water_wave leaf-water_wave_front">
                  <use href="#wave"/>
                </svg>
              </div>
            </div>
            <Card.Description className={'alt-vehicle-card-label'}>
            <span className={'alt-vehicle-card-label'}>
              You&apos;ve saved {this.data.cO2Reduced.toFixed(1)} lb(s) of CO2 gas so far,
              which would&apos;ve taken ~{(this.data.cO2Reduced / 48).toFixed(0)} tree(s) to absorb that much CO2 in a year!
            </span>
            </Card.Description>
          </Card.Content>
        </Card>
    );
  }
}

LeafWidget.propTypes = {
  userData: PropTypes.array.isRequired,
  userVehicles: PropTypes.array.isRequired,
};

export default LeafWidget;
