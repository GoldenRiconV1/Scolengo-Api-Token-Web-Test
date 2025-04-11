import express from 'express';
import { Skolengo } from 'scolengo-api';
import cors from 'cors';
import path from 'path';

const app = express();
const CAS_CALLBACK = 'http://localhost:3000/auth/callback';

app.use(cors());
app.use(express.json());

// Sert le dossier 'public' comme répertoire statique
app.use(express.static(path.join('D:/1LycoDrive/Test/scolengo-token-web/public')));  // Chemin absolu

let selectedSchool;
let oidClient;

// Route pour chercher les écoles
app.get('/api/schools', async (req, res) => {
  const text = req.query.name;
  const schools = await Skolengo.searchSchool({ text }, 100);
  res.json(schools);
});

// Route pour l'authentification (redirige vers le login)
app.get('/auth', async (req, res) => {
  const schoolId = req.query.id;
  const school = JSON.parse(decodeURIComponent(req.query.school));
  selectedSchool = school;
  oidClient = await Skolengo.getOIDClient(school);
  const url = oidClient.authorizationUrl({
    redirect_uri: CAS_CALLBACK,
  });
  res.redirect(url);
});

// Route de callback après l'authentification
app.get('/auth/callback', async (req, res) => {
  const tokenSet = await oidClient.callback(CAS_CALLBACK, req.query);
  res.redirect(
    `/success.html?data=${encodeURIComponent(
      JSON.stringify({
        tokenSet,
        school: selectedSchool,
      })
    )}`
  );
});

// Route pour la page d'accueil (serve index.html)
app.get('/', (req, res) => {
  // Utilisation d'un chemin absolu "brut"
  res.sendFile('D:/1LycoDrive/Test/scolengo-token-web/public/index.html');  // Chemin absolu
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
