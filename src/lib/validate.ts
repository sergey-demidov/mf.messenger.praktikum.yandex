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
      max_32: { regexp: new RegExp(/^.{0,32}$/), message: 'maximum 32 characters' },
      no_spaces: { regexp: new RegExp(/^\S+$/), message: 'no spaces allowed' },
      letters_only: { regexp: new RegExp(/^[a-zа-яё]+$/i), message: 'only letters allowed' },
      no_special_chars: { regexp: new RegExp(/^[a-zа-яё0-9 ]+$/i), message: 'no special characters' },
      email: { regexp: new RegExp(/^\w+[\w-.]*@\w+([-.]\w+)*\.[a-z]{2,}$/i), message: 'need a valid e-mail address' },
      phone: { regexp: new RegExp(/^(8|\+7)\(?\d{3}\)?\d{3}[ -]?\d{2}[ -]?\d{2}$/), message: 'need a valid phone number' },
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
      const res = input.match(this.rules[r].regexp);
      if (!res || input !== res[0]) {
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
