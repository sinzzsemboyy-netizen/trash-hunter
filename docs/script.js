/**
     * ============================================================================
     * TRASH HUNTER - GAME EDUKASI PEMILAH SAMPAH
     * Arsitektur & Logika Game Lengkap (Web Audio, State, Drag & Drop, Level)
     * ============================================================================
     */

    // 1. KONFIGURASI 5 LEVEL (Jumlah sampah berbeda tiap level)
    const LEVELS = [
      { id: 1, name: "Level 1: Sekolah", trashCount: 8, theme: "bg-theme-school", icon: "🏫", badgeColor: "btn-yellow" },
      { id: 2, name: "Level 2: Taman Kota", trashCount: 12, theme: "bg-theme-park", icon: "🌳", badgeColor: "btn-blue" },
      { id: 3, name: "Level 3: Rumah", trashCount: 16, theme: "bg-theme-home", icon: "🏠", badgeColor: "btn-purple" },
      { id: 4, name: "Level 4: Pantai", trashCount: 20, theme: "bg-theme-beach", icon: "🏖️", badgeColor: "btn-yellow" },
      { id: 5, name: "Level 5: Kota Hijau", trashCount: 25, theme: "bg-theme-city", icon: "🏙️", badgeColor: "btn-blue" }
    ];

    // 2. DATABASE ITEM SAMPAH (Organik, Anorganik, Daur Ulang dengan SVG Kustom)
    const TRASH_CATALOG = [
      // --- ORGANIK ---
      {
        id: "pisang", name: "Kulit Pisang", category: "organik",
        hint: "Kulit pisang mudah membusuk, masuk tong Organik!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><path d="M30 12 Q34 32 14 48 Q26 46 34 34 Q38 48 50 48 Q36 32 34 12 Z" fill="#facc15" stroke="#713f12" stroke-width="3" stroke-linejoin="round"/><rect x="29" y="8" width="6" height="6" rx="2" fill="#713f12"/></svg>`
      },
      {
        id: "daun", name: "Daun Kering", category: "organik",
        hint: "Daun kering berasal dari alam, masuk tong Organik!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><path d="M14 50 C14 22 36 12 52 12 C52 28 42 50 14 50 Z" fill="#d97706" stroke="#451a03" stroke-width="3" stroke-linejoin="round"/><path d="M12 52 L44 20" stroke="#451a03" stroke-width="3" stroke-linecap="round"/></svg>`
      },
      {
        id: "apel", name: "Sisa Apel", category: "organik",
        hint: "Sisa buah apel dapat dikompos, masuk tong Organik!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><path d="M20 16 H44 Q36 32 44 48 H20 Q28 32 20 16 Z" fill="#fef3c7" stroke="#78350f" stroke-width="3"/><path d="M18 16 Q32 10 46 16" fill="#ef4444" stroke="#7f1d1d" stroke-width="3"/><path d="M18 48 Q32 54 46 48" fill="#ef4444" stroke="#7f1d1d" stroke-width="3"/><line x1="32" y1="8" x2="32" y2="14" stroke="#451a03" stroke-width="3" stroke-linecap="round"/></svg>`
      },
      {
        id: "ikan", name: "Tulang Ikan", category: "organik",
        hint: "Sisa lauk/tulang ikan adalah sampah Organik!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><line x1="16" y1="32" x2="48" y2="32" stroke="#f8fafc" stroke-width="4" stroke-linecap="round"/><polygon points="10,22 20,32 10,42" fill="#e2e8f0" stroke="#334155" stroke-width="2.5"/><polygon points="54,24 44,32 54,40" fill="#e2e8f0" stroke="#334155" stroke-width="2.5"/><line x1="26" y1="22" x2="26" y2="42" stroke="#334155" stroke-width="3"/><line x1="34" y1="20" x2="34" y2="44" stroke="#334155" stroke-width="3"/></svg>`
      },
      {
        id: "telur", name: "Cangkang Telur", category: "organik",
        hint: "Cangkang telur bagus untuk pupuk kompos Organik!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><path d="M16 34 C16 48 48 48 48 34 L40 28 L32 36 L24 28 Z" fill="#fde68a" stroke="#78350f" stroke-width="3" stroke-linejoin="round"/></svg>`
      },
      {
        id: "sayur", name: "Sisa Sayuran", category: "organik",
        hint: "Potongan sayuran adalah sampah Organik!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><circle cx="28" cy="34" r="14" fill="#4ade80" stroke="#14532d" stroke-width="3"/><circle cx="38" cy="30" r="12" fill="#22c55e" stroke="#14532d" stroke-width="3"/></svg>`
      },

      // --- ANORGANIK ---
      {
        id: "botol_plastik", name: "Botol Plastik", category: "anorganik",
        hint: "Botol plastik sulit terurai tanah, masuk tong Anorganik!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><rect x="22" y="20" width="20" height="34" rx="6" fill="#bae6fd" stroke="#0369a1" stroke-width="3"/><rect x="27" y="11" width="10" height="9" rx="2" fill="#0284c7" stroke="#0c4a6e" stroke-width="2.5"/><rect x="22" y="31" width="20" height="10" fill="#38bdf8"/></svg>`
      },
      {
        id: "styrofoam", name: "Wadah Styrofoam", category: "anorganik",
        hint: "Styrofoam tidak mudah terurai, masuk tong Anorganik!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><polygon points="14,34 50,34 45,48 19,48" fill="#f1f5f9" stroke="#475569" stroke-width="3" stroke-linejoin="round"/><polygon points="18,22 46,22 50,34 14,34" fill="#ffffff" stroke="#475569" stroke-width="3" stroke-linejoin="round"/></svg>`
      },
      {
        id: "bungkus_snack", name: "Bungkus Snack", category: "anorganik",
        hint: "Kemasan plastik makanan masuk tong Anorganik!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><rect x="16" y="14" width="32" height="36" rx="4" fill="#f97316" stroke="#7c2d12" stroke-width="3"/><polygon points="22,26 42,26 32,38" fill="#facc15"/></svg>`
      },
      {
        id: "kresek", name: "Kantong Kresek", category: "anorganik",
        hint: "Kantong plastik kresek masuk tong Anorganik!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><path d="M20 24 V14 H26 V24 H38 V14 H44 V24 L48 50 H16 Z" fill="#e879f9" stroke="#701a75" stroke-width="3" stroke-linejoin="round"/></svg>`
      },
      {
        id: "gelas_plastik", name: "Gelas Plastik", category: "anorganik",
        hint: "Gelas minuman plastik masuk tong Anorganik!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><polygon points="20,22 44,22 40,50 24,50" fill="#e0f2fe" stroke="#0369a1" stroke-width="3"/><line x1="34" y1="10" x2="30" y2="22" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round"/></svg>`
      },
      {
        id: "sedotan", name: "Sedotan Plastik", category: "anorganik",
        hint: "Sedotan plastik sekali pakai masuk tong Anorganik!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><polyline points="18,48 38,20 48,24" fill="none" stroke="#ec4899" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><polyline points="18,48 38,20 48,24" fill="none" stroke="#831843" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      },

      // --- DAUR ULANG ---
      {
        id: "kaleng", name: "Kaleng Minuman", category: "daurulang",
        hint: "Kaleng aluminium bisa dilebur & didaur ulang!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><rect x="20" y="16" width="24" height="34" rx="5" fill="#ef4444" stroke="#7f1d1d" stroke-width="3"/><ellipse cx="32" cy="16" rx="12" ry="4" fill="#cbd5e1" stroke="#334155" stroke-width="2.5"/><path d="M24 30 Q32 26 40 30" stroke="#ffffff" stroke-width="3" fill="none"/></svg>`
      },
      {
        id: "kardus", name: "Kardus Bekas", category: "daurulang",
        hint: "Kardus kertas bisa diolah kembali di tong Daur Ulang!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><rect x="14" y="24" width="36" height="26" rx="3" fill="#d97706" stroke="#451a03" stroke-width="3"/><polygon points="14,24 22,14 42,14 50,24" fill="#f59e0b" stroke="#451a03" stroke-width="3" stroke-linejoin="round"/></svg>`
      },
      {
        id: "koran", name: "Koran Bekas", category: "daurulang",
        hint: "Kertas koran bekas masuk tong Daur Ulang!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><rect x="14" y="16" width="36" height="32" rx="3" fill="#e2e8f0" stroke="#334155" stroke-width="3"/><rect x="20" y="22" width="12" height="10" fill="#64748b"/><line x1="36" y1="24" x2="44" y2="24" stroke="#334155" stroke-width="2.5"/><line x1="36" y1="30" x2="44" y2="30" stroke="#334155" stroke-width="2.5"/><line x1="20" y1="38" x2="44" y2="38" stroke="#334155" stroke-width="2.5"/></svg>`
      },
      {
        id: "kertas_remas", name: "Kertas Remas", category: "daurulang",
        hint: "Kertas bekas bisa didaur ulang menjadi kertas baru!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><polygon points="22,16 38,14 48,26 44,44 26,48 16,36" fill="#f8fafc" stroke="#475569" stroke-width="3" stroke-linejoin="round"/><polyline points="24,24 34,30 28,40" fill="none" stroke="#94a3b8" stroke-width="2.5"/></svg>`
      },
      {
        id: "kotak_jus", name: "Kotak Jus Karton", category: "daurulang",
        hint: "Kemasan karton minuman masuk tong Daur Ulang!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><rect x="20" y="18" width="24" height="32" rx="3" fill="#fb923c" stroke="#7c2d12" stroke-width="3"/><circle cx="32" cy="34" r="6" fill="#fde047"/><polyline points="38,18 42,10 46,12" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/></svg>`
      },
      {
        id: "botol_kaca", name: "Botol Kaca", category: "daurulang",
        hint: "Botol kaca dapat didaur ulang tanpa batas!",
        svg: `<svg viewBox="0 0 64 64" class="w-12 h-12 sm:w-14 sm:h-14"><path d="M27 12 H37 V22 L42 28 V50 H22 V28 L27 22 Z" fill="#34d399" stroke="#065f46" stroke-width="3" stroke-linejoin="round"/></svg>`
      }
    ];

    // 3. STATE APLIKASI & PENYIMPANAN PROGRES
    const STORAGE_KEY = "trash_hunter_progress_v1";
    let gameState = {
      unlockedLevel: 1,
      levelStars: {}, // { 1: 3, 2: 2, ... }
      musicEnabled: true,
      sfxEnabled: true,
      currentLevel: 1,
      score: 0,
      timeLeft: 90,
      totalTrash: 8,
      sortedCount: 0,
      mistakes: 0,
      selectedTrashId: null,
      timerInterval: null,
      isPlaying: false
    };

    function loadProgress() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          gameState.unlockedLevel = Math.min(5, Math.max(1, parsed.unlockedLevel || 1));
          gameState.levelStars = parsed.levelStars || {};
          if (typeof parsed.musicEnabled === "boolean") gameState.musicEnabled = parsed.musicEnabled;
          if (typeof parsed.sfxEnabled === "boolean") gameState.sfxEnabled = parsed.sfxEnabled;
        }
      } catch (e) {
        console.warn("Gagal memuat progres:", e);
      }
      updateAudioTogglesUI();
    }

    function saveProgress() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          unlockedLevel: gameState.unlockedLevel,
          levelStars: gameState.levelStars,
          musicEnabled: gameState.musicEnabled,
          sfxEnabled: gameState.sfxEnabled
        }));
      } catch (e) {
        console.warn("Gagal menyimpan progres:", e);
      }
    }

    function resetProgress() {
      gameState.unlockedLevel = 1;
      gameState.levelStars = {};
      saveProgress();
      playSfx("click");
      renderLevels();
      showFloatingToast("Progres direset! Level 2-5 terkunci kembali.");
    }

    // 4. WEB AUDIO API (SINTESIS MUSIK & EFEK SUARA TANPA FILE EKSTERNAL)
    let audioCtx = null;
    let bgmTimer = null;
    let bgmStep = 0;

    function initAudioContext() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
        }
      }
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
      }
    }

    function playTone(freq, duration, type = "sine", volume = 0.12, delay = 0) {
      if (!audioCtx || !gameState.sfxEnabled) return;
      const now = audioCtx.currentTime + delay;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + duration);
    }

    function playSfx(type) {
      initAudioContext();
      if (!gameState.sfxEnabled) return;

      if (type === "click") {
        playTone(520, 0.08, "triangle", 0.14, 0);
        playTone(720, 0.09, "triangle", 0.12, 0.04);
      } else if (type === "correct") {
        playTone(523.25, 0.12, "sine", 0.16, 0);     // C5
        playTone(659.25, 0.12, "sine", 0.16, 0.07);  // E5
        playTone(783.99, 0.22, "sine", 0.18, 0.14);  // G5
      } else if (type === "wrong") {
        playTone(220, 0.16, "sawtooth", 0.14, 0);
        playTone(165, 0.24, "sawtooth", 0.14, 0.12);
      } else if (type === "win") {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((n, idx) => playTone(n, 0.22, "triangle", 0.18, idx * 0.1));
      } else if (type === "lose") {
        const notes = [392, 349.23, 329.63, 261.63];
        notes.forEach((n, idx) => playTone(n, 0.24, "sawtooth", 0.12, idx * 0.14));
      }
    }

    // Melodi latar ceria sederhana
    const BGM_NOTES = [
      261.63, 329.63, 392.00, 329.63,
      293.66, 349.23, 440.00, 349.23,
      329.63, 392.00, 493.88, 392.00,
      392.00, 329.63, 293.66, 261.63
    ];

    function startBgm() {
      if (bgmTimer || !gameState.musicEnabled) return;
      bgmTimer = setInterval(() => {
        if (!gameState.musicEnabled || !audioCtx || audioCtx.state !== "running") return;
        const freq = BGM_NOTES[bgmStep % BGM_NOTES.length];
        bgmStep++;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.045, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      }, 340);
    }

    function stopBgm() {
      if (bgmTimer) {
        clearInterval(bgmTimer);
        bgmTimer = null;
      }
    }

    function toggleAudioSetting(kind) {
      initAudioContext();
      if (kind === "music") {
        gameState.musicEnabled = !gameState.musicEnabled;
        if (gameState.musicEnabled) startBgm();
        else stopBgm();
      } else if (kind === "sfx") {
        gameState.sfxEnabled = !gameState.sfxEnabled;
      }
      playSfx("click");
      updateAudioTogglesUI();
      saveProgress();
    }

    function updateAudioTogglesUI() {
      const mTrack = document.getElementById("toggle-music");
      const sTrack = document.getElementById("toggle-sfx");
      if (mTrack) mTrack.classList.toggle("active", gameState.musicEnabled);
      if (sTrack) sTrack.classList.toggle("active", gameState.sfxEnabled);
    }

    // 5. NAVIGASI ANTAR HALAMAN
    function navigateTo(screenName) {
      initAudioContext();
      if (gameState.musicEnabled) startBgm();
      playSfx("click");

      // Hentikan timer game jika keluar dari layar game
      if (screenName !== "game") {
        stopGameTimer();
        gameState.isPlaying = false;
      }

      const screens = ["menu", "settings", "howto", "levels", "game", "result"];
      screens.forEach(s => {
        const el = document.getElementById(`screen-${s}`);
        if (el) el.classList.add("hidden");
      });

      const target = document.getElementById(`screen-${screenName}`);
      if (target) target.classList.remove("hidden");

      // Atur visibilitas maskot agar tidak menghalangi layar permainan
      const mascots = document.getElementById("mascots-layer");
      if (screenName === "game") {
        mascots.classList.add("opacity-20", "md:opacity-90");
      } else {
        mascots.classList.remove("opacity-20", "md:opacity-90");
        document.getElementById("app-body").className = "bg-theme-school";
      }

      if (screenName === "levels") {
        renderLevels();
      }
    }

    // 6. RENDER HALAMAN PILIH LEVEL (5 LEVEL + KUNCI)
    function renderLevels() {
      const container = document.getElementById("levels-container");
      container.innerHTML = "";

      LEVELS.forEach(lvl => {
        const isUnlocked = lvl.id <= gameState.unlockedLevel;
        const starsCount = gameState.levelStars[lvl.id] || 0;
        const starsDisplay = starsCount > 0 ? "⭐".repeat(starsCount) : (isUnlocked ? "Siap Dimainkan" : "Terkunci");

        const btn = document.createElement("button");
        btn.disabled = !isUnlocked;
        btn.className = `btn-glossy ${lvl.badgeColor} w-full py-3 px-5 flex items-center justify-between text-left`;
        btn.onclick = () => startLevel(lvl.id);

        btn.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-white/95 border-2 border-amber-950 flex items-center justify-center text-2xl shrink-0 shadow">
              ${isUnlocked ? lvl.icon : "🔒"}
            </div>
            <div>
              <div class="font-cartoon text-lg sm:text-xl text-white text-stroke-sm leading-tight">
                ${lvl.name}
              </div>
              <div class="text-xs font-extrabold text-amber-950 bg-white/80 rounded-full px-2.5 py-0.5 inline-block mt-0.5">
                ${lvl.trashCount} Sampah • ${starsDisplay}
              </div>
            </div>
          </div>
          <div class="text-2xl text-white drop-shadow">
            ${isUnlocked ? "▶" : "🔒"}
          </div>
        `;
        container.appendChild(btn);
      });
    }

    // 7. LOGIKA PERMAINAN (GAMEPLAY)
    function startLevel(levelId) {
      const levelCfg = LEVELS.find(l => l.id === levelId) || LEVELS[0];
      gameState.currentLevel = levelCfg.id;
      gameState.score = 0;
      gameState.timeLeft = 90; // 1 menit 30 detik
      gameState.totalTrash = levelCfg.trashCount;
      gameState.sortedCount = 0;
      gameState.mistakes = 0;
      gameState.selectedTrashId = null;
      gameState.isPlaying = true;

      // Terapkan tema latar level
      document.getElementById("app-body").className = levelCfg.theme;

      navigateTo("game");
      updateHudUI();
      spawnRandomTrash(levelCfg.trashCount);

      const hintBanner = document.getElementById("game-hint-banner");
      hintBanner.textContent = `${levelCfg.name}: Pilah ${levelCfg.trashCount} sampah sebelum waktu habis!`;
      hintBanner.className = "bg-white/95 border-2 border-amber-900 rounded-full px-4 py-1 text-xs sm:text-sm font-extrabold text-amber-950 shadow transition-all";

      startGameTimer();
    }

    function startGameTimer() {
      stopGameTimer();
      gameState.timerInterval = setInterval(() => {
        if (!gameState.isPlaying) return;
        gameState.timeLeft--;
        updateHudUI();

        if (gameState.timeLeft <= 0) {
          gameState.timeLeft = 0;
          updateHudUI();
          finishLevel(false);
        }
      }, 1000);
    }

    function stopGameTimer() {
      if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
      }
    }

    function updateHudUI() {
      const mins = Math.floor(gameState.timeLeft / 60);
      const secs = gameState.timeLeft % 60;
      const formattedTime = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

      document.getElementById("hud-level-label").textContent = `Level ${gameState.currentLevel}`;
      const timerEl = document.getElementById("hud-timer-text");
      timerEl.textContent = formattedTime;
      timerEl.className = gameState.timeLeft <= 15
        ? "text-sm font-cartoon text-red-600 animate-pulse"
        : "text-sm font-cartoon text-sky-800";

      const pct = Math.max(0, (gameState.timeLeft / 90) * 100);
      const barEl = document.getElementById("hud-timer-bar");
      barEl.style.width = `${pct}%`;
      if (gameState.timeLeft <= 15) {
        barEl.className = "h-full bg-red-500 transition-all duration-500";
      } else {
        barEl.className = "h-full bg-gradient-to-r from-cyan-400 to-emerald-500 transition-all duration-500";
      }

      document.getElementById("hud-score").textContent = gameState.score;
      document.getElementById("hud-remaining").textContent = gameState.totalTrash - gameState.sortedCount;
    }

    // Menghasilkan sampah secara acak dari 3 kategori
    function spawnRandomTrash(count) {
      const tray = document.getElementById("trash-tray");
      tray.innerHTML = "";

      const categories = ["organik", "anorganik", "daurulang"];
      const itemsToSpawn = [];

      // Pastikan minimal setiap kategori terwakili secara seimbang lalu acak sisanya
      for (let i = 0; i < count; i++) {
        const cat = categories[i % categories.length];
        const pool = TRASH_CATALOG.filter(item => item.category === cat);
        const randomItem = pool[Math.floor(Math.random() * pool.length)];
        itemsToSpawn.push({
          ...randomItem,
          uid: `trash_${i}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
        });
      }

      // Acak urutan array (Fisher-Yates Shuffle)
      for (let i = itemsToSpawn.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [itemsToSpawn[i], itemsToSpawn[j]] = [itemsToSpawn[j], itemsToSpawn[i]];
      }

      itemsToSpawn.forEach(item => {
        const card = document.createElement("div");
        card.id = item.uid;
        card.dataset.category = item.category;
        card.dataset.name = item.name;
        card.dataset.hint = item.hint;
        card.className = "trash-item bg-white/95 border-2 border-amber-900 rounded-2xl p-1.5 sm:p-2 flex flex-col items-center shadow-md relative";
        card.innerHTML = `
          ${item.svg}
          <span class="text-[10px] sm:text-xs font-extrabold text-amber-950 leading-tight mt-0.5 text-center max-w-[76px] truncate">
            ${item.name}
          </span>
        `;

        setupTrashInteraction(card);
        tray.appendChild(card);
      });
    }

    // 8. INTERAKSI DRAG-AND-DROP (POINTER EVENTS) & KLIK-PILIH
    function setupTrashInteraction(el) {
      let startX = 0, startY = 0;
      let isDragging = false;
      let cloneEl = null;

      el.addEventListener("pointerdown", (e) => {
        if (!gameState.isPlaying) return;
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        isDragging = false;

        const onPointerMove = (moveEvent) => {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;

          if (!isDragging && Math.hypot(dx, dy) > 8) {
            isDragging = true;
            selectTrashCard(el.id);

            // Buat kloning melayang agar mulus di atas semua elemen
            const rect = el.getBoundingClientRect();
            cloneEl = el.cloneNode(true);
            cloneEl.classList.add("dragging");
            cloneEl.style.position = "fixed";
            cloneEl.style.width = `${rect.width}px`;
            cloneEl.style.height = `${rect.height}px`;
            cloneEl.style.left = `${moveEvent.clientX - rect.width / 2}px`;
            cloneEl.style.top = `${moveEvent.clientY - rect.height / 2}px`;
            document.body.appendChild(cloneEl);
            el.style.opacity = "0.35";
          }

          if (isDragging && cloneEl) {
            const rect = cloneEl.getBoundingClientRect();
            cloneEl.style.left = `${moveEvent.clientX - rect.width / 2}px`;
            cloneEl.style.top = `${moveEvent.clientY - rect.height / 2}px`;
            highlightHoveredBin(moveEvent.clientX, moveEvent.clientY);
          }
        };

        const onPointerUp = (upEvent) => {
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerup", onPointerUp);

          clearBinHighlights();

          if (isDragging) {
            if (cloneEl) {
              cloneEl.remove();
              cloneEl = null;
            }
            el.style.opacity = "1";

            const droppedBin = getBinAtPoint(upEvent.clientX, upEvent.clientY);
            if (droppedBin) {
              evaluateTrashDrop(el, droppedBin);
            }
          } else {
            // Mode Tap / Klik: pilih atau batalkan pilihan sampah
            if (gameState.selectedTrashId === el.id) {
              selectTrashCard(null);
            } else {
              selectTrashCard(el.id);
              playSfx("click");
              setHintBanner(`Terpilih: ${el.dataset.name}. Sekarang ketuk tong sampah yang sesuai!`, "info");
            }
          }
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
      });
    }

    function selectTrashCard(uid) {
      document.querySelectorAll(".trash-item").forEach(item => item.classList.remove("selected"));
      gameState.selectedTrashId = uid;
      if (uid) {
        const target = document.getElementById(uid);
        if (target) target.classList.add("selected");
      }
    }

    function handleBinClick(binCategory) {
      if (!gameState.isPlaying) return;
      if (!gameState.selectedTrashId) {
        setHintBanner("Pilih atau seret sampah di bawah terlebih dahulu!", "warn");
        return;
      }
      const trashEl = document.getElementById(gameState.selectedTrashId);
      if (trashEl) {
        evaluateTrashDrop(trashEl, binCategory);
      }
    }

    function getBinAtPoint(x, y) {
      const bins = document.querySelectorAll(".trash-bin-target");
      for (const bin of bins) {
        const rect = bin.getBoundingClientRect();
        // Perluas sedikit area deteksi agar ramah layar sentuh
        const pad = 12;
        if (x >= rect.left - pad && x <= rect.right + pad && y >= rect.top - pad && y <= rect.bottom + pad) {
          return bin.dataset.bin;
        }
      }
      return null;
    }

    function highlightHoveredBin(x, y) {
      const hovered = getBinAtPoint(x, y);
      document.querySelectorAll(".trash-bin-target").forEach(bin => {
        bin.classList.toggle("bin-drag-over", bin.dataset.bin === hovered);
      });
    }

    function clearBinHighlights() {
      document.querySelectorAll(".trash-bin-target").forEach(bin => {
        bin.classList.remove("bin-drag-over");
      });
    }

    // 9. EVALUASI PEMILAHAN SAMPAH (+100 BENAR, -25 SALAH)
    function evaluateTrashDrop(trashEl, targetBinCategory) {
      const actualCategory = trashEl.dataset.category;
      const trashName = trashEl.dataset.name;
      const hintText = trashEl.dataset.hint;
      const binEl = document.getElementById(`bin-${targetBinCategory}`);
      const binRect = binEl.getBoundingClientRect();
      const popupX = binRect.left + binRect.width / 2;
      const popupY = binRect.top + 20;

      if (actualCategory === targetBinCategory) {
        // JAWABAN BENAR: +100 Skor
        playSfx("correct");
        gameState.score += 100;
        gameState.sortedCount++;
        gameState.selectedTrashId = null;

        // Animasi tong & maskot senang
        binEl.classList.remove("bin-bounce");
        void binEl.offsetWidth;
        binEl.classList.add("bin-bounce");
        triggerMascotCelebrate();

        spawnScorePopup("+100", "#16a34a", popupX, popupY);
        setHintBanner(`Hebat! ${trashName} benar masuk tong ${formatBinName(targetBinCategory)} (+100)`, "success");

        trashEl.remove();
        updateHudUI();

        // Cek apakah semua sampah sudah habis dipilah
        if (gameState.sortedCount >= gameState.totalTrash) {
          setTimeout(() => finishLevel(true), 450);
        }
      } else {
        // JAWABAN SALAH: Skor berkurang 25 (minimal 0)
        playSfx("wrong");
        gameState.score = Math.max(0, gameState.score - 25);
        gameState.mistakes++;

        binEl.classList.remove("bin-shake");
        void binEl.offsetWidth;
        binEl.classList.add("bin-shake");

        spawnScorePopup("-25", "#dc2626", popupX, popupY);
        setHintBanner(`Ups! ${hintText} (-25)`, "error");
        updateHudUI();
      }
    }

    function formatBinName(cat) {
      if (cat === "organik") return "Organik";
      if (cat === "anorganik") return "Anorganik";
      return "Daur Ulang";
    }

    function setHintBanner(text, tone = "info") {
      const banner = document.getElementById("game-hint-banner");
      banner.textContent = text;
      if (tone === "success") {
        banner.className = "bg-emerald-100 border-2 border-emerald-700 rounded-full px-4 py-1 text-xs sm:text-sm font-extrabold text-emerald-950 shadow";
      } else if (tone === "error") {
        banner.className = "bg-red-100 border-2 border-red-700 rounded-full px-4 py-1 text-xs sm:text-sm font-extrabold text-red-950 shadow";
      } else if (tone === "warn") {
        banner.className = "bg-amber-100 border-2 border-amber-700 rounded-full px-4 py-1 text-xs sm:text-sm font-extrabold text-amber-950 shadow";
      } else {
        banner.className = "bg-white/95 border-2 border-amber-900 rounded-full px-4 py-1 text-xs sm:text-sm font-extrabold text-amber-950 shadow";
      }
    }

    function spawnScorePopup(text, color, x, y) {
      const el = document.createElement("div");
      el.className = "score-float font-cartoon text-3xl sm:text-4xl font-bold";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.color = color;
      el.style.webkitTextStroke = "2px #ffffff";
      el.style.textShadow = "0 3px 6px rgba(0,0,0,0.4)";
      el.textContent = text;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 950);
    }

    function triggerMascotCelebrate() {
      const boy = document.getElementById("mascot-boy");
      const girl = document.getElementById("mascot-girl");
      boy.classList.add("mascot-jump");
      girl.classList.add("mascot-jump");
      setTimeout(() => {
        boy.classList.remove("mascot-jump");
        girl.classList.remove("mascot-jump");
      }, 1200);
    }

    // 10. HALAMAN SKOR AKHIR & PEMBUKAAN LEVEL BERIKUTNYA
    function finishLevel(isVictory) {
      stopGameTimer();
      gameState.isPlaying = false;

      const titleEl = document.getElementById("result-title");
      const scoreEl = document.getElementById("result-score");
      const starsEl = document.getElementById("result-stars");
      const statsEl = document.getElementById("result-stats");
      const nextBtnText = document.getElementById("btn-next-level-text");

      scoreEl.textContent = gameState.score.toLocaleString("id-ID");

      if (isVictory) {
        playSfx("win");
        triggerMascotCelebrate();
        launchConfetti();

        // Hitung bintang (1 - 3 bintang)
        let stars = 3;
        if (gameState.mistakes >= 4) stars = 1;
        else if (gameState.mistakes >= 2) stars = 2;

        // Simpan progres & buka level berikutnya
        const prevStars = gameState.levelStars[gameState.currentLevel] || 0;
        gameState.levelStars[gameState.currentLevel] = Math.max(prevStars, stars);
        if (gameState.currentLevel < 5 && gameState.unlockedLevel <= gameState.currentLevel) {
          gameState.unlockedLevel = gameState.currentLevel + 1;
        }
        saveProgress();

        titleEl.textContent = "Skor Akhir";
        starsEl.innerHTML = "⭐".repeat(stars) + "☆".repeat(3 - stars);

        const mins = Math.floor(gameState.timeLeft / 60);
        const secs = gameState.timeLeft % 60;
        const sisaWaktu = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        statsEl.textContent = `Level ${gameState.currentLevel} Selesai! • Sisa Waktu: ${sisaWaktu} • Salah: ${gameState.mistakes}x`;

        if (gameState.currentLevel < 5) {
          nextBtnText.textContent = "Level Berikutnya";
        } else {
          nextBtnText.textContent = "Pilih Level";
        }
      } else {
        playSfx("lose");
        titleEl.textContent = "Waktu Habis!";
        starsEl.innerHTML = "☆☆☆";
        statsEl.textContent = `Tersortir ${gameState.sortedCount} dari ${gameState.totalTrash} sampah. Yuk coba lagi!`;
        nextBtnText.textContent = "Ulangi Level";
      }

      navigateTo("result");
    }

    function handleNextLevelClick() {
      const btnText = document.getElementById("btn-next-level-text").textContent;
      if (btnText === "Ulangi Level") {
        startLevel(gameState.currentLevel);
      } else if (gameState.currentLevel < 5) {
        startLevel(gameState.currentLevel + 1);
      } else {
        navigateTo("levels");
      }
    }

    // 11. MODAL KELUAR GAME & EFEK KONFETI
    function confirmExitGame() {
      playSfx("click");
      document.getElementById("exit-modal").classList.remove("hidden");
    }

    function closeExitModal() {
      playSfx("click");
      document.getElementById("exit-modal").classList.add("hidden");
    }

    function confirmExitConfirmed() {
      document.getElementById("exit-modal").classList.add("hidden");
      navigateTo("menu");
    }

    function showFloatingToast(msg) {
      const toast = document.createElement("div");
      toast.className = "fixed bottom-6 left-1/2 -translate-x-1/2 bg-amber-950 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-xl z-50";
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2400);
    }

    function launchConfetti() {
      const colors = ["#facc15", "#ef4444", "#38bdf8", "#4ade80", "#c084fc"];
      for (let i = 0; i < 42; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.backgroundColor = colors[i % colors.length];
        piece.style.animationDuration = `${2.2 + Math.random() * 1.8}s`;
        piece.style.animationDelay = `${Math.random() * 0.5}s`;
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 4500);
      }
    }

    // Inisialisasi saat halaman dimuat
    window.addEventListener("DOMContentLoaded", () => {
      loadProgress();
      renderLevels();
    });