import pushLog from '../library/log.js';
import Tube from '../models/tube.js';

const tubes = {};

const tubesController = {
  consume(req, res) {
    try {
      const name = req.params.name;
      if (!tubes[name]) {
        tubes[name] = new Tube(name);
      }
      res.send(JSON.parse(tubes[name].consume()));
    } catch (err) {
      pushLog(err);
      throw err;
    }
  },

  put(req, res) {
    try {
      const { name } = req.params;
      const spread = Boolean(req.query.spread);
      const data = spread ? req.body.map((res) => JSON.stringify(res)) : req.body;
      if (!tubes[name]) {
        tubes[name] = new Tube(name);
      }
      res.send(spread ? tubes[name].put(...data) : tubes[name].put(data));
    } catch (err) {
      console.error(err);
      pushLog(err);
      throw err;
    }
  }
};

export default tubesController;
