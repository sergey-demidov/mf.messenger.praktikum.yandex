import sue from "../../lib/sue.js";
import sButton from "../../components/button.js";
import template from "./template.js";
const error500 = sue({
    name: 's-app-error500',
    template,
    components: {
        's-btn': sButton,
    },
});
export default error500;
//# sourceMappingURL=index.js.map