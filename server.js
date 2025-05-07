import express from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Configure nodemailer with Gmail SMTP or your preferred email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // Changed from EMAIL_APP_PASSWORD to EMAIL_PASSWORD
  }
});

// Test email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service configuration error:', error);
  } else {
    console.log('Email service is ready to send messages');
  }
});

app.post('/api/share-report', upload.single('report'), async (req, res) => {
  try {
    console.log('Received share report request');
    const { recipient } = req.body;
    const pdfBuffer = req.file?.buffer;

    console.log('Request details:', {
      hasRecipient: !!recipient,
      hasFile: !!req.file,
      fileSize: req.file?.size,
      contentType: req.file?.mimetype
    });

    if (!recipient || !pdfBuffer) {
      console.log('Missing required fields:', { recipient: !!recipient, pdfBuffer: !!pdfBuffer });
      return res.status(400).json({ 
        error: 'Missing required fields', 
        details: 'Both recipient email and PDF report are required' 
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: 'Your MoodMate Report',
      text: `
        Here's your MoodMate mood tracking report.
        
        This report includes your mood patterns, activity impact analysis, and personalized insights.
        
        Best regards,
        The MoodMate Team
      `,
      attachments: [
        {
          filename: 'moodmate-report.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    console.log('Attempting to send email to:', recipient);
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    
    res.json({ 
      success: true, 
      message: 'Report sent successfully to ' + recipient 
    });
  } catch (error) {
    console.error('Detailed error in share-report:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    emailService: transporter ? 'configured' : 'not configured'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Email service configured for: ${process.env.EMAIL_USER || 'not configured'}`);
});