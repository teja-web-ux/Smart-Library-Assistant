import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Server-side Gemini initialization if key exists
let aiClient: import('@google/genai').GoogleGenAI | null = null;
const geminiApiKey = process.env.GEMINI_API_KEY;
let isGeminiAvailable = Boolean(geminiApiKey);
if (geminiApiKey) {
  void import('@google/genai')
    .then(({ GoogleGenAI }) => {
      aiClient = new GoogleGenAI({
        apiKey: geminiApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    })
    .catch((error: unknown) => {
      isGeminiAvailable = false;
      console.error('Failed to initialize GoogleGenAI client:', error);
    });
}

// Status check endpoint
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Library Assistant endpoint
app.post('/api/assistant', async (req, res) => {
  try {
    const { message, catalogSummary } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY || !aiClient || !isGeminiAvailable) {
      // Return seamless fallback signal for client local catalog assistant
      return res.json({
        fallback: true,
        reply: null,
        message: 'Operating in local intelligent librarian mode.',
      });
    }

    const systemPrompt = `You are "Smart Library Assistant", a knowledgeable, courteous, and highly organized digital librarian for a modern university and college library.

LIVE CATALOG AND REPOSITORY SNAPSHOT:
${catalogSummary || 'Catalog records loaded in memory.'}

LIBRARY POLICIES:
- Standard Checkout Period: 14 days (2 weeks).
- Maximum Active Books: 4 books per registered student/member.
- Overdue Penalty: $0.50 per day per overdue book.
- Renewal: Allowed once if no other member has placed a reservation.
- Operating Hours: Monday to Friday 8:00 AM - 9:00 PM; Saturday 9:00 AM - 5:00 PM; Closed on Sundays.
- Book Location Coding: Aisle & Shelf format (e.g. Rack A-1, Floor 2).

RESPONSE GUIDELINES:
1. Always prioritize matching books from the user's library catalog. Mention their title, author, category, available copies, and shelf location.
2. If the user asks for recommendations, give 2-3 specific books from their catalog first, explaining why they fit the query. If helpful, suggest general classic titles as supplementary reading.
3. If the user asks about availability, check the available copy count from the provided catalog and state whether it is in stock or on loan.
4. If the user asks about rules or policies (returns, borrowing, overdue fines, opening hours), explain clearly based on the library rules above.
5. Keep your tone polite, concise, professional, and well-formatted with markdown (bold titles, bulleted points).
6. Avoid fluff or generic pleasantries. Provide direct, actionable library guidance.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemPrompt}\n\nUSER QUESTION:\n${message}` },
          ],
        },
      ],
    });

    const reply = response.text || 'I could not formulate an answer right now. Please explore our catalog or rephrase your question.';

    return res.json({
      fallback: false,
      reply,
    });
  } catch (error: any) {
    // If project free tier is not enabled or permission denied, switch smoothly to local mode
    const msg = error?.message || '';
    if (msg.includes('403') || msg.includes('PERMISSION_DENIED') || msg.includes('billing')) {
      isGeminiAvailable = false;
      console.log('[Smart Library Assistant] Project billing or permission required for remote Gemini API. Gracefully falling back to local catalog assistant reasoning.');
    } else {
      console.log('[Smart Library Assistant] Remote AI service unavailable. Switching to local catalog assistant reasoning.');
    }

    return res.json({
      fallback: true,
      reason: 'local_mode',
      reply: null,
    });
  }
});

// Serve frontend: Vite dev server or static files
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Smart Library Assistant] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
