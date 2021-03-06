import * as lodash from 'lodash';

export function renameField(record: any, fromName: string, toName: string) {
  const value = lodash.get(record, fromName);
  if (!lodash.isNil(value)) {
    lodash.set(record, toName, value);
  }
  lodash.unset(record, fromName);
}
