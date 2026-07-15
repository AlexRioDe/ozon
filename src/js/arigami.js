(function() {
    // ============================================================
    //  ★★★ ЗДЕСЬ ВСТАВЬТЕ ПУТИ К ВАШИМ 8 КАРТИНКАМ ★★★
    //  Каждая картинка будет использована дважды (образует пару).
    //  Пример: '/src/images/game/game-men.png'
    // ============================================================
    const MY_IMAGES = [
        './images/game/1.jpg',   // пара 1
        './images/game/1.jpg',   // пара 1 (дубликат)
        './images/game/2.jpg', // пара 2
        './images/game/2.jpg', // пара 2 (дубликат)
        './images/game/3.jpg',// пара 3
        './images/game/3.jpg',// пара 3 (дубликат)
        './images/game/4.jpg',// пара 4
        './images/game/4.jpg',// пара 4 (дубликат)
        './images/game/5.jpg',// пара 5
        './images/game/5.jpg',// пара 5 (дубликат)
        './images/game/6.jpg',// пара 6
        './images/game/6.jpg',// пара 6 (дубликат)
        './images/game/7.jpg',// пара 7
        './images/game/7.jpg',// пара 7 (дубликат)
        './images/game/8.jpg',// пара 8
        './images/game/8.jpg' // пара 8 (дубликат)
        // '/src/images/game/8.png' // пара 8 (дубликат)
    ];
    // ============================================================
    //  Если картинок меньше 16, игра не запустится.
    //  Можно указать 8 уникальных путей, и код сам их продублирует.
    // ============================================================

    // ---------- АВТОМАТИЧЕСКОЕ ПОСТРОЕНИЕ КОЛОДЫ ИЗ 8 ПАР ----------
    function buildDeckFromImages() {
        // Если передано ровно 8 путей – дублируем каждый
        if (MY_IMAGES.length === 8) {
            const deck = [];
            for (let i = 0; i < MY_IMAGES.length; i++) {
                const url = MY_IMAGES[i];
                deck.push({ pairId: i, imageUrl: url, matched: false, revealed: false });
                deck.push({ pairId: i, imageUrl: url, matched: false, revealed: false });
            }
            return shuffleArray(deck);
        }
        // Если передано 16 путей (уже готовые пары) – используем как есть
        else if (MY_IMAGES.length === 16) {
            const deck = [];
            for (let i = 0; i < MY_IMAGES.length; i++) {
                const pairId = Math.floor(i / 2); // 0,0,1,1,2,2...
                deck.push({
                    pairId: pairId,
                    imageUrl: MY_IMAGES[i],
                    matched: false,
                    revealed: false
                });
            }
            return shuffleArray(deck);
        } else {
            // Если количество не 8 и не 16 – показываем ошибку и используем заглушки
            console.error('Ошибка: в MY_IMAGES должно быть ровно 8 или 16 элементов.');
            alert('Пожалуйста, укажите ровно 8 или 16 путей к картинкам в массиве MY_IMAGES.');
            // Заглушки (цветные квадраты)
            const fallback = [];
            for (let i = 0; i < 16; i++) {
                const pairId = Math.floor(i / 2);
                const color = `hsl(${pairId * 45}, 70%, 60%)`;
                fallback.push({
                    pairId: pairId,
                    imageUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='${encodeURIComponent(color)}'/%3E%3Ctext x='50' y='55' font-size='28' text-anchor='middle' fill='white' font-weight='bold'%3E${pairId+1}%3C/text%3E%3C/svg%3E`,
                    matched: false,
                    revealed: false
                });
            }
            return shuffleArray(fallback);
        }
    }

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // ---------- СОСТОЯНИЕ ИГРЫ ----------
    const TOTAL_PAIRS = 8;
    let cards = [];
    let firstIndex = null;
    let secondIndex = null;
    let lockBoard = false;
    let moves = 0;
    let matchedPairs = 0;
    let timeoutId = null;

    const gridEl = document.getElementById('grid-container');
    const pairsSpan = document.getElementById('pairs-matched');
    const movesSpan = document.getElementById('move-counter');
    const statusMsg = document.getElementById('status-message');

    // ---------- ОБНОВЛЕНИЕ СЧЁТЧИКОВ ----------
    function updateStats() {
        pairsSpan.textContent = matchedPairs;
        movesSpan.textContent = moves;
    }

    // ---------- ПРОВЕРКА ПОБЕДЫ ----------
    function checkGameComplete() {
        if (matchedPairs === TOTAL_PAIRS) {
            document.querySelector('.game-container').classList.add('done');
            statusMsg.textContent = '🎉 победа! 🎉';
            return true;
        }
        return false;
    }

    // ---------- ОТРИСОВКА СЕТКИ ----------
    function renderGrid() {
        gridEl.innerHTML = '';
        cards.forEach((card, idx) => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';

            const img = document.createElement('img');
            img.src = card.imageUrl;
            img.alt = `пара ${card.pairId + 1}`;
            img.draggable = false;
            // Обработка ошибки загрузки картинки (чтобы не было пустых мест)
            img.onerror = function() {
                this.style.display = 'none';
                cardDiv.textContent = '🖼️';
                cardDiv.style.fontSize = '2.4rem';
                cardDiv.style.color = '#1a2e38';
            };
            cardDiv.appendChild(img);

            if (card.matched) {
                cardDiv.classList.add('matched');
            } else if (card.revealed) {
                cardDiv.classList.add('revealed');
            } else {
                cardDiv.classList.add('hidden');
            }

            cardDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                handleCardClick(idx);
            });

            gridEl.appendChild(cardDiv);
        });
    }

    // ---------- ЛОГИКА КЛИКА ----------
    function handleCardClick(index) {
        if (lockBoard) return;
        if (matchedPairs === TOTAL_PAIRS) return;

        const card = cards[index];
        if (card.matched) return;
        if (card.revealed) return;

        if (firstIndex === null) {
            card.revealed = true;
            firstIndex = index;
            renderGrid();
            return;
        }

        if (secondIndex === null && firstIndex !== index) {
            card.revealed = true;
            secondIndex = index;
            moves++;
            updateStats();

            const card1 = cards[firstIndex];
            const card2 = cards[secondIndex];

            if (card1.pairId === card2.pairId) {
                card1.matched = true;
                card2.matched = true;
                matchedPairs++;
                updateStats();

                firstIndex = null;
                secondIndex = null;
                renderGrid();

                if (checkGameComplete()) {
                    renderGrid();
                }
            } else {
                lockBoard = true;
                renderGrid();
                statusMsg.textContent = '❌ не совпало';

                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    if (!cards[firstIndex].matched && !cards[secondIndex].matched) {
                        cards[firstIndex].revealed = false;
                        cards[secondIndex].revealed = false;
                    }
                    firstIndex = null;
                    secondIndex = null;
                    lockBoard = false;
                    statusMsg.textContent = 'играй';
                    renderGrid();
                    timeoutId = null;
                }, 700);
            }
            return;
        }

        if (firstIndex !== null && secondIndex === null && firstIndex === index) {
            return;
        }
    }

    // ---------- ИНИЦИАЛИЗАЦИЯ ----------
    function initGame() {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }

        cards = buildDeckFromImages();
        firstIndex = null;
        secondIndex = null;
        lockBoard = false;
        moves = 0;
        matchedPairs = 0;
        statusMsg.textContent = 'играй';
        updateStats();
        renderGrid();
    }

    // ---------- КНОПКА СБРОСА ----------
    document.getElementById('reset-btn').addEventListener('click', initGame);

    // ---------- СТАРТ ----------
    initGame();
})();