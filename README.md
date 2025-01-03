<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memory Spel - Tekst en Afbeeldingen</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
        }
        .memory-game {
            display: grid;
            grid-template-columns: repeat(4, 150px);
            grid-gap: 10px;
        }
        .memory-card {
            width: 150px;
            height: 150px;
            position: relative;
            cursor: pointer;
            perspective: 1000px;
        }
        .memory-card-inner {
            width: 100%;
            height: 100%;
            position: absolute;
            transform-style: preserve-3d;
            transition: transform 0.6s;
        }
        .memory-card.flipped .memory-card-inner {
            transform: rotateY(180deg);
        }
        .memory-card-front,
        .memory-card-back {
            width: 100%;
            height: 100%;
            position: absolute;
            backface-visibility: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .memory-card-front {
            background-color: #1e90ff;
        }
        .memory-card-back {
            background-color: #fff;
            transform: rotateY(180deg);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .memory-card-back img {
            max-width: 80%;
            max-height: 80%;
            border-radius: 5px;
        }
        .memory-card-back span {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>Memory Spel - Tekst en Afbeeldingen</h1>
    <div class="memory-game" id="memoryGame"></div>
    <script>
        const allPairs = [
            { description: 'De leerkracht kijkt de klas rond, de leerling kijkt terug.', image: 'a.png' },
            { description: 'De leerkracht kijkt de klas rond, de leerling kijkt niet terug.', image: 'b.png' },
            { description: 'De timer gaat, de leerling wil de bladzijde nog aflezen.', image: 'c.png' },
            { description: 'De timer gaat, de leerling slaat het boek meteen dicht.', image: 'd.png' },
            { description: 'De leerling ruilt de boeken voordat ze uit zijn.', image: 'e.png' },
            { description: 'De leerling leest bijna alle boeken uit.', image: 'f.png' },
            { description: 'De leerling vraagt of hij een boek thuis mag uitlezen.', image: 'g.png' },
            { description: 'De leerling zucht dat alle boeken uit de klassenbieb stom zijn.', image: 'h.png' },
            { description: 'Je ziet de leerling steeds bladeren in het boek.', image: 'i.png' },
            { description: 'Je ziet de leerling bladzijde voor bladzijde doorlezen.', image: 'j.png' },
            { description: 'De leerling leest alleen titels en kijkt naar plaatjes.', image: 'k.png' },
            { description: 'De leerling zoekt naar boeken met bekende karakters.', image: 'l.png' },
            { description: 'De leerling leest in stilte en is geconcentreerd.', image: 'm.png' },
            { description: 'De leerling verliest focus en kijkt rond in de klas.', image: 'n.png' },
            { description: 'De leerling bladert snel door het boek zonder te lezen.', image: 'o.png' },
            { description: 'De leerling leest dezelfde bladzijde meerdere keren.', image: 'p.png' },
            { description: 'De leerling vraagt anderen om suggesties voor boeken.', image: 'q.png' },
            { description: 'De leerling deelt enthousiast wat hij gelezen heeft.', image: 'r.png' },
            { description: 'De leerling laat trots zien hoeveel boeken hij heeft gelezen.', image: 's.png' },
            { description: 'De leerling zucht over de lengte van het boek.', image: 't.png' },
            { description: 'De leerling kijkt alleen naar de kaft van het boek.', image: 'u.png' },
            { description: 'De leerling zoekt boeken die lijken op eerdere favorieten.', image: 'v.png' },
            { description: 'De leerling leest fragmenten en vergelijkt meerdere boeken.', image: 'w.png' },
            { description: 'De leerling leest snel en lijkt de inhoud te begrijpen.', image: 'x.png' }
        ];

        function getRandomPairs(array, num) {
            const shuffled = array.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, num);
        }

        const selectedPairs = getRandomPairs(allPairs, 4);

        const gameContainer = document.getElementById('memoryGame');
        let cards = [...selectedPairs, ...selectedPairs.map(pair => ({ ...pair, isImage: true }))];
        let flippedCards = [];
        let matchedPairs = 0;

        // Shuffle cards
        cards.sort(() => 0.5 - Math.random());

        // Create cards
        cards.forEach(cardData => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.description = cardData.description;

            const cardInner = document.createElement('div');
            cardInner.classList.add('memory-card-inner');

            const front = document.createElement('div');
            front.classList.add('memory-card-front');

            const back = document.createElement('div');
            back.classList.add('memory-card-back');
            if (cardData.isImage) {
                const img = document.createElement('img');
                img.src = cardData.image;
                img.alt = cardData.description;
                back.appendChild(img);
            } else {
                const text = document.createElement('span');
                text.textContent = cardData.description;
                back.appendChild(text);
            }

            cardInner.appendChild(front);
            cardInner.appendChild(back);
            card.appendChild(cardInner);
            card.addEventListener('click', () => flipCard(card));
            gameContainer.appendChild(card);
        });

        function flipCard(card) {
            if (card.classList.contains('flipped') || flippedCards.length === 2) return;
            card.classList.add('flipped');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                checkMatch();
            }
        }

        function checkMatch() {
            const [card1, card2] = flippedCards;
            if (
                card1.dataset.description === card2.dataset.description &&
                card1 !== card2 &&
                ((card1.querySelector('img') && !card2.querySelector('img')) ||
                    (!card1.querySelector('img') && card2.querySelector('img')))
            ) {
                matchedPairs++;
                flippedCards = [];
                if (matchedPairs === selectedPairs.length) {
                    alert('Gefeliciteerd! Je hebt alle paren gevonden!');
                }
            } else {
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                }, 1000);
            }
        }
    </script>
</body>
</html>
