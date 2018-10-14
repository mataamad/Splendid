import { Component, OnInit, Input } from '@angular/core';
import { GemList, RandomInt, RandomNonGoldGem } from "../gem/gem.component";

@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <div class="points">
        <div class="spacer"></div>
        {{Card.PointsGiven || '&nbsp;'}}
      </div>
      <div class="gives" *ngFor="let gem of Card.GemsGiven.nonZero | keyvalue">
        <div class="spacer"></div>
        <app-gem [Type]="gem.key" [Count]="gem.value"></app-gem>
        <div class="spacer"></div>
      </div>
      <div class="spacer"></div>
      <div class="requirements">
        <div *ngFor="let gem of Card.GemsRequired.nonZero | keyvalue">
          <app-gem [Type]="gem.key" [Count]="gem.value" [Small]="true"></app-gem>
        </div>
      </div>
    </div>`,
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() Card: Card;

  constructor() { }

  ngOnInit() {
  }

}

export interface Card {
    GemsRequired: GemList;
    GemsGiven: GemList;
    PointsGiven: number;
    CardNumber: number;
    Tier: number;
}

let cardNumber = -1;

export function MakeTier1Card(): Card {

    let points = 0;
    let gems = new GemList();
    if (RandomInt(3) === 0) {
        // 25% chance of single colour requirement gem with 3 cost
        gems[RandomNonGoldGem()] = 3;
    } else {
        // 75% chance of multi colour requirement

        // 75% chance of being a 4 cost card, otherwise 3 cost
        let cost = (RandomInt(3) === 0) ? 3 : 4;

        let spentCost = 0;
        while (spentCost < cost) {
            spentCost++;
            let gem = RandomNonGoldGem();
            gems[gem]++;
        }

        if (cost === 4 && RandomInt(3) === 0 ) { // 4 cost gems have chance of being worth a point
            points = 1;
        }
    }

    let gemsGiven = new GemList();
    gemsGiven[RandomNonGoldGem()] = 1;

    cardNumber++;

    return {
        GemsGiven: gemsGiven,
        GemsRequired: gems,
        PointsGiven: points,
        CardNumber: cardNumber,
        Tier: 1
    }
}