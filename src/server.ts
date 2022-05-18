import * as express from 'express';
import { Request, Response } from 'express';

const app = express();
const port = 8080;
const publicDir = `${__dirname}/public`;

app.use('/public', express.static(publicDir));

app.get('/list', (req: Request, res: Response) => {
  const partialFiles = ['dofus10.txt', 'dofus11.txt', 'dofus12.txt', 'dofus13.txt', 'dofus14.txt', 'dofus15.txt', 'dofus16.txt', 'dofus17.txt', 'dofus18.txt', 'dofus2.txt', 'dofus3.txt', 'dofus4.txt', 'dofus5.txt', 'dofus6.txt', 'dofus7.txt', 'dofus8.txt', 'dofus9.txt', 'french1.txt', 'french10.txt', 'french11.txt', 'french12.txt', 'french13.txt', 'french14.txt', 'french15.txt', 'french16.txt', 'french17.txt', 'french18.txt', 'french19.txt', 'french2.txt', 'french20.txt', 'french21.txt', 'french22.txt', 'french23.txt', 'french24.txt', 'french25.txt', 'french26.txt', 'french3.txt', 'french4.txt', 'french5.txt', 'french6.txt', 'french7.txt', 'french8.txt', 'french9.txt'];
  const wordsDir = `${__dirname}/data/partial`;

  const length = +req.query.length;
  const dictionary = req.query.dictionary;

  const chosenFile = `${dictionary}${length}.txt`;
  if (partialFiles.includes(chosenFile)) {
    res.sendFile(`${wordsDir}/${chosenFile}`);
  } else {
    res.send('not found');
  }
});

app.get('/wordoftheday', (req: Request, res: Response) => {
  res.send('dofus');
});

app.get('/', (req: Request, res: Response) => {
  res.sendFile(publicDir + '/index.html');
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
