import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { nanoid } from 'nanoid';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { rateLimit } from 'express-rate-limit';
import Lead from './models/Lead.js';
dotenv.config();

const PORT = 5000;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

app.use(limiter);
app.use(cors());
app.use(bodyParser.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'mock-key',
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_audit';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/api/summarize', async (req, res) => {
  const { useCase, totalSpend, monthlySavings, annualSavings, recommendations } = req.body;

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 200,
        messages: [{
          role: "user",
          content: `Generate a ~100-word personalized summary for an AI spend audit:
- User's primary use case: ${useCase}
- Total Monthly Spend: $${totalSpend}
- Total Potential Monthly Savings: $${monthlySavings}
- Total Potential Annual Savings: $${annualSavings}
- Per-tool recommendations:
${recommendations}

Provide a concise, punchy paragraph that highlights the biggest optimization opportunities.`
        }],
      });
      return res.json({ summary: msg.content[0].text });
    } catch (error) {
      console.error('Anthropic API Error:', error);
    }
  }

  // Fallback
  const summary = `Based on your current stack for ${useCase}, you're spending $${totalSpend} per month. Our audit found that by switching to more cost-effective plans and alternatives, you could save $${monthlySavings} monthly—totaling $${annualSavings} per year. The most significant gains come from optimizing your highest-spend tools.`;
  res.json({ summary });
});

app.post('/api/leads', async (req, res) => {
  const { email, company, role, auditResult } = req.body;
  const id = nanoid(10);
  
  try {
    const lead = new Lead({
      id,
      email,
      company,
      role,
      auditResult
    });
    
    await lead.save();

    console.log(`[Lead Captured] Email: ${email}, Savings: $${auditResult.totalMonthlySavings}`);
    
    // Mock Transactional Email
    console.log(`[Email Sent] To: ${email}, Subject: Your AI Spend Audit Report`);

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? `https://${req.headers.host}` 
      : 'http://localhost:5173';
      
    res.status(201).json({ success: true, shareUrl: `${baseUrl}/share/${id}` });
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({ error: 'Failed to save lead' });
  }
});

app.get('/api/share/:id', async (req, res) => {
  try {
    const lead = await Lead.findOne({ id: req.params.id });
    if (!lead || !lead.auditResult) {
      return res.status(404).json({ error: 'Audit not found' });
    }
    res.json(lead.auditResult);
  } catch (error) {
    console.error('Error fetching audit:', error);
    res.status(500).json({ error: 'Failed to fetch audit' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
  });
}

export default app;
