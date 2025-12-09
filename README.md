# Dissonância
**Status do Projeto:** Em Desenvolvimento ⚠️

Dissonância é uma aplicação web desenvolvida em **Angular** projetada para gerenciar fichas de personagens, lore e um bestiário (Monstropédia) para um RPG de mesa ambientado em um **Brasil moderno com elementos sobrenaturais e estética glitch/dark**.  

A aplicação serve como companheiro digital para jogadores e mestres, permitindo a criação de builds, visualização de status em tempo real e consulta de monstros.

---

## 🌐 Acesse

O projeto está disponível online através do **GitHub Pages**, permitindo testar a aplicação diretamente no navegador sem necessidade de instalação.

👉 **Acesse aqui:**  
🔗 **[devjaum.github.io/dissonancia](https://devjaum.github.io/dissonancia/)**  

> *Alguns recursos que dependem do Firebase podem exigir login para funcionar corretamente.*

## 🎨 Funcionalidades

### 🔐 Autenticação e Sistema
- **Login com Firebase**: Autenticação segura de usuários  
- **Banco de Dados em Tempo Real**: Sincronização de dados dos personagens via Firestore  
- **Roteamento**: Proteção de rotas e redirecionamento baseado no status do personagem (criação vs home)  

### 👤 Criação e Gerenciamento de Personagens
- **Sistema de Point Buy**: Distribuição de pontos de atributos (Força, Destreza, Constituição, Inteligência, Sabedoria, Carisma)  
- **Cálculo Automático**: Status derivados (Vida, Shinsu, Energia) calculados automaticamente  
- **Seletor de Talentos**: Lista dinâmica com custos variados e tooltips explicativos  
- **Editor de Lore**: Área para escrita da história, habilidades únicas e sinais de pressão mágica  
- **Prólogo Integrado**: Visualização da lore do mundo ("O Estoque", "O Evento") dentro da criação  

### 🏠 Dashboard (Home)
- **Ficha Digital 3D**: Card interativo com efeito *Flip* (Frente/Verso)  
  - Frente: Resumo, classe e lore  
  - Verso: Detalhes técnicos, bônus de atributos e lista de talentos  
- **Estética Glitch**: Identidade visual imersiva com animações CSS personalizadas e tema escuro  

### 📖 Monstropédia
- **Bestiário Interativo**: Galeria de monstros (ex: Guardião da Torre, Cervo da Podridão)  
- **Cards Expansíveis**: Lore, descrição da forma e aparência da criatura  

### 🛡️ Painel do Mestre (Admin)
- **Visão Geral**: Rota exclusiva para `admin@rpg.com`  
- **Monitoramento**: Visualização de todas as fichas cadastradas no banco de dados  

---

## 🛠️ Tecnologias Utilizadas
- **Frontend**: Angular (v20+)  
- **Linguagem**: TypeScript  
- **Estilização**: CSS3 (Variáveis, Animações Keyframes, Flexbox/Grid)  
- **Backend as a Service**: Firebase (Authentication & Firestore)  
- **Build & Minificação**: Angular CLI & Grunt  

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js (versão LTS recomendada)  
- Angular CLI instalado globalmente:  
  ```bash
  npm install -g @angular/cli
  ```
## 1. Clonar e Instalar Dependências
```bash
  # Clone o repositório
git clone https://github.com/seu-usuario/dissonancia.git

# Entre na pasta
cd dissonancia

# Instale as dependências
npm install
```
## 2. Configurar o Firebase
⚠️ O arquivo environment.ts está listado no .gitignore. Crie manualmente para conectar ao seu banco de dados.
- Crie um projeto no Firebase Console
- Habilite Authentication (Email/Senha) e Firestore Database
- Crie o arquivo src/environment.ts com:
```Typescript
// src/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJECT_ID.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_PROJECT_ID.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
  }
};
```
## 3. Executar o Servidor de Desenvolvimento
```Bash
  ng serve
```
- Acesse http://localhost:4200/ no navegador. O app recarrega automaticamente ao alterar arquivos.
## 📂 Estrutura do Projeto
```
src/
├── admin/          # Painel de visualização do Mestre
├── app/            # Configurações globais e rotas
├── createPerso/    # Tela de criação de ficha (Atributos/Talentos)
├── home/           # Visualização da ficha do jogador
├── login/          # Tela de Login com animações
├── lorePerso/      # Input de história e skills
├── monstropedia/   # Catálogo de monstros
└── styles.css      # Estilos globais (Glitch effects, variáveis de cor)
```
## 🧪 Testes
 - O projeto utiliza Karma e Jasmine para testes unitários.
``` Bash
  ng test
```
## 📄 Licença
 - Este projeto é feito com muito carinho, para meu primeiro RPG de mesa.
 - Desenvolvido por *DevJaum*

