import React from 'react';
import TeamList from './TeamList';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

Enzyme.configure({ adapter: new Adapter() });

const props = {
    userTeams: [{
        id: '1',
        name: 'Room 1',
        isPrivate: false
      }],
    currentTeamId: '1'
  };

  
describe('Render <TeamList /> Component', () => {
    it('should render without errors', () => {
        const wrapper = shallow(<TeamList {...props} />);
        expect(wrapper.length).to.equal(1);
    });

    it('should render component elements', () => {
        const wrapper = shallow(<TeamList {...props} />);
        expect(wrapper.find('div')).to.have.lengthOf(1);
        expect(wrapper.find('ul')).to.have.lengthOf(1);
        expect(wrapper.find('li')).to.have.lengthOf(1);
    });
});
