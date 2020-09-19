function resetControls()
{
    document.querySelector('input[name="matches"]').value = matches.length;
    document.querySelector('input[name="ignition"]').value = ignitionRadius;
    handleNumMatchesChange(matches.length);
    handleIgnitionRadiusChange(ignitionRadius);
}

function handleNumMatchesChange(value)
{
    populateMatches(value);
    document.querySelector('span.num-matches').innerHTML = '' + value;
}

function handleIgnitionRadiusChange(value)
{
    ignitionRadius = value;
    document.querySelector('span.ignition-radius').innerHTML = '' + value;
}

function handleReset()
{
    for (let n = 0; n < matches.length; n++) {
        matches[n].element.classList.remove('lit');
    }
}
