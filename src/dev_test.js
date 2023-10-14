import Tube from './tube.js';

const testTube = new Tube('test');


let i = 0;
while (i++ <= 10) {
  testTube.put(`data-${i}`);
}

(async () => {
  // let isconsume = await testTube.consume(5);

  // while (isconsume) {
  //   console.log(isconsume);
  //   isconsume = await testTube.consume(5);
  // }
  // console.log(isconsume);

  console.log('\n--\n');
  // let i = 6;
  // while (i-- > 0) {
  //   console.log(await testTube.consume(3));
  // }

  await testTube.backup();
  console.log(testTube.putDataStack.length);
  console.log(testTube.lines.length);
})();
