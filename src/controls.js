function resetControls()
{
    let numMatches = 50;
    document.querySelector('input[name="matches"]').value = numMatches;
    document.querySelector('input[name="ignition"]').value = ignitionRadius;
    handleNumMatchesChange(numMatches);
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

function handleRandomize()
{
    let num = matches.length;
    populateMatches(0);
    populateMatches(num);
}
