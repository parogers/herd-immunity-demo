
function loaded()
{
    window.addEventListener('resize', resize);

    matchArea = document.querySelector('.area');
    populateMatches(50);
    resetControls();
}

function resize()
{
    placeMatchElements();
}
