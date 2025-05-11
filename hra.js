import { findWinner } from 'https://unpkg.com/piskvorky@0.1.4';

// v tomto posledním úkolu sobě i pro přehlednost code review doplním sem tam komentáře, jelikož jsem něco přepsala,poupravila a sama se v tom už mírně ztrácela 

let currentPlayer = 'circle'; // kdo je teď na tahu - začíná kolečko, tedy já

//pak se střídá kolečko x krížek stále dokola, dokud nenastane remíza nebo výhra
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

// volám API - může hrát AI (křížek)
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
  //Na DOM elementu příslušného políčka zavolej metodu .click()
  const policko = document.querySelectorAll('.cell')[index];

  // kliknutí AI po určitém čas.úseku
  setTimeout(() => {
    policko.click();
  }, 500);
};

//kontrola, zda nemáme už vítěze, a nebo je tah na AI straně (křížek)
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

  // zde je ze 4. úkolu bonus - remíza
// pokud někdo vyhraje, zobrazí se hláška a aktualizuje se hra
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

// událost - kliknutí z mojí strany - kolečko
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

// posluchač události na celou hrací plochu - hlídá kliknutí na políčka
const policka = document.querySelectorAll('.cell');
policka.forEach((policko) => {
  policko.addEventListener('click', klik);
});

aktualizujHrace(); 
