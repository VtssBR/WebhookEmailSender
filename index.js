require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/webhook',(req, res) => {
    const data = req.body;
    res.console.log(data)

    try {
     res.status(200).send('Webhook received and email sent');
        } catch (error) {
     res.status(500).send('Error: ' + error.message);
    }

    // const data = req.body;

    // // Extrair email do cliente dos dados do webhook
    // const customerEmail = data.cus_email || data.student_email;

    // if (!customerEmail) {
    //     return res.status(400).send('Email do cliente não encontrado no payload');
    // }

    // try {
    //     // Gerar link de convite do Telegram
    //     const telegramLink = await generateTelegramLink();

    //     // Enviar email com o link do Telegram
    //     await sendEmail(customerEmail, telegramLink);

    //     res.status(200).send('Webhook received and email sent');
    // } catch (error) {
    //     res.status(500).send('Error: ' + error.message);
    // }
});

// async function sendEmail(toEmail, link) {
//     let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//         }
//     });

//     let mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: toEmail,
//         subject: 'Confirmação de Compra',
//         text: `Obrigado por sua compra! Clique no link para acessar o grupo do Telegram: ${link}`
//     };

//     await transporter.sendMail(mailOptions);
// }

// async function generateTelegramLink() {
//     const botToken = process.env.TELEGRAM_BOT_TOKEN;
//     const chatId = process.env.TELEGRAM_GROUP_CHAT_ID;

//     const response = await axios.post(`https://api.telegram.org/bot${botToken}/createChatInviteLink`, {
//         chat_id: chatId,
//         expire_date: Math.floor(Date.now() / 1000) + 86400, // Link válido por 24 horas
//         member_limit: 1 // O link só pode ser usado uma vez
//     });

//     if (response.data.ok) {
//         return response.data.result.invite_link;
//     } else {
//         throw new Error('Failed to generate Telegram invite link');
//     }
// }

app.listen(process.env.PORT, () => {
    console.log('Server started at port:'+process.env.PORT);
});