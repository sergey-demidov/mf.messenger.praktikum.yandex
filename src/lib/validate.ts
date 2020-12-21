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
      min_6: { regexp: new RegExp(/^.{6,}$/), message: 'minimum 6 characters' },
      min_8: { regexp: new RegExp(/^.{8,}$/), message: 'minimum 8 characters' },
      no_spaces: { regexp: new RegExp(/^\S+$/), message: 'no spaces allowed' },
      letters_only: { regexp: new RegExp(/^[a-zа-яё]+$/i), message: 'only letters allowed' },
      email: { regexp: new RegExp(/^\w+[\w-.]*@\w+([-.]\w+)*\.[a-z]{2,}$/i), message: 'need a valid e-mail address' },
      phone: { regexp: new RegExp(/^\+?\d\(?\d{3}\)?\d([-\d]{8})|([\d]{5})\d$/), message: 'need a valid phone number' },
    };
  }

  validate(input: string, ruleset: string): validateResult {
    const result: validateResult = { valid: true, message: 'Ok' };
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
      if (!this.rules[r]) {
        throw new Error(`Cant validate: rule '${r}' dont exist`);
      }
      // regexp rules
      if (!input.match(this.rules[r].regexp)) {
        result.valid = false;
        result.message = this.rules[r].message;
        return false; // last every
      }
      return true; // next every
    });
    return result;
  }
}

export default Validate;
