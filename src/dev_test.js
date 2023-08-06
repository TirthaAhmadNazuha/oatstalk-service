import Tube from './tube.js';

const testTube = new Tube('test');

let i = 0;
while (i++ < 3260) {
  testTube.put(`data-${i}`);
}

(async () => {
  let isconsume = await testTube.consume();
  while (isconsume) {
    console.log(isconsume);
    isconsume = await testTube.consume();
  }
})();
