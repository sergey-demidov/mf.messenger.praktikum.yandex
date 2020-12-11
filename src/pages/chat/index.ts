import sue from '../../lib/sue.js';
import sInput from '../../components/input.js';
import sButton from '../../components/button.js';
import template from './template.js';

sue({
  template,
  data() {
    return {
    };
  },
  methods: {
    submitForm(formName: string): void {
      const form = document.forms.namedItem(formName);
      const formData = new FormData(form as HTMLFormElement);
      const res = Array.from(formData.entries()).reduce((memo, pair) => ({
        ...memo,
        [pair[0]]: pair[1],
      }), {});
      // eslint-disable-next-line no-console
      console.dir(res); // print result
    },
  },
  components: {
    's-input': sInput,
    's-btn': sButton,
  },
});
