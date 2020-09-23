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


const DEFAULT_NUM_MATCHES = 50;
const DEFAULT_IGNITION_RADIUS = 10;
const DEFAULT_PERCENT_IMMUNITY = 25;
// This is intentionally set low just to prevent tight clustering/overlapping
// of matches. Setting it too high will make the matches look artificially
// spaced out and not random.
const MIN_MATCH_DIST = 0.02;


function createMatchElement() : HTMLElement
{
    const div = document.createElement('div');
    div.classList.add('match');

    const matchImg = document.createElement('img');
    matchImg.classList.add('unlit-match');
    matchImg.src = 'assets/match.svg';

    const spentImg = document.createElement('img');
    spentImg.classList.add('spent-match');
    spentImg.src = 'assets/spent-match.svg';

    const flameImg = document.createElement('img');
    flameImg.classList.add('flame');
    flameImg.src = 'assets/flame.svg';

    div.appendChild(matchImg);
    div.appendChild(spentImg);
    div.appendChild(flameImg);
    return div;
}

/*
 * Attempt to pick a random point that is at least 'minDist' away from the
 * given list of points. The arg 'tries' is the number of attempts to make
 * before giving up and just returning a point chosen at random.
 */
function createRandomMatchPosition(
    matchPosList : Point[],
    minDist : number,
    tries : number
) : Point
{
    function uniform(a, b) {
        return a + Math.random()*(b-a);
    }

    function randomPoint()
    {
        // Magic values to take into account the tall/skinny shape of the match,
        // so that matches don't get cut off if near the margins.
        return {
            x: uniform(0, 0.95),
            y: uniform(0, 0.86),
        };
    }

    function closeTo(matchPosList : Point[], point : Point, dist : number)
    {
        return matchPosList.some(other => {
            const measured = Math.sqrt(
                (other.x - point.x) ** 2 +
                (other.y - point.y) ** 2
            );
            return measured < dist;
        });
    }

    for (let n = 0; n < tries; n++)
    {
        const point = randomPoint();
        if (!closeTo(matchPosList, point, minDist)) {
            return point;
        }
    }

    return randomPoint();
}

class Match
{
    element : HTMLElement;
    click : EventEmitter<any>;
    _lit : boolean = false;
    _spent : boolean = false;

    constructor(
        public x : number,
        public y : number,
    )
    {
        this.click = new EventEmitter();

        this.element = createMatchElement();
        this.element.addEventListener('click', () => {
            this.click.emit(this);
        });
    }

    get spent() : boolean
    {
        return this._spent;
    }

    set spent(value : boolean)
    {
        if (value !== this._spent) {
            this._spent = value;
            if (value) this.element.classList.add('spent');
            else this.element.classList.remove('spent');
        }
    }

    get lit() : boolean
    {
        return this._lit;
    }

    set lit(value : boolean)
    {
        if (this._lit !== value)
        {
            this._lit = value;
            if (value) this.element.classList.add('lit');
            else this.element.classList.remove('lit');
        }
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

interface Point
{
    x : number;
    y : number;
}


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent
{
    @ViewChild('matchArea', { static: true })
    private _matchArea;

    @ViewChild('numMatchesInput', { static: true})
    private numMatchesInput;

    @ViewChild('ignitionRadiusInput', { static: true })
    private ignitionRadiusInput;

    @ViewChild('percentImmunityInput', { static: true })
    private percentImmunityInput;

    /*
     * A list of randomly generated points to use for the match positions. This
     * list is long enough for any number of matches chosen by the slider.
     * It is randomized at the beginning, and each time the user clicks the
     * randomize button.
     */
    matchPositions : Point[];

    matches : Match[] = [];
    ignitionRadius = DEFAULT_IGNITION_RADIUS;
    percentImmunity = DEFAULT_PERCENT_IMMUNITY;
    numMatchesLit : number = 0;

    ngOnInit()
    {
        window.addEventListener(
            'resize',
            () => this.handleWindowResize()
        );

        this.handleRandomize();
        this.populateMatches(DEFAULT_NUM_MATCHES);

        this.numMatchesInput.nativeElement.value = this.matches.length;
        this.ignitionRadiusInput.nativeElement.value = this.ignitionRadius;
        this.percentImmunityInput.nativeElement.value = this.percentImmunity;

        /* Recalculate the match placement after a short time. This is a hack
         * to fix a bug that appears while in portrait mode - the match area
         * gets resized after ngOnInit (probably flexbox related) and this
         * code doesn't catch that. */
        setTimeout(() => {
            this.placeMatchElements();
        }, 100);
    }

    get maxNumMatches() : number
    {
        return 200;
    }

    get matchArea() : HTMLElement
    {
        return this._matchArea.nativeElement;
    }

    get numMatches() : number
    {
        return this.matches.length;
    }

    get numMatchesListPercent() : number
    {
        return (100*this.numMatchesLit/this.numMatches)|0;
    }

    handleReset()
    {
        this.numMatchesLit = 0;
        this.matches.forEach(match => {
            match.lit = false;
        });
    }

    handleRandomize()
    {
        this.matchPositions = [];
        for (let n = 0; n < this.maxNumMatches; n++)
        {
            this.matchPositions.push(
                createRandomMatchPosition(this.matchPositions, MIN_MATCH_DIST, 5)
            );
        }

        const num = this.matches.length;
        this.populateMatches(0);
        this.populateMatches(num);
    }

    handleNumMatchesChange(event)
    {
        this.populateMatches(event.target.value);
        this.handleReset();
    }

    handleIgnitionRadiusChange(event)
    {
        this.ignitionRadius = event.target.value;
        this.handleReset();
    }

    handleWindowResize()
    {
        this.placeMatchElements();
    }

    handleClickMatch(match)
    {
        if (match.lit || match.spent) {
            return;
        }

        this.numMatchesLit++;
        match.lit = true;

        // Collect a list of matches to ignite near the given match
        const lightList = this.matches.filter(other => {
            return (
                !other.lit &&
                match.distanceTo(other) < this.ignitionRadius/100.0
            );
        });

        // Light them all after a short delay
        setTimeout(
            () => {
                lightList.forEach(other => {
                    // Check lit here to we don't call handleClickMatch on
                    // a match that's already been lit earlier in this loop.
                    if (!other.lit) {
                        this.handleClickMatch(other);
                    }
                });
            },
            40
        );
    }

    populateMatches(target)
    {
        while (this.matches.length > target) {
            const match = this.matches.pop();
            this.matchArea.removeChild(match.element);
        }
        while (this.matches.length < target)
        {
            const point = this.matchPositions[this.matches.length];
            const match = new Match(
                point.x,
                point.y,
            );
            this.matches.push(match);
            this.matchArea.appendChild(match.element);

            if (this.matches.length % 2 == 0) match.spent = true;

            match.click.subscribe(match => {
                this.handleClickMatch(match);
            });
        }
        this.placeMatchElements();
    }

    placeMatchElements()
    {
        const rect = this.matchArea.getBoundingClientRect();
        this.matches.forEach(match => {
            match.placeElement(rect);
        });
    }

    handlePercentImmunityChange(event)
    {
        this.percentImmunity = event.target.value;
    }
}
