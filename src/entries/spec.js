import 'source-map-support/register';
import 'babel-polyfill';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

let testsContext = require.context('../', true, /^.+\.spec\.js$/);
testsContext.keys().forEach(testsContext);
