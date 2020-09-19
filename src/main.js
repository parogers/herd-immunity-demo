
function loaded()
{
    let area = document.querySelector('.area');
    let rect = area.getBoundingClientRect();

    window.addEventListener('resize', resize);

    for (let n = 0; n < numMatches; n++)
    {
        matches.push({
            x: Math.random()*0.9 + 0.05,
            y: Math.random()*0.85 + 0.05,
            element: createMatchElement(),
        });
        area.appendChild(matches[n].element);

        (function(match) {
            match.element.addEventListener('click', function() {
                handleClickMatch(match);
            });
        })(matches[n]);
    }
    resize();
    resetControls();
}

function resize()
{
    let area = document.querySelector('.area');
    let rect = area.getBoundingClientRect();

    for (let n = 0; n < matches.length; n++)
    {
        let match = matches[n];
        match.element.style.left = match.x*rect.width + 'px';
        match.element.style.top = match.y*rect.height + 'px';
        match.element.style.zIndex = '' + ((matches[n].y*rect.height)|0);
    }
}
