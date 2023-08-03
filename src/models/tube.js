import createTubeFile from '../library/createTubeFile.js';
import { appendFileSync, readFileSync, unlinkSync, writeFile } from 'fs';
import pushLog from '../library/log.js';

const Tube = class {
  constructor(name) {
    this.name = name;
    this.path = createTubeFile(name);
  }

  /**
   * @param {string[]} data 
   */
  put(...data) {
    if (this.path === null) {
      this.path = createTubeFile(this.name);
    }
    appendFileSync(this.path, data.join(';') + ';');
    return true;
  }

  removeFile() {
    unlinkSync(this.path);
    this.path = null;
    return null;
  }

  consume() {
    if (this.path === null) return null;
    try {
      const data = readFileSync(this.path, { encoding: 'utf-8' }).toString();
      const i = data.indexOf(';');
      const result = data.slice(0, i);
      writeFile(this.path, data.slice(i + 1), (err) => {
        if (err) throw err;
      });
      return result || this.removeFile();
    } catch (err) {
      pushLog(err);
      return null;
    }
  }
};

export default Tube;
