
# WebhookEmailSender 
Este projeto consiste em uma aplicação Node.js que recebe webhooks de um sistema externo para processar eventos específicos (como pagamentos de faturas) e enviar um e-mail contendo um link de convite para um grupo do Telegram.

### Funcionalidades
   * Recepção de Webhooks: O servidor Express é configurado para receber POST requests  e processar eventos específicos de fatura.
   * Envio de E-mail: Após a confirmação do evento correto, um e-mail é enviado para o cliente contendo um link de convite para um grupo do Telegram.
 * Integração com Telegram: Utiliza a biblioteca Telegraf para gerar dinamicamente o link de convite para o grupo.


### Tecnologias

* Node.js: Plataforma para execução do servidor e lógica da aplicação. 

* Express: Framework web para Node.js, utilizado para roteamento e gestão de requisições HTTP. 

* Nodemailer: Módulo para Node.js que facilita o envio de e-mails. 

* Telegraf: Framework para bots do Telegram em Node.js, usado para gerar o link de convite. 

* dotenv: Utilizado para carregar variáveis de ambiente a partir de um arquivo .env. 

### Configuração 

Para configurar e executar este projeto localmente, siga os passos abaixo: 


    1. Clone o repositório: 
        
        git clone https://github.com/seu-usuario/seu-repositorio.git
        cd seu-repositorio

    2. Instale as dependências:    

        npm install express nodemailer telegraf dotenv

    3. Crie um arquivo .env na raiz do projeto:

        TELEGRAM_BOT_TOKEN=seu-token-do-bot-do-telegram
        CHAT_ID=seu-chat-id-do-telegram
        EMAIL_USER=seu-email@gmail.com
        EMAIL_PASS=sua-senha
        PORT=3000
    
    4. Por fim execute o programa: 

        node index.js

### Uso

Após configurar e iniciar a aplicação, verifique se os webhooks estão sendo enviados para http://seu-servidor:porta/webhook. A aplicação irá processar eventos de pagamento, enviará um e-mail com o link de convite do Telegram e logará informações úteis no console para depuração, lembre-se de configurar o bot do telegram e adiciona-lo ao grupo no qual ira utilizar para gerar o link do convite.

Este projeto demonstra a integração entre APIs externas, envio de e-mails e interação com bots do Telegram utilizando Node.js. É uma solução versátil para automatizar processos baseados em eventos externos e comunicação por e-mail.
