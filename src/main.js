
function loaded()
{
    let area = document.getElementById('area');
    let rect = area.getBoundingClientRect();

    for (let n = 0; n < 10; n++) {
        let x = Math.random() * rect.width;
        let y = Math.random() * rect.height;
        let match = document.createElement('img');
        if (n % 2 == 0)
            match.src = 'match.svg';
        else
            match.src = 'match-burning.svg';

        match.style.top = y + 'px';
        match.style.left = x + 'px';

        area.appendChild(match);
    }

}
