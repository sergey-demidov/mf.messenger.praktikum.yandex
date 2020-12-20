import sue from '../../lib/sue';
import sButton from '../../components/button';
import template from './template';

const error500 = sue({
  name: 's-app-error500',
  template,
  components: {
    's-btn': sButton,
  },
});

export default error500;
