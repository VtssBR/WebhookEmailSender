require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const axios = require('axios');

const app = express();

app.use(express.json());

app.get('/webhook', (req, res) => {
    res.send('Esta é a rota do webhook. Atualmente, não há solicitações POST sendo processadas.');
});

app.post('/webhook', async (req, res) => {
    const data = req.body;

    const customerEmail = data.cus_email || data.student_email
    
    console.log('email recebido: ', customerEmail);

    if (!customerEmail) {
     return res.status(400).send('Email do cliente não encontrado no payload');
    }
    res.status(200).send('Webhook processado com sucesso');

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: 'Seu link para o grupo do Telegram',
        text: `Olá, aqui está seu link para o grupo do Telegram:`
    };

    const sendEmail = async () => {
        try{
            console.log("enviando email")
            await transporter.sendMail(mailOptions);
            console.log("Email enviado")
            process.exit()
        } catch(error){
            console.log("Deu erro")
            console.log(error)
        }
    }

    sendEmail()

});

app.get('/', (req, res) => {
    res.send('Webhook Email Sender.');
});

app.use((req, res, next) => {
    res.status(404).send('Página não encontrada. Por favor, verifique o endereço e tente novamente.');
});

app.listen(process.env.PORT, () => {
    console.log('Server started at port:'+process.env.PORT);
});