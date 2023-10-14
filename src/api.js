import { fastify } from 'fastify';
import Tube from './tube.js';

const app = fastify();

/** @type {Object<string, Tube>} */
const tubes = {};


app.get('/tubes/:name', async (req, res) => {
  const { name } = req.params;
  if (!tubes[name]) {
    tubes[name] = new Tube(name);
  }
  if (req.query.size) {
    let size = 1;
    try {
      size = parseInt(req.query.size);
    } catch (err) {
      size = 1;
    }
    res.send(await tubes[name].consume(size));
    return;
  }

  res.send(await tubes[name].consume());
});

app.post('/tubes/:name', (req, res) => {
  const { name } = req.params;
  const body = req.body;
  if (!tubes[name]) {
    tubes[name] = new Tube(name);
  }
  if (req.query.spreading) {
    tubes[name].put(...body);
  } else tubes[name].put(body);
  res.send(true);
});

import { createInterface } from 'readline';
app.listen({ port: 5170 })
  .then(async (val) => {
    console.log(`Server Running on ${val}`);

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log('For close use `exit` right!.');

    const commandFn = {
      backup() {
        let backupTask = [];
        Object.keys(tubes).forEach(async (key) => {
          const tube = tubes[key];
          backupTask.push(tube.backup);
        });
        return Promise.all(backupTask);
      },
      async exit() {
        await this.backup();
        process.exit(1);
      }
    };
    const answerCb = async (answer) => {
      if (typeof commandFn[answer] == 'function') {
        await commandFn[answer]();
      }
      rl.question('your command: ', answerCb);
    };
    rl.question('your command: ', answerCb);
  });

