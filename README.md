# `icpsubaccount`

Este projeto irá exemplificar como criar uma SubAccount para um Principal de um usuário. Os Principais são usados ​​para identificar entidades que podem interagir com o Internet. Computer. SubAccounts são utilizadas para controles de transações, A SubAccount é uma forma de organizar saldos de um Principal, 
geralmente usada em contextos de aplicativos para rastrear fundos de diferentes usuários ou finalidades. 
SubAccounts no ICP são representadas como um array de 32 bytes (Blob). Normalmente, uma subconta é derivada de algum identificador único, como um número incremental ou o Principal de um usuário.

Para criar uma subconta no Internet Computer (ICP) utilizando Motoko, vamos seguir os seguintes passos: 

	•	Criar uma SubAccount a partir de um identificador único (userId), informado no momento da criação.
	•	O identificador será convertido em bytes UTF-8 e mapeado para um array de 32 bytes.
	•	Caso o userId seja menor que 32 bytes, o restante do array será preenchido com zeros.
	•	A SubAccount será armazenada utilizando um HashMap onde a chave do HashMap será o Principal do usuário. Por se tratar de exemplo, a forma de armazenar os dados
  deverá ser tratada com base nas caracteristicas de cada projeto.

Você pode usar essa subconta para operações como transferência de fundos ou separação de saldos.

Referências:

  •	https://mmapped.blog/posts/13-icp-ledger#account-id
  •	https://internetcomputer.org/docs/current/developer-docs/defi/overview#terminology



Para executar o projeto primeiramente instale o seguinte pacote: 

```bash
cd icpsubaccount/
npm install
npm install --save @dfinity/auth-client
```

## Este projeto funciona apenas na Mainnet ou Playground

Para testar execute os seguintes comandos:

```bash
dfx start --background

dfx deploy --playground
```

