
let matchArea;
let matches = [];
let ignitionRadius = 10;

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

function populateMatches(target)
{
    while (matches.length > target) {
        let match = matches.pop();
        matchArea.removeChild(match.element);
    }
    while (matches.length < target)
    {
        let match = {
            x: Math.random()*0.9 + 0.05,
            y: Math.random()*0.85 + 0.05,
            element: createMatchElement(),
        };
        matches.push(match);
        matchArea.appendChild(match.element);

        (function(match) {
            match.element.addEventListener('click', function() {
                handleClickMatch(match);
            });
        })(match);
    }
    placeMatchElements();
}

function placeMatchElements()
{
    let rect = matchArea.getBoundingClientRect();

    for (let n = 0; n < matches.length; n++)
    {
        let match = matches[n];
        match.element.style.left = match.x*rect.width + 'px';
        match.element.style.top = match.y*rect.height + 'px';
        match.element.style.zIndex = '' + ((matches[n].y*rect.height)|0);
    }
}
