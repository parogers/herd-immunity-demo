
function loaded()
{
    window.addEventListener('resize', resize);

    matchArea = document.querySelector('.area');
    resetControls();
}

function resize()
{
    placeMatchElements();
}
