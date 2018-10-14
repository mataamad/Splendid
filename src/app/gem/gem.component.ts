import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gem',
  template: `
    <div class="container">
      <div class="diamond" [ngClass]="[Color, NoneStyle, SmallStyle]"></div>
      <ng-container *ngIf="Count > 0">{{Count}}</ng-container>
    </div>
  `,
  styleUrls: ['./gem.component.scss']
})
export class GemComponent implements OnInit {
  @Input() Type: string; // todo: something weird is happening to this type - I want it to be a number not a string, is it because I'm passing in an enum value?
  @Input() Count: number;
  @Input() Small: false;

  // todo: probably a tider way to do this
  get NoneStyle(): string {
    if (this.Count === 0) {
      return 'none'
    }
    return ''
  }

  get SmallStyle(): string {
    return this.Small ? 'small' : '';
  }

  get Color(): string {
    switch (parseInt(this.Type)) {
      case GemType.Black:
        return "black";
      case GemType.Blue:
        return "blue";
      case GemType.Green:
        return "green";
      case GemType.Red:
        return "red";
      case GemType.White:
        return "white";
      case GemType.Gold:
        return "gold";
      default:
        throw `unrecognised gem type ${this.Type}`;
    }
  }

  repeatFour = Array(4).fill(1);

  constructor() { }

  ngOnInit() {
  }

}

export enum GemType {
  Red = 0,
  Blue = 1,
  Black,
  White,
  Green,
  Gold
}
const NonGoldGems = 5;

export function GemTypes() : GemType[] {
  return Object.keys(GemType)
      .filter(key => isNaN(Number(key)))
      .map(key => GemType[key]);
}

export class GemList {

  [GemType.Red] = 0;
  [GemType.Blue] = 0;
  [GemType.Black] = 0;
  [GemType.White] = 0;
  [GemType.Green] = 0;
  [GemType.Gold] = 0;

  add(other: GemList) {
      let result = new GemList();
      for (let gem of GemTypes()) {
          result[gem] = this[gem] + other[gem];
      }
      return result;
  }
  subtract(other: GemList) {
      let result = new GemList();
      for (let gem of GemTypes()) {
          result[gem] = this[gem] - other[gem];
      }
      return result;
  }
  nonNegative() {
      let result = new GemList();
      for (let gem of GemTypes()) {
          if (this[gem] > 0) {
              result[gem] = this[gem];
          }
      }
      return result;
  }
  // doesn't support gold
  satisfies(other: GemList): boolean {
      return Object.values(this.subtract(other)).every(v => v >= 0);
  }

  get nonZero() : { [gem in GemType]?: number } {
      return Object.assign({}, ...Object.entries(this).filter(gems => gems[1] > 0).map(([k, v]) => ({[k]: v})));
  }
}

// todo: function should be elsewhere
export function RandomInt(max: number): number {
  return Math.floor(Math.random()*(Math.ceil(max)+1));
}

// todo: should be namespaced
export function RandomNonGoldGem(): GemType {
  return RandomInt(NonGoldGems-1);
}
