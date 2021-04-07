import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Grid } from 'semantic-ui-react';
import { Bar } from 'react-chartjs-2';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import { Users } from '../../api/user/UserCollection';
import { DailyUserData } from '../../api/user/ghg-data/DailyUserDataCollection';
import PropTypes from 'prop-types';
import { getCumulativeGHG } from '../utilities/CumulativeGHGData';

// Displaying a pie chart of the mode of transportation from DailyUserData collection
const ComparisonGraphAll = (props) => {
    // NEXT: ADD CUMULATIVE, ADD POPUP THAT WARNS/CONGRATULATES USER BASED ON COMPARISON
    const date = new Date();
    const numUsers = _.size(props.users);
    const getByMonthAll = _.filter(props.userData, (userTrip) => { return (userTrip.inputDate.getMonth() ===
        date.getMonth() && userTrip.inputDate.getFullYear() === date.getFullYear()) });
    const allGHGData = getCumulativeGHG(getByMonthAll);
    export const allCO2Reduced = (allGHGData.cO2Reduced / numUsers).toFixed(2);
    export const allCO2Produced = (allGHGData.cO2Produced / numUsers).toFixed(2);
    const stateAll = {
        labels: ['Carbon Reduced', 'Carbon Produced'],
        datasets: [
            {
                label: 'Cumulative User GHG Data (Average)',
                backgroundColor: '#5c8d89',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: [allCO2Reduced, allCO2Produced],
            },
        ],
    };

    return (
        <Grid>
            <Grid.Column>
                <Bar data={stateAll}
                     height={300} width={500}
                     options={{
                         maintainAspectRatio: false,
                         title: {
                             display: true,
                             text: 'Community GHG Statistics',
                             fontSize: 30,
                         },
                         scales: {
                             yAxes: [{
                                 scaleLabel: {
                                     display: true,
                                     labelString: 'Pounds of CO2',
                                 },
                             }],
                             xAxes: [{
                                 scaleLabel: {
                                     display: true,
                                     labelString: 'GHG Data',
                                 },
                             }],
                         },
                     }}
                />
            </Grid.Column>
        </Grid>
    );
};

ComparisonGraphAll.propTypes = {
    userData: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
};

export default withTracker(() => {
    const subscription1 = Meteor.subscribe(DailyUserData.cumulativePublicationName);
    const subscription2 = Meteor.subscribe(Users.adminPublicationName);
    return {
        userData: DailyUserData.collection.find({}).fetch(),
        users: Users.collection.find({}).fetch(),
        ready: subscription1.ready() && subscription2.ready(),
    };
})(ComparisonGraphAll);