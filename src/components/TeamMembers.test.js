import React from 'react';
import TeamMembers from './TeamMembers';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

Enzyme.configure({ adapter: new Adapter() });

const props = {
    members: ["user1", "user2", "user3", "user4"]
};

  
describe('Render <TeamMembers /> Component', () => {
    it('should render without errors', () => {
        const wrapper = shallow(<TeamMembers {...props} />);
        expect(wrapper.length).to.equal(1);
    });

    it('should render component elements', () => {
        const wrapper = shallow(<TeamMembers {...props} />);
        expect(wrapper.find('div')).to.have.lengthOf(1);
        expect(wrapper.find('ul')).to.have.lengthOf(1);
        expect(wrapper.find('li')).to.have.lengthOf(4);
    });
});
