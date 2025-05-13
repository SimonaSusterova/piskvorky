import { findWinner } from 'https://unpkg.com/piskvorky@0.1.4';

let currentPlayer = 'circle';

const aktualizujHrace = () => {
  const ikona = document.getElementById('current-player-icon');
  if (currentPlayer === 'circle') {
    ikona.src = 'img/circle.svg';
    ikona.alt = 'Kruh';
  } else {
    ikona.src = 'img/cross.svg';
    ikona.alt = 'Křížek';
  }
};

const AITah = async (herniPole) => {
  const odpoved = await fetch('https://piskvorky.czechitas-podklady.cz/api/suggest-next-move', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      board: herniPole,
      player: 'x',
    }),
  });

  const data = await odpoved.json();
  const index = data.position.x + data.position.y * 10;
  const policko = document.querySelectorAll('.cell')[index];

  setTimeout(() => {
    policko.click();
  }, 500);
};

const kontrolaViteze = async () => {
  const herniPole = Array.from(document.querySelectorAll('.cell')).map(cell => {
    if (cell.classList.contains('board__field--circle')) {
      return 'o';
    } else if (cell.classList.contains('board__field--cross')) {
      return 'x';
    } else {
      return '_';
    }
  });

  const vitez = findWinner(herniPole);

  if (vitez === 'o' || vitez === 'x') {
    alert(`Vyhrál hráč se symbolem '${vitez}'.`);
    location.reload();
  } else if (vitez === 'tie') {
    alert('Je to remíza.');
    location.reload();
  } else if (currentPlayer === 'cross') {
    await AITah(herniPole); 
  }
};

const klik = async (event) => {
  const blok = event.target;

  if (
    blok.classList.contains('board__field--circle') ||
    blok.classList.contains('board__field--cross')
  ) {
    return;
  }

  if (currentPlayer === 'circle') {
    blok.classList.add('board__field--circle');
    blok.disabled = true;
    currentPlayer = 'cross';
    aktualizujHrace();
    await kontrolaViteze();
  } else if (currentPlayer === 'cross') {
    blok.classList.add('board__field--cross');
    blok.disabled = true;
    currentPlayer = 'circle';
    aktualizujHrace();
    await kontrolaViteze();
  }
};

// 🌟 VYTVOŘENÍ TLAČÍTEK
const boardElement = document.getElementById('board');
for (let i = 1; i <= 100; i++) {
  const cell = document.createElement('button');
  cell.classList.add('cell');
  cell.id = `kostka-${i}`;
  boardElement.appendChild(cell);
}

// 🌟 PŘIDÁNÍ POSLUCHAČŮ
const policka = document.querySelectorAll('.cell');
policka.forEach((policko) => {
  policko.addEventListener('click', klik);
});

aktualizujHrace();