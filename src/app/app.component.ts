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

import { Component, EventEmitter, ViewChild } from '@angular/core';


function createMatchElement() : HTMLElement
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

class Match
{
    element : HTMLElement;
    click : EventEmitter<any>;

    constructor(
        public x : number,
        public y : number,
    )
    {
        this.element = createMatchElement();
        this.click = new EventEmitter();

        this.element.addEventListener('click', () => {
            this.click.emit(this);
        });
    }

    get lit() : boolean
    {
        return this.element.classList.contains('lit');
    }

    set lit(value : boolean)
    {
        if (value) this.element.classList.add('lit');
        else this.element.classList.remove('lit');
    }

    placeElement(rect : any)
    {
        this.element.style.left = this.x*rect.width + 'px';
        this.element.style.top = this.y*rect.height + 'px';
        this.element.style.zIndex = '' + ((this.y*rect.height)|0);
    }

    distanceTo(other : Match)
    {
        return Math.sqrt(
            (other.x - this.x) ** 2 +
            (other.y - this.y) ** 2
        );
    }
}


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent
{
    @ViewChild('matchArea', { static: true } )
    private _matchArea;

    matches : Match[] = [];
    ignitionRadius = 10;

    ngOnInit()
    {
        window.addEventListener(
            'resize',
            () => this.handleWindowResize()
        );

        this.populateMatches(50);
    }

    get matchArea() : HTMLElement
    {
        return this._matchArea.nativeElement;
    }

    get numMatches() : number
    {
        return this.matches.length;
    }

    handleReset()
    {
        this.matches.forEach(match => {
            match.lit = false;
        });
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
    }

    handleIgnitionRadiusChange(event)
    {
    }

    handleWindowResize()
    {
        this.placeMatchElements();
    }

    handleClickMatch(match)
    {
        if (match.lit) {
            return;
        }

        match.lit = true;

        this.matches.forEach(other => {
            let dist = match.distanceTo(other);
            if (other !== match && dist < this.ignitionRadius/100.0)
            {
                setTimeout(
                    () => {
                        this.handleClickMatch(other);
                    },
                    50
                );
            }
        });
    }

    populateMatches(target)
    {
        while (this.matches.length > target) {
            let match = this.matches.pop();
            this.matchArea.removeChild(match.element);
        }
        while (this.matches.length < target)
        {
            let match = new Match(
                Math.random()*0.9 + 0.05,
                Math.random()*0.85 + 0.05,
            );
            this.matches.push(match);
            this.matchArea.appendChild(match.element);

            match.click.subscribe(match => {
                this.handleClickMatch(match);
            });
        }
        this.placeMatchElements();
    }

    placeMatchElements()
    {
        let rect = this.matchArea.getBoundingClientRect();
        this.matches.forEach(match => {
            match.placeElement(rect);
        });
    }
}
