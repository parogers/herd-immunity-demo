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


const DEFAULT_NUM_PEOPLE = 50;
const DEFAULT_SICKNESS_RADIUS = 10;
const DEFAULT_PERCENT_IMMUNITY = 25;
// This is intentionally set low just to prevent tight clustering/overlapping
// of people. Setting it too high will make the people look artificially
// spaced out and not random.
const MIN_PERSON_DIST = 0.05;


function createPersonElement() : HTMLElement
{
    const div = document.createElement('div');
    div.classList.add('person');

    const personImg = document.createElement('img');
    personImg.classList.add('person-vulnerable');
    personImg.src = 'assets/person-vulnerable.svg';

    const immuneImg = document.createElement('img');
    immuneImg.classList.add('person-immune');
    immuneImg.src = 'assets/person-immune.svg';

    const sicknessImg = document.createElement('img');
    sicknessImg.classList.add('sickness');
    sicknessImg.src = 'assets/sickness.svg';

    const sickImg = document.createElement('img');
    sickImg.classList.add('person-sick');
    sickImg.src = 'assets/person-sick.svg';

    div.appendChild(sicknessImg);
    div.appendChild(personImg);
    div.appendChild(immuneImg);
    div.appendChild(sickImg);
    return div;
}

/*
 * Attempt to pick a random point that is at least 'minDist' away from the
 * given list of points. The arg 'tries' is the number of attempts to make
 * before giving up and just returning a point chosen at random.
 */
function createRandomPersonPosition(
    personPosList : Point[],
    minDist : number,
    tries : number
) : Point
{
    function uniform(a, b) {
        return a + Math.random()*(b-a);
    }

    function randomPoint()
    {
        // Magic values to take into account the tall/skinny shape of the person,
        // so that people don't get cut off if near the margins.
        return {
            x: uniform(0, 0.95),
            y: uniform(0, 0.90),
        };
    }

    function closeTo(personPosList : Point[], point : Point, dist : number)
    {
        return personPosList.some(other => {
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
        if (!closeTo(personPosList, point, minDist)) {
            return point;
        }
    }

    return randomPoint();
}

class Person
{
    x : number = 0;
    y : number = 0;
    element : HTMLElement;
    click : EventEmitter<any>;
    _sick : boolean = false;
    _immune : boolean = false;

    constructor()
    {
        this.click = new EventEmitter();

        this.element = createPersonElement();
        this.element.addEventListener('click', () => {
            this.click.emit(this);
        });
    }

    get immune() : boolean
    {
        return this._immune;
    }

    set immune(value : boolean)
    {
        if (value !== this._immune) {
            this._immune = value;
            if (value) this.element.classList.add('immune');
            else this.element.classList.remove('immune');
        }
    }

    get sick() : boolean
    {
        return this._sick;
    }

    set sick(value : boolean)
    {
        if (this._sick !== value)
        {
            this._sick = value;
            if (value) this.element.classList.add('sick');
            else this.element.classList.remove('sick');
        }
    }

    placeElement(rect : any)
    {
        this.element.style.left = this.x*rect.width + 'px';
        this.element.style.top = this.y*rect.height + 'px';
        this.element.style.zIndex = '' + ((this.y*rect.height)|0);
    }

    distanceTo(other : Person)
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
    @ViewChild('personArea', { static: true })
    private _personArea;

    @ViewChild('numPeopleInput', { static: true})
    private numPeopleInput;

    @ViewChild('sicknessRadiusInput', { static: true })
    private sicknessRadiusInput;

    @ViewChild('percentImmunityInput', { static: true })
    private percentImmunityInput;

    cachedPeople : Person[];
    people : Person[] = [];
    sicknessRadius = DEFAULT_SICKNESS_RADIUS;
    percentImmunity = DEFAULT_PERCENT_IMMUNITY;
    numPeopleSick : number = 0;
    numPeopleImmune : number = 0;

    ngOnInit()
    {
        window.addEventListener(
            'resize',
            () => this.handleWindowResize()
        );

        this.people = [];
        this.cachedPeople = [];
        while (this.cachedPeople.length < this.maxNumPeople)
        {
            const person = new Person();
            person.click.subscribe(person => {
                this.handleClickPerson(person);
            });
            this.cachedPeople.push(person);
        }

        this.sicknessRadiusInput.nativeElement.value = this.sicknessRadius;
        this.percentImmunityInput.nativeElement.value = this.percentImmunity;

        this.handleRandomize();

        this.numPeopleShown = DEFAULT_NUM_PEOPLE;

        /* Recalculate the person placement after a short time. This is a hack
         * to fix a bug that appears while in portrait mode - the person area
         * gets resized after ngOnInit (probably flexbox related) and this
         * code doesn't catch that. */
        setTimeout(() => {
            this.placePersonElements();
        }, 100);
    }

    get numPeopleShown() : number
    {
        return this.people.length;
    }

    set numPeopleShown(value : number)
    {
        /* Remove/add person elements until we reach the target number */
        while (this.people.length > value)
        {
            this.personArea.removeChild(
                this.people.pop().element
            );
        }

        const rect = this.personArea.getBoundingClientRect();

        while (this.people.length < value)
        {
            const person = this.cachedPeople[this.people.length];
            this.people.push(person);
            this.personArea.appendChild(person.element);

            person.placeElement(rect);
        }

        function shuffle(lst : any[]) : any[]
        {
            const copy = lst.slice();
            const newList = [];

            while (copy.length > 0)
            {
                const pos = (Math.random()*copy.length)|0;
                newList.push(copy[pos]);
                copy.splice(pos, 1);
            }

            return newList;
        }
        this.handlePercentImmunityChange(this.percentImmunity);
    }

    get maxNumPeople() : number
    {
        return 200;
    }

    get personArea() : HTMLElement
    {
        return this._personArea.nativeElement;
    }

    get numPeopleListPercent() : number
    {
        return (100*this.numPeopleSick/this.numPeopleShown)|0;
    }

    handleReset()
    {
        this.numPeopleSick = 0;
        this.people.forEach(person => {
            person.sick = false;
        });
    }

    handleRandomize()
    {
        const points = [];
        this.cachedPeople.forEach(person => {
            const point = createRandomPersonPosition(points, MIN_PERSON_DIST, 5);
            points.push(point);
            person.x = point.x;
            person.y = point.y;
        });
        this.handleReset();
        this.placePersonElements();
        this.handlePercentImmunityChange(this.percentImmunity);
    }

    handleNumPeopleChange(event)
    {
        this.numPeopleShown = event.target.value;
        this.handleReset();
    }

    handleSicknessRadiusChange(event)
    {
        this.sicknessRadius = event.target.value;
        this.handleReset();
    }

    handleWindowResize()
    {
        this.placePersonElements();
    }

    handleClickPerson(person)
    {
        if (person.sick || person.immune) {
            return;
        }

        this.numPeopleSick++;
        person.sick = true;

        // Collect a list of people to ignite near the given person
        const lightList = this.people.filter(other => {
            return (
                !other.sick &&
                person.distanceTo(other) < this.sicknessRadius/100.0
            );
        });

        // Light them all after a short delay
        setTimeout(
            () => {
                lightList.forEach(other => {
                    // Check the sick flag here to we don't call handleClickPerson
                    // on a person that's already been marked sick earlier in
                    // this loop.
                    if (!other.sick) {
                        this.handleClickPerson(other);
                    }
                });
            },
            150
        );
    }

    placePersonElements()
    {
        const rect = this.personArea.getBoundingClientRect();
        this.people.forEach(person => {
            person.placeElement(rect);
        });
    }

    /* Called while the immunity value is changing (ie user is scrubbing the slider
     * back and forth) This callback only updates the reported immunity. */
    handlePercentImmunityChanging(value)
    {
        this.percentImmunity = value;
    }

    /* Called when the user has finished moving the slider and released the mouse
     * button. This callback randomly assigns person immunity based on the
     * chosen percentage. */
    handlePercentImmunityChange(value)
    {
        this.percentImmunity = value;
        this.numPeopleImmune = 0;
        let immune = 0;
        this.people.forEach((person, index) => {
            if (immune/(index+1) < this.percentImmunity/100) {
                person.immune = true;
                immune++;
                this.numPeopleImmune++;
            } else {
                person.immune = false;
            }
        });
        this.handleReset();
    }
}
