import './@types/chai';
import chai from 'chai';
import { createChaiObservableSpyPlugin } from '../spy';

chai.use(createChaiObservableSpyPlugin());

