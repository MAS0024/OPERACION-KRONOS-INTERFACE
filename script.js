const AUDIO_FILES = { 
    key: './sound/key.wav', 
    blip: './sound/blip.wav', 
    enter: './sound/enter.wav', 
    error: './sound/error.wav', 
    alert: './sound/alert.wav' 
};

const AudioPlayer = { 
    play: function(n) { 
        try { 
            const a = new Audio(AUDIO_FILES[n]); 
            a.volume = 0.3; 
            a.play().catch(()=>{}); 
        } catch(e){} 
    } 
};

let autoPlayInterval = null; 
let isAutoPlaying = false;   

const supersList = [
    { 
        name: "UNIVERSAL MAN", 
        powers: "Poderes: manipulación de la densidad atómica", 
        img: "./img/SUPERS/1UNIVERSALMAN.png", 
        status: "TERMINADO",
        threat: "5.8", 
        
        model: "OMNIDROID v.X1", 
        features: "CARACTERÍSTICAS: Locomoción con ruedas, exhibición bisensorial, garras de agarre biarticulares",
        modelImg: "./img/PROTOTIPOS/X1.png", 
        modelStatus: "ACTIVO"
    },
     { 
        name: "PSYCWAVE", 
        powers: "Poderes: previsión psíquica, control del pensamiento, telequinesis", 
        img: "./img/SUPERS/2PSYCWAVE.png", 
        status: "TERMINADO",
        threat: "5.8", 
        
        model: "OMNIDROID v.X1", 
        features: "CARACTERÍSTICAS: Locomoción con ruedas, exhibición bisensorial, garras de agarre biarticulares",
        modelImg: "./img/PROTOTIPOS/X1.png", 
        modelStatus: "ACTIVO"
    },
    { 
        name: "EVERSEER", 
        powers: "PODERES: telepatía, clarividencia, magnivisión", 
        img: "./img/SUPERS/3EVERSEER.png", 
        status: "TERMINADO",
        threat: "6.3",
        
        model: "OMNIDROID v.X1", 
        features: "CARACTERÍSTICAS: Locomoción con ruedas, exhibición bisensorial, garras de agarre biarticulares",
        modelImg: "./img/PROTOTIPOS/X1.png", 
        modelStatus: "ACTIVO"
    },
    { 
        name: "MACRO BURST", 
        powers: "PODERES: proyección de fuerza de alta densidad", 
        img: "./img/SUPERS/4MACROBURST.png", 
        status: "ACTIVO",
        threat: "6.3",
        
        model: "OMNIDROID v.X1", 
        features: "CARACTERÍSTICAS: Locomoción con ruedas, exhibición bisensorial, garras de agarre biarticulares",
        modelImg: "./img/PROTOTIPOS/X1.png", 
        modelStatus: "TERMINADO"
    },
        { 
        name: "MACRO BURST", 
        powers: "PODERES: proyección de fuerza de alta densidad", 
        img: "./img/SUPERS/4MACROBURST.png", 
        status: "TERMINADO",
        threat: "6.3",
        
        model: "OMNIDROID v.X2", 
        features: "CARACTERÍSTICAS: Locomoción bípeda, conjunto sensorial unidireccional, garras de agarre biarticuladas",
        modelImg: "./img/PROTOTIPOS/X2.png", 
        modelStatus: "ACTIVO"
    },
    { 
        name: "PHYLANGE", 
        powers: "PODERES: proyección de campo sonoro", 
        img: "./img/SUPERS/5PHYLANGE.png", 
        status: "TERMINADO",
        threat: "6.3",
        
        model: "OMNIDROID v.X2", 
        features: "CARACTERÍSTICAS: Locomoción bípeda, conjunto sensorial unidireccional, garras de agarre biarticuladas",
        modelImg: "./img/PROTOTIPOS/X2.png", 
        modelStatus: "ACTIVO"
    },
   { 
        name: "BLAZE STONE", 
        powers: "PODERES: descarga pirotécnica, control de incendios", 
        img: "./img/SUPERS/6BLAZESTONE.png", 
        status: "TERMINADO",
        threat: "6.3",
        
        model: "OMNIDROID v.X2", 
        features: "CARACTERÍSTICAS: Locomoción bípeda, conjunto sensorial unidireccional, garras de agarre biarticuladas",
        modelImg: "./img/PROTOTIPOS/X2.png", 
        modelStatus: "ACTIVO"
    },
    { 
        name: "DYNAGUY", 
        powers: "PODERES: Vuelo, rayo de desintegración", 
        img: "./img/SUPERS/7DYNAGUY.png", 
        status: "ACTIVO",
        threat: "6.3",
        
        model: "OMNIDROID v.X2", 
        features: "CARACTERÍSTICAS: Locomoción bípeda, conjunto sensorial unidireccional, garras de agarre biarticuladas",
        modelImg: "./img/PROTOTIPOS/X2.png", 
        modelStatus: "TERMINADO"
    },
    { 
        name: "DYNAGUY", 
        powers: "PODERES: Vuelo, rayo de desintegración", 
        img: "./img/SUPERS/7DYNAGUY.png", 
        status: "TERMINADO",
        threat: "6.3",
        
        model: "OMNIDROID v.X3", 
        features: "CARACTERÍSTICAS: Locomoción trípeda suspendida/garras de agarre, conjunto sensorial unidireccional",
        modelImg: "./img/PROTOTIPOS/X3.png", 
        modelStatus: "ACTIVO"
    },
    { 
        name: "DOWNBURST", 
        powers: "PODERES: Vuelo, expulsión gaseosa", 
        img: "./img/SUPERS/8DOWNBURST.png", 
        status: "TERMINADO",
        threat: "6.3",
        
        model: "OMNIDROID v.X3", 
        features: "CARACTERÍSTICAS: Locomoción trípeda suspendida/garras de agarre, conjunto sensorial unidireccional",
        modelImg: "./img/PROTOTIPOS/X3.png", 
        modelStatus: "ACTIVO"
    },
];
let currentSongIdx = 0;

let currentPhase = 0; 
const MAX_PHASES = 3; 

let menuIndex = 0; 
const menuTotal = 3;

function handleInput(el) { 
    el.value = el.value.toUpperCase(); 
    AudioPlayer.play('key'); 
    const display = document.getElementById('pass-display');
    if (el.value.length === 0) { 
        display.innerHTML = 'CONTRASEÑA<span class="cursor-blink">_</span>'; 
    } else { 
        display.innerHTML = el.value + '<span class="cursor-blink">_</span>'; 
    }
}

function checkPass() { 
    const i = document.getElementById('pass-input'); 
    if(i.value === 'MARS' || i.value === 'KRONOS') { 
        navTo('screen-menu'); 
    } else { 
        AudioPlayer.play('error'); 
        const display = document.getElementById('pass-display');
        display.style.color = 'var(--alert-red)';
        display.innerHTML = 'DENEGADO<span class="cursor-blink">_</span>';
        i.value = '';
        setTimeout(() => { 
            display.style.color = 'var(--dark-ui)'; 
            display.innerHTML = 'CONTRASEÑA<span class="cursor-blink">_</span>'; 
        }, 1000); 
    } 
}

function navTo(id) {
    AudioPlayer.play('enter');
    stopAutoPlay();
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    if(id !== 'screen-omnidroid') {
        const sharedOverlay = document.getElementById('phases-overlay');
        if(sharedOverlay) sharedOverlay.classList.remove('active');
    }

    if(id === 'screen-password') { 
        const p = document.getElementById('pass-input'); 
        p.value = ''; 
        p.focus(); 
        document.getElementById('pass-display').innerHTML = 'CONTRASEÑA<span class="cursor-blink">_</span>';
    }
    else if (id === 'screen-menu') { 
        updateMenuVisuals(); 
    }
    else if (id === 'screen-omnidroid') { 
        setPhase(currentPhase); 
    }
    else if (id === 'screen-supers') { 
        updateSuperDisplay(); 
        startAutoPlay(); 
    }
}

function hoverMenu(index) {
    if (menuIndex !== index) {
        menuIndex = index;
        updateMenuVisuals();
        AudioPlayer.play('blip');
    }
}

function updateMenuVisuals() { 
    for(let i=0; i<menuTotal; i++) {
        const el = document.getElementById(`menu-${i}`);
        if(el) el.classList.remove('selected'); 
    }
    const selectedEl = document.getElementById(`menu-${menuIndex}`);
    if(selectedEl) selectedEl.classList.add('selected'); 
}

function clickMenu(index) { 
    AudioPlayer.play('blip'); 
    menuIndex = index; 
    updateMenuVisuals(); 
    executeMenuAction(); 
}

function executeMenuAction() {
    if(menuIndex === 0) navTo('screen-omnidroid'); 
    else if(menuIndex === 1) navTo('screen-supers'); 
    else if(menuIndex === 2) navTo('screen-island'); 
}

document.addEventListener('keydown', (e) => {
    const activeScreen = document.querySelector('.screen.active');
    if(!activeScreen) return;
    
    const activeId = activeScreen.id;

    if (activeId === 'screen-password' && e.key === 'Enter') checkPass();
    
    else if (activeId === 'screen-menu') { 
        if (e.key === 'ArrowUp') {
            AudioPlayer.play('blip');
            menuIndex = (menuIndex - 1 + menuTotal) % menuTotal;
            updateMenuVisuals();
        } 
        else if (e.key === 'ArrowDown') { 
            AudioPlayer.play('blip');
            menuIndex = (menuIndex + 1) % menuTotal;
            updateMenuVisuals();
        } 
        else if (e.key === 'Enter') executeMenuAction(); 
        else if (e.key === 'Escape') navTo('screen-password'); 
    }
    
    else if (activeId === 'screen-supers') { 
        if (e.key === 'ArrowRight') { manualChangeSong('next'); } 
        else if (e.key === 'ArrowLeft') { manualChangeSong('prev'); } 
        else if (e.key === 'Escape') navTo('screen-menu'); 
    }
    
    else if (activeId === 'screen-omnidroid') { 
        if (e.key === 'ArrowRight' && currentPhase < MAX_PHASES) setPhase(currentPhase + 1); 
        else if (e.key === 'ArrowLeft' && currentPhase > 0) setPhase(currentPhase - 1); 
        else if (e.key === 'Escape') navTo('screen-menu'); 
    }
    
    else if (activeId === 'screen-island' && e.key === 'Escape') navTo('screen-menu');
});

function startAutoPlay() {
    if(isAutoPlaying) return;
    isAutoPlaying = true;
    autoPlayInterval = setInterval(() => { 
        currentSongIdx = (currentSongIdx + 1) % supersList.length; 
        updateSuperDisplay(); 
    }, 1500); 
}

function stopAutoPlay() { 
    isAutoPlaying = false; 
    clearInterval(autoPlayInterval); 
}

function manualChangeSong(direction) {
    stopAutoPlay(); 
    AudioPlayer.play('blip');
    if(direction === 'next') { 
        currentSongIdx = (currentSongIdx + 1) % supersList.length; 
    } else { 
        currentSongIdx = (currentSongIdx - 1 + supersList.length) % supersList.length; 
    }
    updateSuperDisplay();
}

function updateSuperDisplay() { 
    const s = supersList[currentSongIdx]; 
    
    document.getElementById('super-name').innerText = s.name; 
    document.getElementById('super-powers').innerText = s.powers; 
    document.getElementById('super-threat').innerText = "NIVEL DE AMENAZA: " + s.threat;
    
    document.getElementById('droid-model').innerText = s.model;
    document.getElementById('droid-features').innerText = s.features;
    
    document.getElementById('super-img').style.backgroundImage = `url(${s.img})`; 
    document.getElementById('droid-img').style.backgroundImage = `url(${s.modelImg})`; 

    const superBar = document.getElementById('super-term-bar');
    const droidBar = document.getElementById('droid-term-bar');
    
    superBar.classList.remove('active-alert'); 
    droidBar.classList.remove('active-alert');
    
    void superBar.offsetWidth; 
    void droidBar.offsetWidth;

    if (s.status === 'TERMINADO') { 
        superBar.querySelector('.terminated-text').innerText = "TERMINADO";
        superBar.classList.add('active-alert'); 
    }

    let droidStatusText = s.modelStatus;
    if(droidStatusText === 'TERMINATED') droidStatusText = 'TERMINADO';
    if(droidStatusText === 'DESTROYED') droidStatusText = 'DESTRUIDO';
    if(droidStatusText === 'ACTIVE') droidStatusText = 'ACTIVO';
    if(droidStatusText === 'READY') droidStatusText = 'LISTO';

    if (s.modelStatus === 'TERMINADO' || s.modelStatus === 'DESTRUIDO' || s.modelStatus === 'TERMINATED' || s.modelStatus === 'DESTROYED') { 
        droidBar.querySelector('.terminated-text').innerText = droidStatusText;
        droidBar.classList.add('active-alert'); 
    }

    if (s.status === 'TERMINADO' || s.modelStatus === 'TERMINADO' || s.modelStatus === 'DESTRUIDO') {
        setTimeout(() => AudioPlayer.play('alert'), 250);
    }
}

function setPhase(n) { 
    AudioPlayer.play('blip'); 
    currentPhase = n; 
    
    const panels = document.querySelectorAll('.phase-panel');
    panels.forEach(p => {
        p.classList.remove('active-panel');
        p.classList.remove('animate-flight'); 
    });

    const activePanel = document.getElementById(`panel-phase-${n}`);
    if(activePanel) {
        activePanel.classList.add('active-panel');
        if(n === 2) {
            void activePanel.offsetWidth; 
            activePanel.classList.add('animate-flight');
        }
    }

    const sharedOverlay = document.getElementById('phases-overlay');
    if(sharedOverlay) {
        if(n >= 1 && n <= 3) {
            sharedOverlay.classList.add('active');
        } else {
            sharedOverlay.classList.remove('active');
        }
    }

    const buttons = document.querySelectorAll('.phase-num');
    buttons.forEach(btn => btn.classList.remove('selected'));
    
    const selectedBtn = document.getElementById(`phase-btn-${n}`);
    if(selectedBtn) selectedBtn.classList.add('selected');
}

const countDownDuration = (8 * 60 * 60 * 1000) + (10 * 60 * 1000) + (42 * 1000);
const targetDate = new Date().getTime() + countDownDuration;

function updateCountdown() { 
    const now = new Date().getTime(), d = targetDate - now; 
    
    if(d < 0) {
        document.getElementById("cd-hours").innerText = "00"; 
        document.getElementById("cd-mins").innerText = "00"; 
        document.getElementById("cd-secs").innerText = "00";
        return;
    }

    document.getElementById("cd-hours").innerText = String(Math.floor((d % 86400000) / 3600000)).padStart(2, '0'); 
    document.getElementById("cd-mins").innerText = String(Math.floor((d % 3600000) / 60000)).padStart(2, '0'); 
    document.getElementById("cd-secs").innerText = String(Math.floor((d % 60000) / 1000)).padStart(2, '0'); 
}

updateMenuVisuals(); 
setInterval(updateCountdown, 1000); 
updateCountdown();