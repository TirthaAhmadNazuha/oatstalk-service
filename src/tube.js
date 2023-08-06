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
  }

  put(...datas) {
    const write = datas.map((data) => `${JSON.stringify(data)}`);
    const exists = existsSync(this.path);
    if (exists && this.usageItemsCount < 5) {
      this.willWriteQueue.push(TryWarper(appendFile, this.path, ';' + write.join(';')));
      return;
    }
    TryWarper(writeFile, this.path, write.join(';'));
  }

  async consume() {
    if (this.lines.length <= 1 && existsSync(this.path)) {
      /** @type {[undefined, ReadStream]} */
      const [_, readStream] = await Promise.all([this.willWriteQueue.shift(), TryWarper(createReadStream, this.path)]);
      await new Promise((resolve) => {
        readStream.once('data', (chunk) => {
          const lines = chunk.toString().split(';').slice(0, -1);
          this.usageItemsCount += lines.length;
          this.lines.push(...lines.map((lin) => JSON.parse(lin)));
          resolve();
        });
      });
    }
    if (this.usageItemsCount >= 5) {
      this.willWriteQueue.push(new Promise((resolve) => {
        const fileData = readFileSync(this.path).toString().split(';').slice(this.usageItemsCount, 0);
        this.usageItemsCount = 0;
        if (fileData.length) {
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
