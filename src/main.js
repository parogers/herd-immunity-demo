
let matches = [];

function handleClickMatch(match) {
    console.log('clicked', match);
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
            element: document.createElement('img'),
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
        match.element.src = 'match.svg';
        match.element.style.left = match.x*rect.width + 'px';
        match.element.style.top = match.y*rect.height + 'px';

        area.appendChild(match.element);
    }
}
