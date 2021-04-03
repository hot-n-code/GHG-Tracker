import React from 'react';
import { Grid, Segment, Header, Form, Loader } from 'semantic-ui-react';
import {
  AutoForm,
  TextField,
  SubmitField,
  NumField,
  SelectField,
} from 'uniforms-semantic';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { UserVehicle } from '../../../api/user/UserVehicleCollection';
import { Make } from '../../../api/vehicle/make/Make';
import { AllVehicle } from '../../../api/vehicle/AllVehicleCollection';

const paddingStyle = { padding: 20 };

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = () => new SimpleSchema({
    make: {
      type: String,
      allowedValues: [
        'Toyota',
        'Honda',
        'Nissan',
        'Tesla',
        'Ford',
        'Volkswagen',
      ],
    },
    model: String,
    price: Number,
    year: Number,
    fuelSpending: Number,
    // MPG: Number,
    // fuelSpending: Number,
    // type: {
    //   type: String,
    //   allowedValues: ['gas', 'ev', 'hybrid'],
    // },
  });

class CreateVehicle extends React.Component {
  getMPGType(make, model, year) {
    const search = {
      miles: '',
      type: '',
    };
    const totalCars = this.props.AllVehicles[0].Vehicles;
    const find = _.pluck(_.where(totalCars, { Make: make, Model: model, Year: year }), 'Mpg');
    search.miles = find[0];
    if (find[0] > 0) {
      search.type = 'Gas';
    } else {
      search.type = 'EV/Hybrid';
    }
    return [search.miles, search.type];
  }

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { make, model, price, year, fuelSpending } = data;
    const owner = Meteor.user().username;
    // LOGO
    const temp = _.pluck(Make.collection.find({ make: make }).fetch(), 'logo');
    const logo = temp[0];
    // MPG
    const get = this.getMPGType(make, model, year);
    const MPG = get[0];
    const type = get[1];
    UserVehicle.collection.insert(
        { make, model, logo, price, year, MPG, fuelSpending, type, owner },
        error => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Vehicle added successfully', 'success');
            formRef.reset();
          }
        },
    );
  }

  render() {
    return this.props.ready ? (
      this.renderPage()
    ) : (
      <Loader active>Getting data</Loader>
    );
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    const formSchema = makeSchema();
    const bridge = new SimpleSchema2Bridge(formSchema);
    let fRef = null;
    return (
      // <div className='background-all'>
      <div style={paddingStyle}>
        <Grid container centered>
          <Grid.Column>
            <Header as='h2' textAlign='center'>
              Create Vehicle
            </Header>
            <AutoForm
              ref={ref => {
                fRef = ref;
              }}
              schema={bridge}
              onSubmit={data => this.submit(data, fRef)}
            >
              <Segment>
                <Form.Group widths={'equal'}>
                  <SelectField name='make' />
                  <TextField
                    name='model'
                    showInlineError={true}
                    placeholder={'model of vehicle'}
                  />
                </Form.Group>
                <Form.Group widths={'equal'}>
                  <NumField
                    name='price'
                    showInlineError={true}
                    placeholder={'price of vehicle'}
                  />
                  <NumField
                    name='year'
                    showInlineError={true}
                    placeholder={'year'}
                  />
                </Form.Group>
                <Form.Group widths={'equal'}>
                  <NumField
                    name='fuelSpending'
                    showInlineError={true}
                    placeholder={'fuelSpending'}
                  />
                </Form.Group>
                <SubmitField value='Submit' />
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
      </div>
      // </div>
    );
  }
}

CreateVehicle.propTypes = {
  ready: PropTypes.bool.isRequired,
  AllVehicles: PropTypes.array.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(UserVehicle.userPublicationName);
  const sub2 = Meteor.subscribe(Make.userPublicationName);
  const sub3 = Meteor.subscribe(AllVehicle.userPublicationName);
  return {
    AllVehicles: AllVehicle.collection.find({}).fetch(),
    ready: sub1.ready() && sub2.ready() && sub3.ready(),
  };
})(CreateVehicle);