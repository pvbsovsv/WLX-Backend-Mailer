//servidor pra enviar mails a través do contact form --- render

import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';


//mais seguro a traves de um .env file para os credentials
dotenv.config();

const app = express();


//cors
app.use(cors()); 
app.options('send-email', cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Contact form 
app.post('/send-email', async (req, res) => {
    const {name, email, phone, project} = req.body;

    //gmail transporter
    const transporter = nodemailer.createTransport({
        service:'gmail', 
        auth:{
        user: process.env.EMAIL_USER,  //vai buscar do dotenv
        pass: process.env.EMAIL_PASS
        }
    }); 
    //set up do email
    const mailOptions = {
        from:email,
        to: process.env.EMAIL_USER, //mandamos pra nos mesmos (creds > .env)
        subject: `Nova Proposta de Projecto Recebida de ${name}`, 
        text: `
        Nome: ${name}
        Email: ${email}
        Phone : ${phone}
        Message: ${project}
        `, 
    };
try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email Enviado!' });
} catch (err) { 
    console.error('Erro ao enviar o email:', err); 
    res.status(500).json({ success: false, message: 'Email Nao enviado.' });
}
});

//lançamos server

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));