/*
 * Herd Immunity Demo - visually demonstrates the concept of herd immunity
 * Copyright (C) 2020  Peter Rogers (peter.rogers@gmail.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Component } from '@angular/core';


function createMatchElement()
{
    let div = document.createElement('div');
    div.classList.add('match');

    let matchImg = document.createElement('img');
    matchImg.classList.add('unlit-match');
    matchImg.src = 'assets/match.svg';

    let flameImg = document.createElement('img');
    flameImg.classList.add('flame');
    flameImg.src = 'assets/flame.svg';

    div.appendChild(matchImg);
    div.appendChild(flameImg);

    return div;
}


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent
{
    title = 'herd-immunity-demo';
    matchArea : any;
    matches : [any] = [];
    ignitionRadius = 10;

    ngOnInit()
    {
        window.addEventListener('resize', () => this.resize());

        this.matchArea = document.querySelector('.area');
        this.resetControls();
    }

    handleReset()
    {
        for (let n = 0; n < this.matches.length; n++) {
            this.matches[n].element.classList.remove('lit');
        }
    }

    handleRandomize()
    {
        let num = this.matches.length;
        this.populateMatches(0);
        this.populateMatches(num);
    }

    handleNumMatchesChange(event)
    {
        this.populateMatches(event.target.value);
        document.querySelector('span.num-matches').innerHTML = '' + event.target.value;
    }

    handleIgnitionRadiusChange(event)
    {
    }

    resetControls()
    {
        let numMatches = 10;
        document.querySelector('input[name="matches"]').value = numMatches;
        document.querySelector('input[name="ignition"]').value = this.ignitionRadius;
        // handleNumMatchesChange(numMatches);
        // handleIgnitionRadiusChange(ignitionRadius);
    }

    resize()
    {
        this.placeMatchElements();
    }

    handleClickMatch(match)
    {
        if (match.element.classList.contains('lit')) {
            return;
        }

        match.element.classList.add('lit');
        for (let n = 0; n < this.matches.length; n++)
        {
            let dist = Math.sqrt(
                (this.matches[n].x - match.x) ** 2 +
                (this.matches[n].y - match.y) ** 2
            );
            if (this.matches[n] !== match && dist < this.ignitionRadius/100.0)
            {
                (function(self, match) {
                    setTimeout(
                        function() {
                            self.handleClickMatch(match);
                        },
                        50
                    );
                })(this, this.matches[n]);
            }
        }
    }

    populateMatches(target)
    {
        while (this.matches.length > target) {
            let match = this.matches.pop();
            this.matchArea.removeChild(match.element);
        }
        while (this.matches.length < target)
        {
            let match = {
                x: Math.random()*0.9 + 0.05,
                y: Math.random()*0.85 + 0.05,
                element: createMatchElement(),
            };
            this.matches.push(match);
            this.matchArea.appendChild(match.element);

            (function(self, match) {
                match.element.addEventListener('click', function() {
                    self.handleClickMatch(match);
                });
            })(this, match);
        }
        this.placeMatchElements();
    }

    placeMatchElements()
    {
        let rect = this.matchArea.getBoundingClientRect();

        for (let n = 0; n < this.matches.length; n++)
        {
            let match = this.matches[n];
            match.element.style.left = match.x*rect.width + 'px';
            match.element.style.top = match.y*rect.height + 'px';
            match.element.style.zIndex = '' + ((match.y*rect.height)|0);
        }
    }
}
