const tickSound = new Audio("clock.wav"); 
tickSound.volume = 1;
tickSound.preload = "auto";
tickSound.muted = true;
const button = document.querySelector(".button");
const navContainer = document.querySelector(".nav-container");

//Elements pour l'affichage de la date
const jourSemaine = document.querySelector(".jour-semaine");
const jourMois = document.querySelector(".jour-mois");
const mois = document.querySelector(".mois");
const annee = document.querySelector(".annee");

//fonction pour afficher/masquer le menu de navigation
function showMenu() {
    navContainer.classList.toggle("active");
}

//Fonction pour activer/désactiver le son de l'horloge
function Sound(){
    if(tickSound.muted === false){
        tickSound.muted = true;
        button.textContent = "Activer le Son";
    }else{
        tickSound.muted = false;
        button.textContent = "Désactiver le Son";
    }
}

//Selection des elements pour le menu déroulant des fuseaux horaires
const selectMenu = document.querySelector(".select-menu");
const selectBtn = document.querySelector(".select-region");
const items = document.querySelectorAll(".item");

//Gestion de l'ouverture/fermeture du menu déroulant
selectBtn.addEventListener("click", () => {
    selectMenu.classList.toggle("open");
    const isExpanded = selectMenu.classList.contains("open");
    selectBtn.setAttribute("aria-expanded", isExpanded);
});

//Fuseau horaire par défaut
let selectedTimezone = 'local';

//Elements des aiguilles de l'horloge analogique
const hourHand = document.getElementById("hour");
const minuteHand = document.getElementById("minute");
const secondHand = document.getElementById("seconds");
//Elements des aiguilles de l'horloge numerique
const hrDisplay = document.getElementById("hr");
const minDisplay = document.getElementById("min");
const secDisplay = document.getElementById("sec");
const periodDisplay = document.querySelector(".period");
//Elements pour les effets lumineux
const lightEffects = document.getElementById('lightEffects');
const sun = document.getElementById('sun');
const moon = document.getElementById('moon');
const stars = document.getElementById('stars');
const body = document.body;
const currentPeriodDisplay = document.getElementById('currentPeriod');
// Éléments de navigation et mode manuel
const navItems = document.querySelectorAll('.nav-item');
let manualMode = false;

// Fonction pour créer les étoiles animées
function createStars() {
    stars.innerHTML = '';
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 4}s`;
        stars.appendChild(star);
    }
}

// Configuration de la navigation entre les périodes de la journée
function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            const period = this.getAttribute('data-period');
            
            if (period === 'current') {
                manualMode = false;
                currentPeriodDisplay.textContent = 'Mode : Temps Réel';
            } else {
                manualMode = true;
                simulatePeriod(period);
            }
        });
    });
}

// Simulation d'une période spécifique de la journée
function simulatePeriod(period) {
    let hours;
    let periodName;
    
    switch(period) {
        case 'dawn':
            hours = 6;
            periodName = 'Aube';
            break;
        case 'day':
            hours = 12;
            periodName = 'Jour';
            break;
        case 'dusk':
            hours = 18;
            periodName = 'Crépuscule';
            break;
        case 'night':
            hours = 22;
            periodName = 'Nuit';
            break;
    }
    
    applyLightEffects(hours);
    currentPeriodDisplay.textContent = `Mode Simulation : ${periodName}`;
}

// Application des effets visuels selon l'heure
function applyLightEffects(hours) {
    body.classList.remove('dawn-mode', 'day-mode', 'dusk-mode', 'night-mode');
    
    let periodName = '';
    if (hours >= 5 && hours < 7) {
        body.classList.add('dawn-mode');
        periodName = 'Aube';
        
        const progress = (hours - 5) / 2;
        sun.style.left = `${10 + progress * 30}%`;
        sun.style.top = '70%';
        sun.style.opacity = '0.8';
        
        moon.style.opacity = '0';
        stars.style.opacity = '0';
    }
    else if (hours >= 7 && hours < 17) {
        body.classList.add('day-mode');
        periodName = 'Jour';
        
        const progress = (hours - 7) / 10;
        const sunX = 20 + progress * 60;
        const sunY = 70 - Math.sin(progress * Math.PI) * 50;
        
        sun.style.left = `${sunX}%`;
        sun.style.top = `${sunY}%`;
        sun.style.opacity = '1';
        
        moon.style.opacity = '0';
        stars.style.opacity = '0';
    }
    else if (hours >= 17 && hours < 19) {
        body.classList.add('dusk-mode');
        periodName = 'Crépuscule';
        
        const progress = (hours - 17) / 2;
        sun.style.left = `${70 + progress * 20}%`;
        sun.style.top = '70%';
        sun.style.opacity = '0.8';
        
        moon.style.opacity = '0';
        stars.style.opacity = '0';
    }
    else {
        body.classList.add('night-mode');
        periodName = 'Nuit';
        
        const nightHours = hours < 5 ? hours + 24 : hours;
        const progress = (nightHours - 19) / 10;
        const moonX = 10 + progress * 80;
        const moonY = 30 + Math.sin(progress * Math.PI) * 40;
        
        moon.style.left = `${moonX}%`;
        moon.style.top = `${moonY}%`;
        moon.style.opacity = '0.8';
        
        sun.style.opacity = '0';
        stars.style.opacity = '1';
    }
    
    if (!manualMode) {
        currentPeriodDisplay.textContent = `Période actuelle : ${periodName}`;
    }
}

// Obtention de l'heure selon le fuseau horaire sélectionné
function getTimeForTimezone(timezone) {
    if (timezone === 'local') {
        return new Date();
    } else {
        return new Date(new Date().toLocaleString("en-US", {timeZone: timezone}));
    }
}

// Mise à jour de l'affichage de la date
function updateDateDisplay() {
    let now = getTimeForTimezone(selectedTimezone);
    
    const jours = [
        "Sunday", "Monday", "Tuesday", "Wednesday", 
        "Thursday", "Friday", "Saturday"
    ];
    
    const moisNoms = [
        "Jan,", "Feb,", "Mar,", "Apr,", "May", "Jun,",
        "Jul,", "Aug,", "Sept,", "Oct,", "Nov,", "Dec,"
    ];
    
    const jour = now.getDate();
    const moisIndex = now.getMonth();
    const anneeValue = now.getFullYear();
    const jourIndex = now.getDay();
    
    jourSemaine.textContent = jours[jourIndex];
    jourMois.textContent = jour;
    mois.textContent = moisNoms[moisIndex];
    annee.textContent = anneeValue;
}

// Mise à jour de l'horloge (analogique et numérique)
function updateClock() {
    let now = getTimeForTimezone(selectedTimezone);
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    
    let hourAngle = (hours * 30) + (minutes / 2);
    let minuteAngle = (minutes * 6) + (seconds / 10);
    let secondAngle = (seconds * 6);

    hourHand.style.transform = `rotate(${hourAngle}deg)`;
    minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    secondHand.style.transform = `rotate(${secondAngle}deg)`;
    
    secondHand.style.transform = `rotate(${secondAngle}deg)`;

    const displayHours = hours % 12 || 12;
    hrDisplay.textContent = String(displayHours).padStart(2, '0');
    minDisplay.textContent = String(minutes).padStart(2, '0');
    secDisplay.textContent = String(seconds).padStart(2, '0');
    periodDisplay.textContent = hours >= 12 ? 'PM' : 'AM';
    
    tickSound.currentTime = 0;
    tickSound.play();

    updateDateDisplay();

    if (!manualMode) {
        applyLightEffects(hours);
    }
}

// Initialisation du menu déroulant des fuseaux horaires
document.addEventListener('DOMContentLoaded', function() {
    const selectBtn = document.querySelector('.select-btn');
    const fleche = document.getElementById('fleche');
    const regions = document.querySelector('.regions');
    const items = document.querySelectorAll('.item');
    const checkboxes = document.querySelectorAll('.checkbox i');

    selectBtn.addEventListener('click', function() {
        regions.classList.toggle('show');
        fleche.classList.toggle('rotate');
    });

    items.forEach(item => {
        item.addEventListener('click', function() {
            const timezone = this.getAttribute('data-timezone');
            selectedTimezone = timezone;

            items.forEach(it => {
                it.classList.remove('checked');
                const checkbox = it.querySelector('.checkbox i');
                checkbox.className = 'fa-thin fa-square';
            });

            this.classList.add('checked');
            const selectedCheckbox = this.querySelector('.checkbox i');
            selectedCheckbox.className = 'fa-solid fa-square-check';

            regions.classList.remove('show');
            fleche.classList.remove('rotate');

            const selectedItem = document.querySelector(`[data-timezone="${timezone}"] .item-text`).textContent;
            if (selectedItem === "Local Time") {
                selectBtn.textContent = selectedItem;
            } else {
                const parts = selectedItem.split('-');
                if (parts.length >= 3) {
                selectBtn.textContent = parts[2].trim();
                } else if (parts.length === 2) {
                    selectBtn.textContent = parts[1].trim();
                } else {
                    selectBtn.textContent = selectedItem;
                }
            }
        });
    });
    const localItem = document.querySelector('[data-timezone="local"]');
    localItem.classList.add('checked');
    const localCheckbox = localItem.querySelector('.checkbox i');
    localCheckbox.className = 'fa-solid fa-square-check';
});

// Fonction d'initialisation de l'application
function init() {
    createStars();
    setupNavigation();
    updateDateDisplay();
    updateClock();
    setInterval(updateClock, 1000);
}

init();