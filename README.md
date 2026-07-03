# 🍻 Sextou! - A Contagem Regressiva para a Sexta-Feira

> *Sobreviva à semana com humor e veja o tempo passar até a tão sonhada sexta-feira!*

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 📋 Sobre o Projeto

Este é um projeto web interativo que exibe uma contagem regressiva para **sexta-feira às 17h** (o horário oficial do "Sextou" para muitos trabalhadores brasileiros). 

A página utiliza um banco de mensagens humorísticas e ácidas que mudam de acordo com o dia da semana, feriados nacionais, estaduais e municipais (com foco no Rio de Janeiro), além de detectar "feriadões" prolongados.

Quando finalmente chega a sexta-feira após as 17h, a página entra em modo **celebração total** com animações, texto pulsante e uma chuva de confetes para comemorar o fim do expediente.

---

## ✨ Funcionalidades

- **⏳ Contagem Regressiva em Tempo Real**  
  Dias, horas, minutos e segundos atualizados a cada segundo até o momento exato da libertação.

- **🎉 Modo "SEXTOU"**  
  Após as 17h da sexta-feira, a interface se transforma completamente com animações vibrantes, texto neon e uma mega explosão de confetes (400+ partículas).

- **📅 Mensagens Inteligentes por Dia da Semana**  
  Cada dia (Segunda a Domingo) possui um banco de +30 mensagens sarcásticas e divertidas que são exibidas aleatoriamente.

- **📆 Detecção de Feriados Avançada**  
  - **Feriados Fixos** (Nacionais, Estaduais e Municipais do RJ)  
  - **Feriados Móveis** (Carnaval, Sexta-Feira Santa, Páscoa, Corpus Christi) calculados dinamicamente pelo algoritmo de Gauss.  
  - **Pontos Facultativos** (Véspera de Natal e Ano Novo)  
  - **Mensagens específicas** para cada feriado (Natal, Ano Novo, Carnaval, etc.).

- **🔥 Detecção de "Feriadão"**  
  Se um feriado cair na segunda, sexta, ou emendar com um feriado/facultativo, a página exibe mensagens especiais sobre o descanso prolongado.

- **🎊 Chuva de Confetes Contínua**  
  Partículas coloridas caindo em segundo plano durante todo o uso. Ao atingir o "Sextou", a quantidade e intensidade disparam.

- **🎨 Design Moderno e Responsivo**  
  - Fundo com gradiente animado.  
  - Efeito *Glassmorphism* no card principal.  
  - Animações de flutuação e *hover* nos blocos de tempo.  
  - Adaptável a qualquer tamanho de tela.

---

## 🚀 Como Executar

Como é um projeto puramente front-end (HTML/CSS/JS), você pode rodá-lo de várias formas:

### 1. Diretamente pelo navegador
Clone o repositório e abra o arquivo `index.html`:
```bash
git clone https://github.com/seu-usuario/sextou-countdown.git
cd sextou-countdown
# Abra o index.html no seu navegador
