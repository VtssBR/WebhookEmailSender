require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const { Telegraf } = require('telegraf');

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const chatId = process.env.CHAT_ID;


app.use(express.json());

async function generateTelegramInviteLink(chatId) {
    try {
        const inviteLink = await bot.telegram.createChatInviteLink(chatId, {
            member_limit: 1 
        });
        return inviteLink.invite_link;
    } catch (error) {
        console.error('Erro ao gerar link de convite:', error);
        throw new Error('Não foi possível gerar o link de convite do Telegram.');
    }
}

app.get('/webhook', (req, res) => {
    res.send('.');
});

app.post('/webhook', async (req, res) => {
    
    const data = req.body;
    const eventName = data.event_name;
    const customerEmail = data.cus_email || data.student_email
    
    console.log('Evento recebido: ', eventName);
    console.log('email recebido: ', customerEmail);

    if (!eventName || eventName !== 'invoice_paid') {
        return res.status(400).send('Evento não é invoice_paid ou está faltando no payload');
        
    }

    if (!customerEmail) {
        return res.status(400).send('Email do cliente não encontrado no payload');
    }
    res.status(200).send('Webhook processado com sucesso');

    const inviteLink = await generateTelegramInviteLink(chatId);

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
        text: `Olá, aqui está seu link para o grupo do Telegram: ${inviteLink}`
    };

    const sendEmail = async () => {
        try{
            console.log("enviando email")
            await transporter.sendMail(mailOptions);
            console.log("Email enviado")
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