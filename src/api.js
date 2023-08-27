import { fastify } from 'fastify';
import Tube from './tube.js';

const app = fastify();

/** @type {Object<string, Tube>} */
const tubes = {};


app.get('/tubes/:name', async (req, res) => {
  const { name } = req.params;
  if (!tubes[name]) {
    tubes[name] = new Tube(name);
    res.send(null);
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

app.listen({ port: 5170, host: 'localhost' })
  .then((val) => console.log(val));
