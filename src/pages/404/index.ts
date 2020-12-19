import sue from '../../lib/sue.js';
import sButton from '../../components/button.js';
import template from './template.js';

const error404 = sue({
  name: 's-app-error404',
  template,
  components: {
    's-btn': sButton,
  },
});

export default error404;
