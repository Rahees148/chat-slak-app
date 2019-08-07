import React from 'react';
import MessageList from './MessageList';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

Enzyme.configure({ adapter: new Adapter() });

const props = {
    messages: [{
        senderId: '1',
        text: 'Hello',
      },
      {
        senderId: '2',
        text: 'How are you?',
      },
    ],
    currentUser: '11'
  };

  
describe('Render <MessageList /> Component', () => {
    it('should render without errors', () => {
        const wrapper = shallow(<MessageList {...props} />);
        expect(wrapper.length).to.equal(1);
    });

    it('should render component elements', () => {
        const wrapper = shallow(<MessageList {...props} />);
        expect(wrapper.find('ul')).to.have.lengthOf(1);
        expect(wrapper.find('li')).to.have.lengthOf(2);
    });
});
