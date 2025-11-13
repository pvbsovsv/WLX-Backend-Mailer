import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'https://your-frontend-domain.vercel.app', // Add your actual frontend domain
    'https://your-frontend-domain.netlify.app' // Add your actual frontend domain
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your existing email route...
app.post('/send-email', async (req, res) => {
  const { name, email, phone, project } = req.body;

  // Input validation
  if (!name || !email || !phone || !project) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nome, email e mensagem são obrigatórios.' 
    });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Nova Proposta de Projecto Recebida de ${name}`,
    text: `
    Nome: ${name}
    Email: ${email}
    Telefone: ${phone}
    Mensagem: ${project}
    `,
    html: `
    <h3>Nova Proposta de Projecto</h3>
    <p><strong>Nome:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Telefone:</strong> ${phone}</p>
    <p><strong>Mensagem:</strong></p>
    <p>${project.replace(/\n/g, '<br>')}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email Enviado!' });
  } catch (err) {
    console.error('Erro ao enviar o email:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor. Email não enviado.' 
    });
  }
});

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'Email Server',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));