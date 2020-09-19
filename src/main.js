
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

    /* Now add the matches in the newly sorted order */
    for (let n = 0; n < matches.length; n++) {
        area.appendChild(matches[n].element);
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
    }
}
