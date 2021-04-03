import React from 'react';
import { Button, Card, Header, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import EditProfile from './EditProfile';
import AddDailyData from '../user-data-page/AddDailyData';
import WhatIf from '../user-data-page/WhatIf';

// Renders the profile card component containing the user's data
const ProfileCard = ({ profile }) => (
    <Card fluid >
        <Card.Content textAlign='center' style={{ margin: '10px' }}>
            <Image circular style={{ display: 'block',
                margin: '10px auto', height: '325px', width: '325px' }}
                   src={profile.image} />
                   <Card.Header style={{ margin: '7px' }}>
                       <Header as='h1'>{profile.name}</Header>
                   </Card.Header>
            <Card.Meta>
                <Header as='h4'>Email: {profile.email}</Header>
            </Card.Meta>
            <Card.Meta>
                <Header as='h4'>My Goal: {profile.goal}
                </Header>
            </Card.Meta>
          <div>
            <EditProfile profileID={profile._id}/>
            <AddDailyData/>
            <WhatIf/>
            <Button as={NavLink} activeClassName="active" exact
                    to="/history">History</Button>
          </div>
        </Card.Content>
    </Card>
);

// Require a document to be passed to this component
ProfileCard.propTypes = {
    profile: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    goal: PropTypes.string,
    _id: PropTypes.string,
    }).isRequired,
};

export default withRouter(ProfileCard);