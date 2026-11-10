# Rotas Brasileiras

Jogo de tabuleiro no navegador, inspirado em Ticket to Ride, com o mapa do Brasil. De 2 a 5 jogadores no mesmo computador, e cada vaga pode ser uma pessoa ou o computador.

O projeto ainda está em desenvolvimento.

## Como funciona

Cada jogador começa com 45 caminhões e liga cidades construindo rotas pelo mapa. Na sua vez, ele faz uma destas ações:

- comprar cartas;
- reivindicar uma rota, pagando com cartas da cor dela;
- comprar missões.

As cartas são de 8 regiões (Amazônia, Cerrado, Pantanal, Caatinga, Mata Atlântica, Pampa, Litoral e Serra), mais o Estepe, que vale como coringa.

## O que muda em relação ao jogo original

- **Missões:** ligar as cidades indicadas rende pontos, e quem não consegue perde pontos no fim.
- **Dia e noite:** a cada amanhecer sai uma carta de evento que muda as regras para todos até o próximo amanhecer. A mesa também muda de cor: lilás de dia e roxo escuro à noite.
- **Curiosidades:** ao ligar uma cidade, o jogador descobre uma curiosidade sobre ela e ganha 1 ponto.
- **Fim de jogo:** quando alguém termina a vez com 2 caminhões ou menos, todos jogam mais uma rodada. O caminho mais longo vale 10 pontos extras.

## Tecnologias

React, TypeScript, Tailwind CSS, Vite e Vitest.

## Como rodar

É preciso ter o Node.js instalado.

~~~
git clone https://github.com/Paula-Thamyres/rotas-brasileiras.git
cd rotas-brasileiras
npm install
npm run dev
~~~

O jogo abre em http://localhost:5173/. Para rodar os testes:

~~~
npm test
~~~

## Organização do código

- `src/engine`: regras do jogo, em funções puras (baralho, rotas, partida, missões e computador)
- `src/data`: mapa, missões, eventos e curiosidades em JSON
- `src/types`: tipos compartilhados
- `src/hooks`: estado da partida
- `src/components`: telas e peças do jogo
- `src/ui`: textos e funções de apoio das telas

## Próximos passos

- Tela de fim de jogo, com a classificação final e o vencedor
- Sol e lua em movimento na barra do dia
