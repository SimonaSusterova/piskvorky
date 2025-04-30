import { findWinner } from 'https://unpkg.com/piskvorky@0.1.4';  //přidání funkce findWinner

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



//vyberu všechna pole hrací tabulky, každé pole bude zmapované co obsahuje
const kontrolaViteze = () => {
  const herniPole = Array.from(document.querySelectorAll('.cell')).map(cell => {
    if (cell.classList.contains('board__field--circle')) {
      return 'o';  
    } else if (cell.classList.contains('board__field--cross')) {
      return 'x';  
    } else {
      return '_';  
    }
  });

 
  // rozhodnutí o výhře
  const vitez = findWinner(herniPole);
  
  if (vitez === 'o' || vitez === 'x') {
    alert(`Vyhrál hráč se symbolem '${vitez}'.`);
    location.reload();

  //BONUS - remíza
  } else if (vitez === 'tie') {
    alert('Je to remíza.');
    location.reload();
  }
};
  
const klik = (event) => {
  const blok = event.target;

  if (blok.classList.contains('board__field--circle') || blok.classList.contains('board__field--cross')) {
    return;  
  }

  if (currentPlayer === 'circle') {
    blok.classList.add('board__field--circle');
    currentPlayer = 'cross'; 
  } else {
    blok.classList.add('board__field--cross');
    currentPlayer = 'circle'; 
  };

  blok.disabled = true; 
  aktualizujHrace(); 

 //kontrola po každém 1 tahu
  kontrolaViteze();
};

const policka = document.querySelectorAll('.cell');
policka.forEach((policko) => {
  policko.addEventListener('click', klik);
});

aktualizujHrace();