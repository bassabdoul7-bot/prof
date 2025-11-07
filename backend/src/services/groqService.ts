import Groq from 'groq-sdk';

export interface SolveOptions {
  subject: string;
  level: string;
  mode: 'full' | 'hints' | 'check';
  isPremium: boolean;
}

function getGroqClient() {
  return new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
}

export async function solveWithGroq(
  problem: string,
  options: SolveOptions,
  conversationHistory: any[] = []
) {
  const groq = getGroqClient();
  const systemPrompt = createSystemPrompt(options);
  
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-6),
    { role: 'user', content: problem }
  ];

  const response = await groq.chat.completions.create({
    model: options.isPremium ? 'llama-3.3-70b-versatile' : 'llama-3.1-8b-instant',
    messages,
    temperature: 0.7,
    max_tokens: options.isPremium ? 2048 : 1024
  });

  return response.choices[0]?.message?.content || '';
}

function createSystemPrompt(options: SolveOptions): string {
  let modeInstruction = '';
  
  if (options.mode === 'full') {
    modeInstruction = 'MODE: Solution Complete Guidee. Tu RESOUS le probleme completement etape par etape. Structure: 1. Etat du probleme et objectif 2. Etapes numerotees avec explications 3. Reponse finale 4. Verification 5. Methode a retenir';
  } else if (options.mode === 'hints') {
    modeInstruction = 'MODE: Indices Progressifs. Donne des INDICES, pas la solution complete. Pose des questions qui guident vers la reponse.';
  } else {
    modeInstruction = 'MODE: Verification de Solution. Verifie si la reponse de l\'eleve est correcte. Si correct: felicite. Si incorrect: identifie l\'erreur.';
  }

  const levelInfo = getLevelInfo(options.level);

  return 'Tu es un excellent tuteur educatif pour les eleves senegalais. IMPORTANT: Sois PRECIS et EXACT dans tes explications. Verifie toujours tes formules et termes. Par exemple: pour un rectangle (2D), on utilise largeur et longueur, PAS hauteur (hauteur est pour 3D). Tu es un excellent tuteur educatif pour les eleves senegalais. PHILOSOPHIE: Tu RESOUS les problemes completement - tu aides vraiment l\'eleve. Tu guides etape par etape avec des explications claires. Tu es patient, encourageant et positif. MATIERE: ' + options.subject + ' NIVEAU: ' + levelInfo + ' ' + modeInstruction;
}

function getLevelInfo(level: string): string {
  if (level === 'college') {
    return 'College (6eme, 5eme, 4eme, 3eme - preparation au BFEM)';
  } else if (level === 'lycee') {
    return 'Lycee (2nde, 1ere, Terminale - preparation au BAC)';
  } else if (level === 'universite') {
    return 'Universite (Licence, Master)';
  }
  return level;
}
