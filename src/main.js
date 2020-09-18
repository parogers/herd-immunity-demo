
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
    match.element.classList.add('lit');
}

function loaded()
{
    let area = document.getElementById('area');
    let rect = area.getBoundingClientRect();

    window.addEventListener('resize', resize);

    for (let n = 0; n < 10; n++)
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
