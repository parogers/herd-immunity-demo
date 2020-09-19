let matches = [];
let ignitionRadius = 10;
let numMatches = 50;

function createMatchElement()
{
    let div = document.createElement('div');
    div.classList.add('match');

    let matchImg = document.createElement('img');
    matchImg.classList.add('unlit-match');
    matchImg.src = 'match.svg';

    let flameImg = document.createElement('img');
    flameImg.classList.add('flame');
    flameImg.src = 'flame.svg';

    div.appendChild(matchImg);
    div.appendChild(flameImg);

    return div;
}

function handleClickMatch(match)
{
    if (match.element.classList.contains('lit')) {
        return;
    }

    match.element.classList.add('lit');
    for (let n = 0; n < matches.length; n++)
    {
        let dist = Math.sqrt(
            (matches[n].x - match.x) ** 2 +
            (matches[n].y - match.y) ** 2
        );
        if (matches[n] !== match && dist < ignitionRadius/100.0)
        {
            (function(match) {
                setTimeout(
                    function() {
                        handleClickMatch(match);
                    },
                    50
                );
            })(matches[n]);
        }
    }
}
