import React from 'react';
import { Grid, Header, Container, Loader, Card, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Users } from '../../../api/user/UserCollection';
import { UserDailyData } from '../../../api/user/UserDailyDataCollection';
import ProfileCard from '../../components/user-page/ProfileCard';
import MyDataChart from '../../components/user-page/MyDataChart';
import MyNumbers from '../../components/user-page/MyNumbers';
import { UserVehicles } from '../../../api/user/UserVehicleCollection';
import AltVehicleCard from '../../components/user-page/AltVehicleCard';
import LeafWidget from '../../components/user-page/LeafWidget';

const paddingStyle = { padding: 20 };
/** Renders the Page for displaying the user's data: Their numbers for the day, overview of their carbon footprint, and
 * users may also edit their data of their entries.
 * */
class UserPage extends React.Component {

    render() {
        return (this.props.ready) ? this.renderPage() : <Loader active>Getting your data...</Loader>;
    }

    renderPage() {
        const date = new Date();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
            'October', 'November', 'December'];
        return (
            <div className='background-all' id='profile-page'>
            <Container style={paddingStyle}>
                <Grid>
                    <Grid.Column width={16} textAlign='center'>
                        <Header as='h1'>My {months[date.getMonth()]} {date.getFullYear()} Statistics
                        </Header>
                    </Grid.Column>
                </Grid>
                <Grid stackable columns={2}>
                    <Grid.Column>
                        <ProfileCard profile={this.props.users}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Card fluid>
                            <Card.Content>
                              <Header as='h1' textAlign='center' style={{ margin: '10px' }}>This Month&apos;s
                                Mileage Summary</Header>
                              <MyDataChart userData={this.props.dailyData} vehicles={this.props.vehicles}/>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid>
              <Grid stackable columns={2}>
                <Grid.Column>
                  <AltVehicleCard userData={this.props.dailyData} userVehicles={this.props.vehicles}/>
                </Grid.Column>
                <Grid.Column>
                  <LeafWidget userData={this.props.dailyData} userVehicles={this.props.vehicles}/>
                </Grid.Column>
              </Grid>
              <div style={{ paddingTop: '30px' }}/>
              <MyNumbers dailyData={this.props.dailyData} vehicles={this.props.vehicles}/>
                <div style={{ paddingTop: '30px' }}/>
                <Grid>
                  <Grid.Column width={16} textAlign='center'>
                      <Card fluid>
                          <Card.Content>
                              <Header as='h1'>Compare your numbers to the community!
                              </Header>
                              <Button id='link-to-compare-page' color='black' size='medium' as={ NavLink } activeClassName='active' exact
                                      to='/comparison'>Compare</Button>
                          </Card.Content>
                      </Card>
                   </Grid.Column>
                </Grid>
            </Container>
            </div>
        );
    }
}

UserPage.propTypes = {
    users: PropTypes.object,
    vehicles: PropTypes.array.isRequired,
    dailyData: PropTypes.array.isRequired,
    ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
    const ready = UserDailyData.subscribeUserDailyData().ready() &&
        Users.subscribeUser().ready() &&
        UserVehicles.subscribeUserVehicle().ready();
    const dailyData = UserDailyData.find({}, {}).fetch();
    const users = Users.findOne({}, {});
    const vehicles = UserVehicles.find({}, {}).fetch();
    return {
        dailyData,
        users,
        vehicles,
        ready,
    };
})(UserPage);
