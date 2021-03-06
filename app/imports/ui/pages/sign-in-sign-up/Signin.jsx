import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Button, Form, Grid, Header, Icon, Message, Segment } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';

/**
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
export default class Signin extends React.Component {

  /** Initialize component state with properties for login and redirection. */
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '', redirectToReferer: false };
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  /** Handle Signin submission using Meteor's account mechanism. */
  submit = () => {
    const { email, password } = this.state;
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        this.setState({ error: err.reason });
      } else {
        this.setState({ error: '', redirectToReferer: true });
      }
    });
  }

  /** Render the signin form. */
  render() {
    // if correct authentication, redirect to landing page instead of login screen
    if (this.state.redirectToReferer && Roles.userIsInRole(Meteor.userId(), 'admin')) {
      const { from } = this.props.location.state || { from: { pathname: '/admin' } };
      return <Redirect to={from}/>;
    }

    if (this.state.redirectToReferer) {
      const { from } = this.props.location.state || { from: { pathname: '/user-page' } };
      return <Redirect to={from}/>;
    }

    // Otherwise return the Login form.
    return (
        <div className='background-all'>
          <Grid centered container className='signin-page'>
            <Grid.Column>
              <div style={{
                marginRight: 'auto',
                marginLeft: 'auto',
                width: '35%',
                paddingBottom: '40px',
                paddingTop: '40px',
              }}>
                <Header as='h2' textAlign='center'>Sign-in</Header>
                <Segment padded color='grey'>
                  <Form onSubmit={this.submit}>
                    <Form.Input
                        label='Email'
                        icon='user'
                        iconPosition='left'
                        name='email'
                        type='email'
                        placeholder='Email Address'
                        onChange={this.handleChange}
                    />
                    <Form.Input
                        label='Password'
                        icon='lock'
                        iconPosition='left'
                        name='password'
                        placeholder='Password'
                        type='password'
                        onChange={this.handleChange}
                    />
                    <Form.Button primary animated>
                      <Button.Content visible>Submit</Button.Content>
                      <Button.Content hidden>
                        <Icon name='arrow right'/>
                      </Button.Content>
                    </Form.Button>
                  </Form>
                </Segment>
                <Message>
                  <Link to='/signup'>Not registered? Click here to Signup</Link>
                </Message>
                {this.state.error === '' ? (
                    ''
                ) : (
                    <Message
                        color='red'
                        error
                        header='Login was not successful'
                        content={this.state.error}
                    />
                )}
              </div>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

/** Ensure that the React Router location object is available in case we need to redirect. */
Signin.propTypes = {
  location: PropTypes.object,
};
