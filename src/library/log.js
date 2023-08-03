import { appendFileSync } from 'fs';

const pushLog = (err) => {
  err.stack = err.stack.replaceAll('\n', '').replaceAll('   ', '');
  appendFileSync('./log/error.log.txt', `ERROR: ${err.message} ON ${err.stack}\n`);
};

export default pushLog;
