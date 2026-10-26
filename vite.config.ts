import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-plugin',
    configureServer(server) {
      // 1. Analyze existing story
      server.middlewares.use('/api/gemini/analyze', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const { story, activeRole } = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'GEMINI_API_KEY not configured on server' }));
              return;
            }

            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            const prompt = `Analyze this tech news story:
Title: "${story.title}"
Source domain: "${story.domain}"
Category: "${story.beat}"
Target User Role: "${activeRole}"

Generate a crisp 3-bullet TL;DR and tailored "Why This Matters" impact explanations for:
1. Software Engineer
2. Product Manager
3. Founder / Exec`;

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING },
                    isBreaking: { type: Type.BOOLEAN },
                    tldrBullets: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    roleImpact: {
                      type: Type.OBJECT,
                      properties: {
                        'Software Engineer': { type: Type.STRING },
                        'Product Manager': { type: Type.STRING },
                        'Founder / Exec': { type: Type.STRING },
                      },
                      required: ['Software Engineer', 'Product Manager', 'Founder / Exec'],
                    },
                    groundedTakeaway: { type: Type.STRING },
                  },
                  required: ['headline', 'isBreaking', 'tldrBullets', 'roleImpact', 'groundedTakeaway'],
                },
              },
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(response.text || '{}');
          } catch (error: any) {
            console.error('Server Gemini analyze error:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: error?.message || 'Failed to analyze story' }));
          }
        });
      });

      // 2. Live Breaking News Detector
      server.middlewares.use('/api/gemini/detect-breaking', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const { topic, activeRole, userName } = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'GEMINI_API_KEY not configured on server' }));
              return;
            }

            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            const prompt = `You are a high-velocity breaking news intelligence engine for PulseDaily.
The user entered this breaking tech topic/query: "${topic}".
User's name: "${userName || 'Leader'}".
User's active persona lens: "${activeRole || 'Software Engineer'}".

Synthesize an authoritative breaking news alert card in JSON.
Include:
- A clear, punchy breaking headline (title)
- Likely publisher domain (domain, e.g. openai.com, anthropic.com, deepmind.google, github.com)
- Category beat (either 'Agentic AI', 'Cloud & Infra', or 'Product & Strategy')
- 3 crisp TL;DR bullet points
- Specific impact for: 'Software Engineer', 'Product Manager', 'Founder / Exec' (mentioning why it matters to each lens)
- Velocity score between 95 and 100`;

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    domain: { type: Type.STRING },
                    beat: {
                      type: Type.STRING,
                      enum: ['Agentic AI', 'Cloud & Infra', 'Product & Strategy'],
                    },
                    tldrBullets: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    roleImpact: {
                      type: Type.OBJECT,
                      properties: {
                        'Software Engineer': { type: Type.STRING },
                        'Product Manager': { type: Type.STRING },
                        'Founder / Exec': { type: Type.STRING },
                      },
                      required: ['Software Engineer', 'Product Manager', 'Founder / Exec'],
                    },
                    velocityScore: { type: Type.INTEGER },
                  },
                  required: ['title', 'domain', 'beat', 'tldrBullets', 'roleImpact', 'velocityScore'],
                },
              },
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(response.text || '{}');
          } catch (error: any) {
            console.error('Server Gemini detect-breaking error:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: error?.message || 'Failed to detect breaking story' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
