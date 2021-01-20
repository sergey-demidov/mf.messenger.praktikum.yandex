import eventBus from './event-bus';
import { CONST } from './const';

interface rule {
  regexp: RegExp, message: string;
}
interface rules {
  [key: string]: rule;
}
interface validateResult {
  valid: boolean;
  message: string;
}

class Validate {
  protected rules: rules = {};

  private static instance: Validate;

  constructor() {
    if (Validate.instance) {
      return Validate.instance;
    }
    Validate.instance = this;
    this.rules = {
      pass: { regexp: new RegExp(/.*/), message: '' }, // default
      required: { regexp: new RegExp(/^.+$/), message: 'required' },
      no_spaces: { regexp: new RegExp(/^\S+$/), message: 'no spaces allowed' },
      letters_only: { regexp: new RegExp(/^[a-zа-яё]+$/i), message: 'only letters allowed' },
      no_special_chars: { regexp: new RegExp(/^[a-zа-яё0-9_+\-%#.@ ]+$/i), message: 'no special characters' },
      email: { regexp: new RegExp(/^\w+[\w-.]*@\w+([-.]\w+)*\.[a-z]{2,}$/i), message: 'need a valid e-mail address' },
      phone: { regexp: new RegExp(/^(8|\+7)\(?\d{3}\)?\d{3}[ -]?\d{2}[ -]?\d{2}$/), message: 'need a valid phone number' },
    };
  }

  validate(input: string, ruleset = CONST.pass): validateResult {
    const result: validateResult = { valid: true, message: 'Ok' };
    if (ruleset === CONST.pass || ruleset === '') return result;
    ruleset.split(' ').every((r) => {
      // "match:PassWorD" compare to another field
      const ruleMatch = r.match(/^match:(.*)/);
      if (ruleMatch) {
        const [, value] = ruleMatch;
        if (input !== value) {
          result.valid = false;
          result.message = 'passwords not match';
          return false; // last every
        }
        return true; // next every
      }

      const ruleMin = r.match(/^min_(\d+)/);
      if (ruleMin) {
        const [, min] = ruleMin;
        if (input.length < parseInt(min, 10)) {
          result.valid = false;
          result.message = `minimum ${min} characters`;
          return false; // last every
        }
        return true; // next every
      }

      const ruleMax = r.match(/^max_(\d+)/);
      if (ruleMax) {
        const [, max] = ruleMax;
        if (input.length > parseInt(max, 10)) {
          result.valid = false;
          result.message = `maximum ${max} characters`;
          return false; // last every
        }
        return true; // next every
      }

      if (!this.rules[r]) {
        throw new TypeError(`Cant validate: rule '${r}' dont exist`);
      }
      // regexp rules
      const res = input.match(this.rules[r].regexp);
      if (!res || input !== res[0]) {
        result.valid = false;
        result.message = this.rules[r].message;
        return false; // last every
      }
      return true; // next every
    });
    eventBus.emit(CONST.validateFinished, result.valid.toString());
    return result;
  }
}

export default Validate;
