import Tube from './tube.js';

const testTube = new Tube('test');


// let i = 0;
// while (i++ <= 145) {
//   testTube.put(`data-${i}`);
// }

(async () => {
  // let isconsume = await testTube.consume();

  // while (isconsume) {
  //   isconsume = await testTube.consume();
  //   console.log(isconsume);
  // }

  let i = 100;
  while (i-- > 0) {
    console.log(await testTube.consume());
  }

  console.log(testTube.putDataStack.length);
  console.log(testTube.lines.length);
  testTube.backup();
})();
