require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const { Telegraf } = require('telegraf');
const crypto = require('crypto');

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const chatId = process.env.CHAT_ID;
const SECRET_KEY = process.env.EDUZZ_SECRET_KEY;

app.use(express.json());

async function generateTelegramInviteLink(chatId) {
    try {
        const inviteLink = await bot.telegram.createChatInviteLink(chatId, {
            member_limit: 1,
        });
        console.log('Link gerado:', inviteLink.invite_link);
        return inviteLink.invite_link;
    } catch (error) {
        console.error('Erro ao gerar link de convite:', error.message);
        throw new Error('Falha ao gerar o link de convite do Telegram');
    }
}

app.get('/webhook', (req, res) => {
    res.send('WEBHOOK EMAIL SENDER');
});

app.post('/webhook', async (req, res) => {
    const xSignature = req.headers['x-signature'];
    const requestBody = JSON.stringify(req.body);

    if (!xSignature) {
        return res.status(401).json({ error: 'Unauthorized - Missing x-signature header' });
    }

    const calculatedSignature = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(requestBody)
        .digest('hex');

    if (calculatedSignature !== xSignature) {
        return res.status(401).json({ error: 'Unauthorized - Invalid signature' });
    }

    const dataJson = req.body;
    const eventName = dataJson.event;

    console.log('Evento recebido: ', eventName);

    if (eventName === 'ping') {
        console.log('Ping received');
        return res.status(200).send('Pong');
    }

    if (!eventName || eventName !== 'myeduzz.invoice_paid') {
        return res.status(400).send('Evento não é invoice_paid ou está faltando no payload');
    }

    const studentName = dataJson.data.buyer.name;
    const customerEmail = dataJson.data.buyer.email;

    console.log('Nome recebido: ', studentName);
    console.log('email recebido: ', customerEmail);

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
    });

    const mailOptions = {
        from: "Vitor",
        to: customerEmail,
        subject: 'Bem-vindo ao Grupo Exclusivo de Ofertas da Jmarques!',
        html: `
        <p><strong>Olá ${studentName}</strong>,</p>

        <p>Primeiramente, queremos agradecer pela sua recente compra. Você agora faz parte
        do nosso grupo exclusivo, onde compartilhamos ofertas e promoções especiais.</p>

        <p>Estamos muito felizes em tê-lo conosco e queremos garantir que você aproveite ao
        máximo todos os benefícios que preparamos para você. Para acessar essas
        vantagens, siga os passos abaixo para ingressar no nosso grupo exclusivo no
        Telegram:</p>

        <ol>
            <li><strong>Acesse o Link Exclusivo:</strong><br>
                Clique no link abaixo para ingressar no grupo exclusivo:<br>
                <a href="${inviteLink}">Link Exclusivo do Grupo</a>
            </li>
        </ol>

        <p><strong>Dicas para Aproveitar ao Máximo:</strong></p>
        <ul>
            <li>Ative as notificações do grupo para não perder nenhuma oferta exclusiva.</li>
            <li>Fique atento às mensagens, onde compartilhamos as ofertas mais importantes.</li>
        </ul>

        <p>Se você tiver qualquer dúvida ou precisar de assistência, estamos aqui para ajudar!
        Basta nos enviar um e-mail para <a href="mailto:suporte@jmarquesrepasse.com.br">suporte@jmarquesrepasse.com.br</a> e
        responderemos o mais rápido possível.</p>

        <p>Por fim, mais uma vez, obrigado por sua confiança.</p>

        <p>Um grande abraço,<br>
        Jmarques</p>
    `
    };

    const sendEmail = async () => {
        try {
            console.log("Enviando email");
            await transporter.sendMail(mailOptions);
            console.log("Email enviado");
        } catch (error) {
            console.log("Erro ao enviar email:", error.message);
        }
    };

    sendEmail();

});

app.get('/', (req, res) => {
    res.send('INICIO');
});

app.use((req, res, next) => {
    res.status(404).send('Página não encontrada. Por favor, verifique o endereço e tente novamente.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});
