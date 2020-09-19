
function loaded()
{
    window.addEventListener('resize', resize);

    matchArea = document.querySelector('.area');
    populateMatches(50);
    resize();
    resetControls();
}

function resize()
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
