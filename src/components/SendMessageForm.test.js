import React from 'react';
import SendMessageForm from './SendMessageForm';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

Enzyme.configure({ adapter: new Adapter() });


describe('Render <SendMessageForm /> Component', () => {
    it('should render form without errors', () => {
        const sendFrom = shallow(<SendMessageForm />);
        expect(sendFrom.length).to.equal(1);
    });

    it('should render component elements', () => {
        const sendFrom = shallow(<SendMessageForm />);
        expect(sendFrom.find('div')).to.have.lengthOf(2);
        expect(sendFrom.find('form')).to.have.lengthOf(1);
        expect(sendFrom.find('input')).to.have.lengthOf(1);
    });
});
