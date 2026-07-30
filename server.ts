import express from 'express';
import path from 'path';
import compression from 'compression';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());
  app.use(compression());

  // Attach WebSocket Server on /ws endpoint
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req) => {
    const clientIp = req.socket.remoteAddress || 'unknown';
    console.log(`[WebSocket] Client connected from ${clientIp}`);

    // Send initial handshake open confirmation
    ws.send(JSON.stringify({
      type: 'CONNECTED',
      message: 'Connected to IQBAL WOODCRAFT Cloud Run Real-time Engine',
      timestamp: new Date().toISOString()
    }));

    ws.on('message', (rawMsg: string) => {
      try {
        const data = JSON.parse(rawMsg.toString());
        if (data.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG', timestamp: new Date().toISOString() }));
          return;
        }

        // Echo or broadcast back to confirm open connection state
        ws.send(JSON.stringify({
          type: 'ACK',
          received: data,
          timestamp: new Date().toISOString()
        }));
      } catch (err) {
        console.warn('[WebSocket] Received non-JSON payload:', rawMsg.toString());
      }
    });

    ws.on('error', (err) => {
      console.error('[WebSocket] Server socket error:', err);
    });

    ws.on('close', (code, reason) => {
      console.log(`[WebSocket] Client disconnected (Code: ${code}, Reason: ${reason.toString() || 'Normal'})`);
    });
  });

  // Initialize Gemini AI Client lazily if API key exists
  let aiClient: GoogleGenAI | null = null;
  function getAiClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  }

  // Global Error Handlers to prevent container crashes
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  // Health Check APIs for Cloud Run probes
  app.get(['/api/health', '/health', '/healthz'], (req, res) => {
    res.status(200).json({ status: 'ok', brand: 'IQBAL WOODCRAFT', timestamp: new Date().toISOString() });
  });

  // AI Quote Estimator API
  app.post('/api/ai-quote', async (req, res) => {
    const { category, dimensions, woodType, colourStain, fabricOption, specialRequirements } = req.body;
    try {
      const ai = getAiClient();

      if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: `You are the Senior Master Craftsman & Valuation Engineer for IQBAL WOODCRAFT, a premier furniture manufacturer in Karachi, Pakistan specializing in solid Sheesham (Rosewood), Teak, and Walnut carving.
Estimate the custom creation details for:
- Category: ${category}
- Dimensions: ${dimensions}
- Wood Type: ${woodType}
- Colour/Stain: ${colourStain}
- Fabric/Upholstery: ${fabricOption || 'N/A'}
- Special Requirements: ${specialRequirements || 'Standard premium Chinioti finish'}

Respond ONLY with valid JSON in this exact structure:
{
  "estimatedPriceMinPkr": number (e.g. 150000),
  "estimatedPriceMaxPkr": number (e.g. 190000),
  "woodcraftNotes": "string detail about timber drying, carving process",
  "recommendedFinish": "string polish recommendation",
  "productionDays": number (e.g. 12),
  "craftsmanshipTips": ["tip 1", "tip 2", "tip 3"]
}`,
        });

        const rawText = response.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json(parsed);
        }
      }
    } catch (err) {
      console.warn('Gemini API quote quota/error, falling back to local calculation:', err);
    }

    // Fallback response if AI key not configured, missing, or quota exceeded
    let baseMin = 120000;
    if (category?.toLowerCase().includes('sofa')) baseMin = 210000;
    if (category?.toLowerCase().includes('dining')) baseMin = 240000;
    if (category?.toLowerCase().includes('bed')) baseMin = 280000;

    return res.json({
      estimatedPriceMinPkr: baseMin,
      estimatedPriceMaxPkr: Math.round(baseMin * 1.25),
      woodcraftNotes: `Selected ${woodType || 'Solid Sheesham'} will undergo 30-day kiln seasoning to guarantee zero warping. Carving executed by master artisans in Chinioti style.`,
      recommendedFinish: `${colourStain || 'Walnut Gloss'} with satin polyurethane water-resistant polish coating.`,
      productionDays: 12,
      craftsmanshipTips: [
        'Hand-seasoned solid timber guarantees resistance against Pakistan humidity',
        'Heavy mortise-and-tenon structural frame joints with brass reinforce pin',
        '10 Years Termite Guarantee & free maintenance consultation'
      ]
    });
  });

  // AI Consultant API
  app.post('/api/ai-consultant', async (req, res) => {
    const { prompt, contextCategory, productCatalog, userBudget, roomSize } = req.body;
    try {
      const ai = getAiClient();

      if (ai) {
        const catalogContext = Array.isArray(productCatalog) && productCatalog.length > 0
          ? productCatalog.map((p: any) => `- Name: "${p.name}" (Code: ${p.code}), Category: ${p.category}, Price: PKR ${p.price?.toLocaleString()} (Sale Price: PKR ${(p.salePrice || p.price)?.toLocaleString()}), Wood: ${p.woodType}, Stock: ${p.availability}, Dims: ${p.dimensions}, Colors: ${p.availableColors?.join('/')}`).join('\n')
          : 'Solid Sheesham, Teak, and Walnut Furniture collections available';

        const systemInstruction = `You are the IQBAL WOODCRAFT AI Consultant, powered by Gemini AI.
You are a world-class furniture sales expert and consultant representing IQBAL WOODCRAFT (Showroom in DHA Phase 6 Karachi, Pakistan; crafted in Chiniot).

BEHAVIOUR & PERSONALITY:
- Friendly, warm, professional, respectful, with authentic Pakistani Hospitality (always greet with "Assalam-o-Alaikum!").
- Passionate sales expert and seasoned solid wood furniture specialist.

CAPABILITIES:
1. Recommend furniture matching customer style, room layout, budget, or family needs.
2. Compare products accurately based on catalog specs, wood density, price, and carving details.
3. Suggest room layouts based on customer room dimensions (e.g., clearance for king bed, side tables, wardrobe doors, sofa circulation).
4. Estimate nationwide delivery across Pakistan (5-7 working days via insured cargo bilty with custom protective timber crates).
5. Generate custom quotes or estimates with transparent cost breakdowns.
6. Explain Sheesham Wood (Chinioti Rosewood) — 30-day kiln drying, anti-termite treatment, rich natural grain, high hardness rating, lifetime durability, and Chinioti hand carving heritage.
7. Recommend furniture by Budget (e.g. filter catalog items under specified budget).
8. Recommend furniture by Room Size (e.g. standard master bedroom 14x16 ft vs compact 10x12 ft layout).
9. Capture customer details (politely collect customer name, contact phone/WhatsApp, city, preferred wood, or dimensions).

STRICT RULES & POLICIES (MUST FOLLOW):
- ALWAYS follow company policy:
  • Payment Policy: 100% Advance Payment via Bank Transfer (Meezan Bank), JazzCash, or EasyPaisa is mandatory before dispatch.
  • Cash on Delivery (COD) is strictly NOT available for custom or catalog solid wood furniture.
  • 10-Year Termite & Seasoning Warranty on all solid wood items.
- NEVER guess prices! If quoting catalog items, use exact price from CATALOG DATA provided. If user asks for custom unlisted items, provide an estimated range and ALWAYS recommend contacting WhatsApp for exact custom furniture pricing.
- ALWAYS recommend WhatsApp contact (0309-3509242 or 0302-0940219) for custom furniture, bespoke dimensions, or final order confirmation.
- NO FALSE INFORMATION: Do not fabricate unverified specs or unsupported policies.

CONTACT DETAILS TO SHARE WHEN RELEVANT:
- WhatsApp Business Support: 0309-3509242
- Sales & App Executive (Muhammad Zahid Iqbal): 0302-0940219
- Business Manager (Muhammad Shahid Iqbal): 0305-9453188
- CEO (Muhammad Iqbal): 0301-2549688`;

        const userPrompt = `Customer Question: "${prompt}"
${contextCategory ? `Category Context: ${contextCategory}` : ''}
${userBudget ? `User Budget Constraint: PKR ${userBudget.toLocaleString()}` : ''}
${roomSize ? `User Room Dimensions: ${roomSize}` : ''}

AVAILABLE SHOWROOM CATALOG DATA:
${catalogContext}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });

        return res.json({ reply: response.text });
      }
    } catch (err) {
      console.warn('Gemini API consultant quota/error, falling back to smart reply:', err);
    }

    // Smart fallback response if Gemini key not set or quota exceeded
    let fallbackText = `Assalam-o-Alaikum! Welcome to IQBAL WOODCRAFT Consultant.\n\n`;
    const lowerPrompt = (prompt || '').toLowerCase();

    if (lowerPrompt.includes('payment') || lowerPrompt.includes('cod') || lowerPrompt.includes('cash')) {
      fallbackText += `Our official company policy requires 100% advance payment via Bank Transfer (Meezan Bank), JazzCash (0302-0940219), or EasyPaisa (0305-9453188). Cash on Delivery (COD) is NOT available for handcrafted solid wood furniture.`;
    } else if (lowerPrompt.includes('sheesham') || lowerPrompt.includes('wood') || lowerPrompt.includes('rosewood')) {
      fallbackText += `Solid Sheesham (Chinioti Rosewood) is Pakistan's premier hardwood timber. At IQBAL WOODCRAFT, all Sheesham undergoes 30-day kiln seasoning and multi-stage anti-termite treatment, backed by our 10-Year Termite Warranty. It features stunning natural dark grains and supreme structural density for hand-carved furniture that lasts generations.`;
    } else if (lowerPrompt.includes('delivery') || lowerPrompt.includes('shipping') || lowerPrompt.includes('time')) {
      fallbackText += `We provide insured nationwide cargo delivery across all cities in Pakistan (Lahore, Islamabad, Rawalpindi, Multan, Faisalabad, Peshawar, Quetta, Karachi, etc.) within 5 to 7 working days, safely packed in custom wooden crates.`;
    } else if (lowerPrompt.includes('custom') || lowerPrompt.includes('quote') || lowerPrompt.includes('order')) {
      fallbackText += `For custom furniture orders, bespoke dimensions, or specific room layouts, we always recommend connecting directly with our Master Artisans on WhatsApp at 0309-3509242 or 0302-0940219 for exact pricing, 3D shop drawings, and finish samples!`;
    } else if (lowerPrompt.includes('contact') || lowerPrompt.includes('phone') || lowerPrompt.includes('whatsapp')) {
      fallbackText += `You can reach our leadership team directly:\n• WhatsApp Support: 0309-3509242\n• Sales Executive (Muhammad Zahid Iqbal): 0302-0940219\n• Business Manager (Muhammad Shahid Iqbal): 0305-9453188\n• CEO (Muhammad Iqbal): 0301-2549688`;
    } else {
      fallbackText += `How may I assist you today? I can recommend furniture matching your budget or room size, compare Sheesham vs Teak models, suggest room layout arrangements, or estimate pan-Pakistan delivery. For custom orders, please contact our WhatsApp team directly at 0309-3509242.`;
    }

    return res.json({ reply: fallbackText });
  });

  // Vite middleware setup for dev vs production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      maxAge: '1d',
      etag: true,
      lastModified: true
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`IQBAL WOODCRAFT Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('FATAL Server Startup Error:', err);
  process.exit(1);
});
