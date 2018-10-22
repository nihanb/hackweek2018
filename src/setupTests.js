// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// Global test environment
const { JSDOM } = require('jsdom');
const document = new JSDOM('hello world');
global.window = document.defaultView;
