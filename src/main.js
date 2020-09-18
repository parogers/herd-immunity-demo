
let matches = [];

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
    let igniteDist = 0.1;

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
        if (matches[n] !== match && dist < igniteDist) {
            handleClickMatch(matches[n]);
        }
    }
}

function loaded()
{
    let area = document.getElementById('area');
    let rect = area.getBoundingClientRect();

    window.addEventListener('resize', resize);

    for (let n = 0; n < 100; n++)
    {
        matches.push({
            x: Math.random()*0.9 + 0.05,
            y: Math.random()*0.85 + 0.05,
            element: createMatchElement(),
        });

        (function(match) {
            match.element.addEventListener('click', function() {
                handleClickMatch(match);
            });
        })(matches[n]);
    }

    /* Sort the matches so the ones higher up on the screen appear further
     * back in the scene. */
    matches.sort(function(match1, match2) {
        return match1.y - match2.y;
    });

    resize();
}

function resize()
{
    let area = document.getElementById('area');
    let rect = area.getBoundingClientRect();

    for (let n = 0; n < matches.length; n++)
    {
        let match = matches[n];
        match.element.style.left = match.x*rect.width + 'px';
        match.element.style.top = match.y*rect.height + 'px';

        area.appendChild(match.element);
    }
}
