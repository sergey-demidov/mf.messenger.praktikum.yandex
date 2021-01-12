import sue from '../../lib/sue';
import sButton from '../../components/button';
import template from './400-template';

const error404 = sue({
  name: 's-app-error404',
  template,
  data() {
    return {
      array: ['one', 'two', 'three'],
    };
  },
  components: {
    's-btn': sButton,
  },
});

export default error404;
