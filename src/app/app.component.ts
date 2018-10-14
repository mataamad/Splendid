import { Component } from '@angular/core';
import { GemList, GemTypes, GemType } from './gem/gem.component';
import { MakeTier1Card, Card } from './card/card.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  tier1Cards: Card[] = [];

  bank = new GemList();

  player1 = {
    gems: new GemList(), 
    cards: <Card[]>[] // todo: questionable
  };

  thisTurn = {
    gemsPicked: new GemList(),
  };

  constructor() {
    for (let gem of GemTypes()) {
      this.bank[gem] = 4;
    }

    // todo: cleaner for?
    for (let i = 0; i < 4; i++) {
      this.tier1Cards.push(MakeTier1Card());
    }
  }

  pickGem(coinKey: string) {
    if (this.bank[coinKey] > 0 && parseInt(coinKey) !== GemType.Gold) {
      this.bank[coinKey]--;
      this.thisTurn.gemsPicked[coinKey]++;
    }
  }

  undoPickGem(coinKey: string) {
    if (this.thisTurn.gemsPicked[coinKey] > 0) {
      this.thisTurn.gemsPicked[coinKey]--;
      this.bank[coinKey]++;
    }
  }

  validateGemsBuyable(): boolean {
    let gemsBuying = this.thisTurn.gemsPicked;
    if (Object.values(gemsBuying.nonZero).every(g => g === 1) && Object.values(gemsBuying).reduce((a, b) => a + b, 0) <= 3) {
      // up to 3 different gems
      return true;
    } else {
      // check for 2 gems of the same type.  Must have been 4 in the bank
      if (Object.values(gemsBuying).reduce((a, b) => a + b, 0) === 2) {
        let buyingTwo = Object.entries(gemsBuying.nonZero).filter(kvp => kvp[1] === 2)[0];
        if (buyingTwo !== undefined) {
          let gemType = buyingTwo[0];
          if (this.bank[gemType] + 2 >= 4) {
            return true;
          }
        }
      }
    }
    return false;
  }

  confirmBuyGems() {
    let gemsBuying = this.thisTurn.gemsPicked;

    if (!this.validateGemsBuyable()) {
      alert('cannot buy this combination of gems');
      return;
    }

    this.player1.gems = this.player1.gems.add(gemsBuying);
    this.thisTurn.gemsPicked = new GemList();
  }

  pickCard(card: Card) {
    this.thisTurn.gemsPicked = new GemList();

    // cards you own give you gems so they reduce the cost to buy
    var freeGems = this.player1.cards.map(c => c.GemsGiven).reduce((c1, c2) => c1.add(c2), new GemList());
    let gemsRequired = card.GemsRequired.subtract(freeGems).nonNegative();

    if (!this.player1.gems.satisfies(gemsRequired)) {
      alert('Cannot afford card.');
    } else {

      this.player1.gems = this.player1.gems.subtract(gemsRequired);
      this.bank = this.bank.add(gemsRequired);
      // remove the card from tier one & generate a new one
      // add it to the hand
      this.tier1Cards = this.tier1Cards.filter(c => c.CardNumber !== card.CardNumber);
      this.tier1Cards.push(MakeTier1Card());

      this.player1.cards.push(card);
    }
  }
}
