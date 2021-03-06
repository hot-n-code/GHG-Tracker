import React from 'react';
import { Grid, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { UserDailyData } from '../../../api/user/UserDailyDataCollection';
import CumulativeCard from './CumulativeCard';
import { getCumulativeGHG } from '../../utilities/CumulativeGHGData';
import { UserVehicles } from '../../../api/user/UserVehicleCollection';

class CumulativeDataCard extends React.Component {

  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting your data...</Loader>;
  }

  renderPage() {
      const sumData = (arr, key) => _.reduce(_.pluck(arr, key), function (sum, num) { return sum + num; }, 0).toFixed(1);

      const CalculateCumulative = (userDaily, impactArr) => {
        const altTransportation = ['Biking', 'Carpool', 'Public Transportation', 'Telework', 'Walking'];
        const userData = userDaily;
        const eImpact = impactArr;
        const altData = [];
        const gasData = [];
        let x = 0;
        let i = 0;
        userData.map((collectionData) => {
          if (altTransportation.includes(collectionData.modeOfTransportation)) {
            altData[i] = collectionData;
            i++;
          } else if (collectionData.cO2Reduced > 0) {
            altData[i] = collectionData;
            i++;
          } else {
            gasData[x] = collectionData;
            x++;
          }
          return altData;
      });
        const cumulativeGHG = getCumulativeGHG(this.props.userDailyData, this.props.vehicles);
        eImpact[0].data = sumData(altData, 'milesTraveled');
        eImpact[1].data = cumulativeGHG.cO2Reduced.toFixed(1);
        eImpact[2].data = cumulativeGHG.cO2Produced.toFixed(1);
        eImpact[3].data = cumulativeGHG.fuelSaved.toFixed(1);
        return eImpact;
    };

    const eImpactData = [
      {
        title: 'Vehicle Miles Travel Reduced',
        img: '/images/colored-clipart/car3.png',
        data: '0',
      },
      {
        title: 'Green House Gas (GHG) Reduced',
        img: '/images/colored-clipart/2.png',
        data: '0',
      },
      {
        title: 'Green House Gas (GHG) Produced',
        img: '/images/colored-clipart/5.png',
        data: '0',
      },
      {
        title: 'Gallons of Gas Saved',
        img: '/images/colored-clipart/3.png',
        data: '0',
      },

    ];

    const data = CalculateCumulative(this.props.userDailyData, eImpactData);

    return (
        <div style={{ paddingTop: '20px' }}>
          <Header as='h1' textAlign='center'>
            ENVIRONMENTAL IMPACT
            <br/>
          </Header>
          <Grid stackable columns={4}>
            {data.map((user, index) => (
                <Grid.Column key={index}>
                  <CumulativeCard user={user}/>
                </Grid.Column>
            ))}
          </Grid>
        </div>
    );
  }
}
CumulativeDataCard.propTypes = {
  userDailyData: PropTypes.array.isRequired,
  vehicles: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const ready = UserDailyData.subscribeUserDailyData().ready() &&
      UserVehicles.subscribeUserVehicleCumulative().ready();
  const userDailyData = UserDailyData.find({}).fetch();
  const vehicles = UserVehicles.find({}).fetch();
  return {
    userDailyData,
    vehicles,
    ready,
  };
})(CumulativeDataCard);
