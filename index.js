//servidor pra enviar mails a través do contact form --- render

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sgMail from '@sendgrid/mail'


//mais seguro a traves de um .env file para os credentials
dotenv.config();

const app = express();

//o render free nao me permite manda mails, uso restapi do sendgrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//cors
app.use(cors({
  origin: ["https://pvbsovsv.github.io"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
})); 



app.use(express.json());
app.use(express.urlencoded({extended:true}));

//cors is driving me crazy
app.options("/send-email", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://pvbsovsv.github.io"); // necessary
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(200); 
});

//Contact form post
app.post('/send-email', async (req, res) => {
    const {name, email, phone, project} = req.body;

    //sendGrid rest api nao trabalha com transporter
   const msg = {
    to: process.env.EMAIL_USER,
    from: process.env.EMAIL_USER,  
    replyTo: email,
    subject: `Nova Proposta de Projecto Recebida de ${name}`,
    text: `
      Nome: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: ${project}
    `
  };
try {
    await sgMail.send(msg);
    res.status(200).json({ success: true, message: 'Email Enviado!' });
} catch (err) { 
    console.error('Erro ao enviar o email:', err.response ? err.response.body : err); 
    res.status(500).json({ success: false, message: 'Email Nao enviado.' });
}
});

//lançamos server

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));