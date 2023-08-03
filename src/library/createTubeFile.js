import { existsSync, mkdirSync, writeFileSync } from 'fs';

const createTubeFile = (name) => {
  try {
    if (!existsSync('./data')) mkdirSync('./data');
    const filePath = `./data/${name}.tube.txt`;
    if (!existsSync(filePath)) writeFileSync(filePath, '', 'utf8');
    return filePath;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export default createTubeFile;
