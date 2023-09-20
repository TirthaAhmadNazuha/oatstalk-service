import { readFile, writeFile } from 'fs/promises';
import { appendFileSync, existsSync, unlinkSync, writeFileSync } from 'fs';

const Tube = class {
  constructor(name) {
    this.name = name;
    this.path = `./data/${name}_tube.txt`;
    /** @type {string[]} */
    this.lines = [];
    /** @type {Promise<void>[]} */
    this.willWriteQueue = [];
    this.usageItemsCount = 0;
    this.putDataStack = [];
    this.putDataStackLimit = 50;
    this.isLastConsumable = false;
    this.ipClients = new Set();
  }

  put(...datas) {
    this.putDataStack.push(...datas.map((data) => `${JSON.stringify(data)}`));
    if (this.putDataStack.length < this.putDataStackLimit) {
      return;
    }
    if (existsSync(this.path)) {
      appendFileSync(this.path, ';;' + this.putDataStack.join(';;'));
    } else writeFileSync(this.path, this.putDataStack.join(';;'));
    this.putDataStack = [];
  }

  async consume() {
    if (this.lines.length < 1) {
      await this.refileLinesFromFile();
    }
    return JSON.parse(this.lines.shift() || this.putDataStack.shift() || 'null');
  }

  async refileLinesFromFile() {
    if (existsSync(this.path)) {
      let fromFile = (await readFile(this.path)).toString().split(';;');
      this.lines = fromFile.slice(0, 200);
      fromFile = fromFile.slice(this.lines.length);
      const putData = this.putDataStack;
      this.putDataStack = [];
      const result = fromFile.concat(putData);
      if (result.length > 0) {
        await writeFile(this.path, result.join(';;'));
      } else unlinkSync(this.path);
    }
  }

  async backup() {
    if (this.putDataStack.length < 1 && this.lines.length < 1) {
      return;
    }
    if (existsSync(this.path)) {
      const fromFile = (await readFile(this.path)).toString();
      await writeFile(this.path, (this.lines.length > 0 ? this.lines.join(';;') + ';;' : '') + fromFile + (this.putDataStack.length > 0 ? ';;' + this.putDataStack.join(';;') : ''));
    } else {
      await writeFile(this.path, this.putDataStack.concat(this.lines).join(';;'));
    }
    this.lines = [];
    this.putDataStack = [];
  }
};

export default Tube;
