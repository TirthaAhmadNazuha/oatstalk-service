import { fastify } from 'fastify';
import tubesController from './controllers/tubesController.js';

const app = fastify();


app.get('/tubes/:name', tubesController.consume);

app.post('/tubes/:name', tubesController.put);

app.listen({ port: 8080, host: 'localhost' })
  .then((val) => console.log(val));
