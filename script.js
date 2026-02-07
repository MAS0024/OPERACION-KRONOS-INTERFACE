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
        name: "TRADEWIND", 
        powers: "POWERS: ELEMENTAL CONTROL OF WIND AND STORMS", 
        img: "./img/SUPERS/1-dynaguy.png", 
        status: "TERMINATED",
        threat: "5.8", 
        
        model: "OMNIDROID v.X4", 
        features: "FEATURES: QUADRA-PEDAL LOCOMOTION, GRAPPLING-CLAWS, SENSORY ARRAY.",
        modelImg: "./img/PROTOTIPOS/1.png", 
        modelStatus: "ACTIVE"
    },
    { 
        name: "GAZERBEAM", 
        powers: "POWERS: GENERATION OF HEAT BLASTS FROM EYES", 
        img: "./img/SUPERS/2-downburst.png", 
        status: "ACTIVE",
        threat: "6.3",
        
        model: "OMNIDROID v.X5", 
        features: "FEATURES: OMNI-DIRECTIONAL SENSORS, IMPROVED AI, HEAT SHIELDS.",
        modelImg: "./img/PROTOTIPOS/1.png",
        modelStatus: "TERMINATED"
    },
    { 
        name: "MR. INCREDIBLE", 
        powers: "POWERS: ENHANCED STRENGTH AND DURABILITY", 
        img: "./img/SUPERS/2 -downburst.png", 
        status: "TERMINATED", 
        threat: "9.1",
        
        model: "OMNIDROID v.10", 
        features: "FEATURES: SIX-LEGGED LOCOMOTION, AI LEARNING, INDESTRUCTIBLE HULL.",
        modelImg: "./img/PROTOTIPOS/2.png",
        modelStatus: "READY"
    }
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
        display.innerHTML = 'DENIED<span class="cursor-blink">_</span>';
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
    }, 2000); 
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
    document.getElementById('super-threat').innerText = "THREAT RATING: " + s.threat;
    
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

    if (s.status === 'TERMINATED') { 
        superBar.querySelector('.terminated-text').innerText = "TERMINATED";
        superBar.classList.add('active-alert'); 
    }

    if (s.modelStatus === 'TERMINATED' || s.modelStatus === 'DESTROYED') { 
        droidBar.querySelector('.terminated-text').innerText = s.modelStatus;
        droidBar.classList.add('active-alert'); 
    }

    if (s.status === 'TERMINATED' || s.modelStatus === 'TERMINATED' || s.modelStatus === 'DESTROYED') {
        setTimeout(() => AudioPlayer.play('alert'), 500);
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

    const buttons = document.querySelectorAll('.phase-num');
    buttons.forEach(btn => btn.classList.remove('selected'));
    
    const selectedBtn = document.getElementById(`phase-btn-${n}`);
    if(selectedBtn) selectedBtn.classList.add('selected');
}

const targetDate = new Date('2026-04-01T00:00:00').getTime();
function updateCountdown() { 
    const now = new Date().getTime(), d = targetDate - now; 
    if(d < 0) return; 
    document.getElementById("cd-days").innerText = String(Math.floor(d / 86400000)).padStart(2, '0'); 
    document.getElementById("cd-hours").innerText = String(Math.floor((d % 86400000) / 3600000)).padStart(2, '0'); 
    document.getElementById("cd-mins").innerText = String(Math.floor((d % 3600000) / 60000)).padStart(2, '0'); 
    document.getElementById("cd-secs").innerText = String(Math.floor((d % 60000) / 1000)).padStart(2, '0'); 
}

updateMenuVisuals(); 
setInterval(updateCountdown, 1000); 
updateCountdown();