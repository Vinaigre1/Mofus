import * as express from 'express';
import { Request, Response } from 'express';
import * as fs from 'fs';

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
  // const wordFile = `${__dirname}/data/choosableWords.txt`;

  // fs.readFile(wordFile, 'utf-8', (err, data) => {
  //   if (err) throw err;

  //   const lines = data.split('\n');
  //   const randomLine = lines[Math.floor(Math.random() * lines.length)];
  //   const number = 0;

  //   res.send(`${number} ${randomLine}`);
  // });

  function treatAsUTC(date: Date): Date {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
  }
  
  function daysBetween(startDate: Date, endDate: Date): number {
    return (treatAsUTC(endDate).getTime() - treatAsUTC(startDate).getTime()) / (24 * 60 * 60 * 1000);
  }

  const startDate = new Date(2022, 5);
  const num = Math.floor(daysBetween(startDate, new Date()));
  const date = new Date();
  const month = (date.getMonth() + 1) as 1|2|3|4|5|6|7|8|9|10|11|12;
  const day = (date.getDate()) as 1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31;

  const words = {
    1: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17', 18: '18', 19: '19', 20: '20', 21: '21', 22: '22', 23: '23', 24: '24', 25: '25', 26: '26', 27: '27', 28: '28', 29: '29', 30: '30', 31: '31' },
    2: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17', 18: '18', 19: '19', 20: '20', 21: '21', 22: '22', 23: '23', 24: '24', 25: '25', 26: '26', 27: '27', 28: '28', 29: '29', 30: '', 31: '' },
    3: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17', 18: '18', 19: '19', 20: '20', 21: '21', 22: '22', 23: '23', 24: '24', 25: '25', 26: '26', 27: '27', 28: '28', 29: '29', 30: '30', 31: '31' },
    4: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17', 18: '18', 19: '19', 20: '20', 21: '21', 22: '22', 23: '23', 24: '24', 25: '25', 26: '26', 27: '27', 28: '28', 29: '29', 30: '30', 31: '' },
    5: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: 'ankama', 16: '16', 17: 'pandawa', 18: '18', 19: '19', 20: '20', 21: '21', 22: '22', 23: '23', 24: '24', 25: '25', 26: '26', 27: '27', 28: '28', 29: '29', 30: '30', 31: '31' },
    6: { 1: 'biblop', 2: 'harpille', 3: 'meno', 4: 'douzdoa', 5: 'tetanie', 6: 'blop', 7: 'dague', 8: 'assaut', 9: 'goulafre', 10: 'vetauran', 11: 'buveur', 12: 'atonie', 13: 'meulou', 14: 'vindicte', 15: 'yechti', 16: 'ginga', 17: 'envol', 18: 'orichor', 19: 'tourelle', 20: 'furia', 21: 'cuirasse', 22: 'vertu', 23: 'butor', 24: 'vulkania', 25: 'frigost', 26: 'wobot', 27: 'horize', 28: 'soryo', 29: 'nagate', 30: 'prytek', 31: '' },
    7: { 1: 'creation', 2: 'akwadala', 3: 'bombance', 4: 'compas', 5: 'imorok', 6: 'ouilleur', 7: 'grisou', 8: 'kawaii', 9: 'rappel', 10: 'gourlo', 11: 'peur', 12: 'prygen', 13: 'olgoth', 14: 'ocre', 15: 'arcanin', 16: 'dragon', 17: 'ethylo', 18: 'menace', 19: 'kwoan', 20: 'bouflouth', 21: 'gloot', 22: 'meupette', 23: 'maree', 24: 'trithon', 25: 'krokille', 26: 'choudini', 27: 'tison', 28: 'vetauran', 29: 'derobade', 30: 'erudit', 31: 'karne' },
    8: { 1: 'noctulule', 2: 'septange', 3: 'malterego', 4: 'grasmera', 5: 'pelage', 6: 'lifo', 7: 'nomekop', 8: 'espingole', 9: 'bouclier', 10: 'raillerie', 11: 'kanniboul', 12: 'nelween', 13: 'paradoxe', 14: 'feu', 15: 'synchro', 16: 'stimulant', 17: 'blerice', 18: 'robuste', 19: 'hardi', 20: 'mystique', 21: 'warko', 22: 'douzdoa', 23: 'eliotrope', 24: 'crapaud', 25: 'momistik', 26: 'milirat', 27: 'kaniglou', 28: 'arc', 29: 'cactana', 30: 'pandanlku', 31: 'hakam' },
    9: { 1: 'dofus', 2: 'tiwabbit', 3: 'pikbul', 4: 'silf', 5: 'gambaf', 6: 'yomi', 7: 'versatile', 8: 'misere', 9: 'armutin', 10: 'vertige', 11: 'piege', 12: 'chalutier', 13: 'stupeur', 14: 'vindeux', 15: 'boufbos', 16: 'feanor', 17: 'solfatare', 18: 'lucrane', 19: 'brutopak', 20: 'tacleur', 21: 'roukouto', 22: 'pryssion', 23: 'morph', 24: 'gruche', 25: 'nefileuse', 26: 'zombruth', 27: 'glyphe', 28: 'sak', 29: 'repli', 30: 'ecaflipus', 31: '' },
    10: { 1: 'kerigoule', 2: 'shigekax', 3: 'drakoalak', 4: 'minikrone', 5: 'demoloch', 6: 'diffusion', 7: 'tainela', 8: 'croleur', 9: 'fongeur', 10: 'ekarlatte', 11: 'ratrapry', 12: 'kaboom', 13: 'kwak', 14: 'halouine', 15: 'ombre', 16: 'chouque', 17: 'trefle', 18: 'tynril', 19: 'gobaladee', 20: 'outrage', 21: 'repulsif', 22: 'prysmaru', 23: 'gourlo', 24: 'ectorche', 25: 'afflux', 26: 'rempotage', 27: 'eau', 28: 'turquoise', 29: 'megabombe', 30: 'wakfu', 31: 'sramourai' },
    11: { 1: 'chacha', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17', 18: '18', 19: '19', 20: '20', 21: '21', 22: '22', 23: '23', 24: '24', 25: '25', 26: '26', 27: '27', 28: '28', 29: '29', 30: '30', 31: '' },
    12: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: 'nowel', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17', 18: '18', 19: '19', 20: '20', 21: '21', 22: '22', 23: '23', 24: '24', 25: '25', 26: '26', 27: '27', 28: '28', 29: '29', 30: '30', 31: '31' }
  };

  res.send(`${num} ${words[month][day]}`);
});

app.get('/', (req: Request, res: Response) => {
  res.sendFile(publicDir + '/index.html');
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
