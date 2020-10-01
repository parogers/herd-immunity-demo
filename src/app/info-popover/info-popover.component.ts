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

import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-info-popover',
    templateUrl: './info-popover.component.html',
    styleUrls: ['./info-popover.component.scss']
})
export class InfoPopoverComponent implements OnInit
{
    visible : boolean = false;

    constructor() { }

    ngOnInit(): void {
    }

    show() {
        this.visible = true;
    }

    handleClose() {
        this.visible = false;
    }

}
