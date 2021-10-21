//chamada do elemento Canvas do HTML
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

//canvas.width = 480;
//canvas.height = 320;

canvas.width = document.querySelector("body").offsetWidth;
canvas.height = document.querySelector("body").offsetHeight;
var unidadeProporcaoLargura = canvas.width/480;
var unidadeProporcaoAltura = canvas.height/320;

//Definição dos eixos
var x = canvas.width / 2;
var y = canvas.height - 30; 

//Definição das variáveis globais
var dx = 2 * unidadeProporcaoLargura;
var dy = -2 * unidadeProporcaoAltura;
var raioBola = 10 * unidadeProporcaoLargura;
var baseAltura = 10 * unidadeProporcaoLargura;
var baseLargura = 75 * unidadeProporcaoAltura;
var baseX = (canvas.width - baseLargura) / 2;
var pressionouDireita = false;
var pressionouEsquerda = false;
var larguraTijolo = 75 * unidadeProporcaoAltura;
var alturaTijolo = 20 * unidadeProporcaoLargura;
var contadorLinhasTijolo = 3
var contadorColunasTijolo = Math.round(canvas.width/larguraTijolo - 1);
var preenchimento = 10;
var deslocamentoTopo = 30;
var deslocamentoEsquerda = 30;
var pontuacao = 0;
var vidas = 3;
var c;


//Definição dos tijolos
var tijolo = [];
for (c = 0; c < contadorColunasTijolo; c++) {
  tijolo[c] = [];
  for (r = 0; r < contadorLinhasTijolo; r++) {
    tijolo[c][r] = {
      x: 0,
      y: 0,
      status: 1
    };
  }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

//Função que verifica se os botões foram pressionados
function keyDownHandler(e) {
  if (e.keyCode === 39) {
    pressionouDireita = true;
  } else if (e.keyCode === 37) {
    pressionouEsquerda = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) {
    pressionouDireita = false;
  } else if (e.keyCode === 37) {
    pressionouEsquerda = false;
  }
}

//Função para desenhar os tijolos
function desenhaTijolo() {
  for (c = 0; c < contadorColunasTijolo; c++) {
    for (r = 0; r < contadorLinhasTijolo; r++) {
      if (tijolo[c][r].status === 1) {
        //Definição dos eixos dos tijolos
        var tijoloX = (c * (larguraTijolo + preenchimento)) + deslocamentoEsquerda;
        var tijoloY = (r * (alturaTijolo + preenchimento)) + deslocamentoTopo;
        tijolo[c][r].x = tijoloX;
        tijolo[c][r].y = tijoloY;
        ctx.beginPath();
        ctx.rect(tijoloX, tijoloY, larguraTijolo, alturaTijolo);
        ctx.fillStyle = "#0095DD"; //Definição da cor
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//Função para desenhar a bola
function desenhaBola() {
  ctx.beginPath();
  ctx.arc(x, y, raioBola, 0, Math.PI * 2);
  ctx.fillStyle = "#000000"; //Cor da bola
  ctx.fill();
  ctx.closePath(); 
}
//Função para desenhar a base
function desenhaBase() {
  ctx.beginPath();
  ctx.rect(baseX, canvas.height - baseAltura, baseLargura, baseAltura);
  ctx.fillStyle = "#b510c7"; //Cor da base
  ctx.fill();
  ctx.closePath();
}

//Função que verifica colisão
function detectorColisao() {
  for (c = 0; c < contadorColunasTijolo; c++) {
    for (r = 0; r < contadorLinhasTijolo; r++) {
      var b = tijolo[c][r];
      if (b.status === 1) {
        //Verifica se um tijolo foi atingido e marca um ponto em caso positivo
        if (x > b.x && x < b.x + larguraTijolo && y > b.y && y < b.y + alturaTijolo) {
          dy = -dy;
          b.status = 0;
          pontuacao++;
          //Verifica se acabaram os tijolos
          if (pontuacao === contadorLinhasTijolo * contadorColunasTijolo) {
            alert("YOU WIN!");
            document.location.reload();
          }
        }
      }
    }
  }
}

//Função para exibir a pontuação
function exibePontos() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "0095DD";
  ctx.fillText("pontuacao: " + pontuacao, 8, 20);
}

//Função para exibir as vidas restantes
function exibeVidas() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "0095DD";
  ctx.fillText("vidas: " + vidas, canvas.width - 65, 20);
}

//Função principal, que chama as demais
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  desenhaTijolo();
  desenhaBola();
  desenhaBase();
  exibePontos();
  exibeVidas();
  detectorColisao();

  //Verificação para subir e descer na tela após colisao, fazendo a inversão dos eixos
  if (y + dy < raioBola) { 
    dy = -dy
  } else if (y + dy > canvas.height - raioBola) {
    if (x > baseX && x < baseX + baseLargura) {
      dy = -dy;
    } else {
      vidas--; //Verifica se bola tocou no chão sem encostar na base, perdendo uma vida
      if (!vidas) {
        alert("GAME OVER"); //Jogo acaba se as vidas terminarem
        document.location.reload();
      } else { //Reposiciona a bola e a base para posição inicial caso o jogador tenha vidas restantes
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 10;
        dy = -10;
        baseX = (canvas.width - baseLargura) / 2;
      }
    }
  }
  //Inversão do movimento da bola após colisão
  if (x + dx > canvas.width - raioBola || x + dx < raioBola) {
    dx = -dx
  }

  //Movimento da base
  if (pressionouDireita && baseX < canvas.width - baseLargura) {
    baseX += 7;
  } else if (pressionouEsquerda && baseX > 0) {
    baseX -= 7;
  }

  //Movimento da bola, através da adição do deslocamento gerado
  x += dx; 
  y += dy; 
  requestAnimationFrame(draw);
}
document.addEventListener("mousemove", movimentoMouse);

//Função que permite usar o mouse para movimento ao invés das setas
function movimentoMouse(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 + baseLargura / 2 && relativeX < canvas.width - baseLargura / 2) {
    baseX = relativeX - baseLargura / 2;
  }
}
draw();