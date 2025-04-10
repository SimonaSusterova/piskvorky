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


const klik = (event) => {
  const blok = event.target;

  
  if (currentPlayer === 'circle') {
    blok.classList.add('board__field--circle');
    currentPlayer = 'cross'; 
  } else {
    blok.classList.add('board__field--cross');
    currentPlayer = 'circle'; 
  }

  blok.disabled = true; 
  aktualizujHrace(); 
};


const policka = document.querySelectorAll('.cell');
policka.forEach((policko) => {
  policko.addEventListener('click', klik);
});


aktualizujHrace();


