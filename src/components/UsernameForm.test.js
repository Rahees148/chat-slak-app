import React from 'react';
import UsernameForm from './UsernameForm';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Grid from  '@material-ui/core/Grid';

Enzyme.configure({ adapter: new Adapter() });

const store = {
    getState: () => "",
    subscribe: (a) => a,
    dispatch: (a) => a,
}

describe('Render <UsernameForm /> Component', () => {
    it('should render form without errors', () => {
        const usernameForm = shallow(<UsernameForm />);
        expect(usernameForm.length).to.equal(1);
    });

    it('should render material core', () => {
        const usernameForm = shallow(<UsernameForm />);
        expect(usernameForm.find(Grid)).to.have.lengthOf(2);
        expect(usernameForm.find(Typography)).to.have.lengthOf(1);
        expect(usernameForm.find(FormControl)).to.have.lengthOf(1);
        expect(usernameForm.find(Input)).to.have.lengthOf(1);
    });

    it('should change the username', () => {
        const usernameForm = shallow(<UsernameForm />);
        usernameForm.find(Input).simulate('change', {target: { value: 'new username'}});
        expect(usernameForm.state().username).to.equal('new username');
    });
});
