import { appendFile, writeFile } from 'fs/promises';
import TryWarper from './utils/try_warper.js';
import { ReadStream, createReadStream, existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';

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
  }

  put(...datas) {
    this.putDataStack.push(...datas.map((data) => `${JSON.stringify(data)}`));
    if (this.putDataStack.length < this.putDataStackLimit) {
      return;
    }
    const exists = existsSync(this.path);
    if (exists) {
      this.willWriteQueue.push(TryWarper(appendFile, this.path, ';' + this.putDataStack.join(';')));
      this.putDataStack = [];
      return;
    }
    TryWarper(writeFile, this.path, this.putDataStack.join(';'));
    this.putDataStack = [];
  }

  async consume() {
    if (this.lines.length <= 1 && existsSync(this.path)) {
      /** @type {[undefined, ReadStream]} */
      const [_, readStream] = await Promise.all([this.willWriteQueue.shift(), TryWarper(createReadStream, this.path, { highWaterMaek: 1024 })]);
      await new Promise((resolve) => {
        readStream.once('data', (chunk) => {
          let lines = chunk.toString().split(';', 100);
          this.usageItemsCount += lines.length;
          if (this.isLastConsumable) {
            this.isLastConsumable = false;
            return null;
          }
          if (lines.length === 1) {
            this.isLastConsumable = true;
          }
          this.lines.push(...lines.map((lin) => JSON.parse(lin)));
          resolve();
        });
      });
    }

    if (this.putDataStack.length > 0 && !existsSync(this.path)) {
      console.log(true);
      this.lines.push(JSON.parse(this.putDataStack.shift()));
    }

    if (this.usageItemsCount >= this.putDataStackLimit) {
      this.willWriteQueue.push(new Promise((resolve) => {
        const fileData = readFileSync(this.path).toString().split(';').slice(this.usageItemsCount - 1);
        this.usageItemsCount = 0;
        if (fileData.length > 1) {
          writeFileSync(this.path, fileData.join(';'));
        } else unlinkSync(this.path);
        resolve();
      }));
      await this.willWriteQueue.shift();
    }

    return this.lines.shift() || null;
  }
};

export default Tube;
