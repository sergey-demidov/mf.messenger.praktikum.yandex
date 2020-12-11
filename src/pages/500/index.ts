import sue from '../../lib/sue.js';
import sButton from '../../components/button.js';
import template from './template.js';

sue({
  template,
  components: {
    's-btn': sButton,
  },
});
