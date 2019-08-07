import React from 'react';
import FriendsList from './FriendsList';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

Enzyme.configure({ adapter: new Adapter() });

const props = {
    friendsList: [{
        id: '1',
        name: 'User1',
      },
      {
        id: '2',
        name: 'User2',
      },
    ],
    currentFriendId: '1'
  };

  
describe('Render <FriendsList /> Component', () => {
    it('should render without errors', () => {
        const wrapper = shallow(<FriendsList {...props} />);
        expect(wrapper.length).to.equal(1);
    });

    it('should render component elements', () => {
        const wrapper = shallow(<FriendsList {...props} />);
        expect(wrapper.find('div')).to.have.lengthOf(1);
        expect(wrapper.find('ul')).to.have.lengthOf(1);
        expect(wrapper.find('li')).to.have.lengthOf(2);
    });
});
