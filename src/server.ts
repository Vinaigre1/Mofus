import * as express from 'express';
import { Request, Response } from 'express';

const app = express();
const port = 8080;
const publicDir = __dirname + '/public';

app.use('/public', express.static(publicDir));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(publicDir + '/index.html');
});

app.get('/list', (req: Request, res: Response) => {
  const length = +req.query.length;
  res.send(typeof length + '<br>' + length);
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
