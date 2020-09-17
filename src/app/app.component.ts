import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  eiweissKcal = 4.1;
  kohlehydrateKcal = 4.1;
  fettKcal = 9.3;

  tagesziel = 1800;
  tageswert = 0;
  uebrig = this.tagesziel;

  mengeLM: number;
  fettLM: number;
  eiweissLM: number;
  kohlehydrateLM: number;

  anzahlZutaten = 0;
  mengePM: number;
  fettPM: number;
  eiweissPM: number;
  kohlehydratePM: number;
  anzahlPM: number;
  gegessenPM: number;

  letzterEintrag: number;

  canUndo = false;

  kcalWert: number;

  zutaten: Zutat[] = [];

  ngOnInit(): void {
    this.datenLaden();
  }

  lebensmittelEintragen(): void {
    this.letzterEintrag =
      (this.fettLM * this.fettKcal +
        this.eiweissLM * this.eiweissKcal +
        this.kohlehydrateLM * this.kohlehydrateKcal)
      / 100 * this.mengeLM;

    this.tageswert = this.tageswert + this.letzterEintrag;
    this.uebrig = this.tagesziel - this.tageswert;
    this.datenSpeichern();

    this.fettLM = null;
    this.eiweissLM = null;
    this.kohlehydrateLM = null;
    this.mengeLM = null;

    this.canUndo = true;
  }

  zutatEintragen(): void {
    this.anzahlZutaten++;
    const zutat: Zutat = {
      menge: this.mengePM,
      fett: this.fettPM,
      eiweiss: this.eiweissPM,
      kohlehydrate: this.kohlehydratePM,
    };

    this.zutaten.push(zutat);
    this.mengePM = null;
    this.fettPM = null;
    this.eiweissPM = null;
    this.kohlehydratePM = null;
  }

  mahlzeitEintragen(): void {
    let fette = 0;
    let kohlehydrate = 0;
    let eiweisse = 0;

    for (const werte of this.zutaten) {
      fette = fette + werte.fett * this.fettKcal / 100 * this.mengePM;
      kohlehydrate = kohlehydrate + werte.kohlehydrate * this.kohlehydrateKcal / 100 * this.mengePM;
      eiweisse = eiweisse + werte.eiweiss * this.eiweissKcal / 100 * this.mengePM;
    }

    const mahlzeit = (fette + eiweisse + kohlehydrate) / this.anzahlPM * this.gegessenPM;
    this.letzterEintrag = mahlzeit;

    this.tageswert = this.tageswert + mahlzeit;
    this.uebrig = this.tagesziel - this.tageswert;
    this.datenSpeichern();

    this.anzahlZutaten = 0;
    this.fettPM = null;
    this.eiweissPM = null;
    this.kohlehydratePM = null;
    this.mengePM = null;
    this.anzahlPM = null;
    this.gegessenPM = null;

    this.canUndo = true;
  }

  neuerTag(): void {
    this.tageswert = 0;
    this.uebrig = this.tagesziel;
    this.datenSpeichern();
  }

  datenLaden(): void {
    const werteText = localStorage.getItem('Kalorien');

    if (werteText != null) {
      const werteJSON = JSON.parse(werteText);
      this.tageswert = werteJSON.tageswert;
      this.uebrig = werteJSON.uebrig;
    }
  }

  datenSpeichern(): void {
    localStorage.setItem('Kalorien', JSON.stringify({tageswert: this.tageswert, uebrig: this.uebrig}));
  }

  letztenLoeschen(): void {
    if (this.canUndo) {
      this.tageswert = this.tageswert - this.letzterEintrag;
      this.uebrig = this.uebrig + this.letzterEintrag;
      this.datenSpeichern();
    }

    this.canUndo = false;
  }

  kcalEintragen(): void {
    this.tageswert = this.tageswert + this.kcalWert;
    this.uebrig = this.tagesziel - this.tageswert;
    this.letzterEintrag = this.kcalWert;
    this.canUndo = true;
    this.datenSpeichern();
    this.kcalWert = null;
  }

  lebensmittelEintragNichtOK(): boolean {
    if ((this.kohlehydrateLM < 0 || this.kohlehydrateLM == null) ||
      (this.eiweissLM < 0 || this.eiweissLM == null) ||
      (this.fettLM < 0 || this.fettLM == null) ||
      (this.mengeLM < 0 || null)) {
      return true;
    }
  }

  zutatEintragenNichtOk(): boolean {
    if ((this.mengePM == null || this.mengePM < 0) ||
      (this.fettPM == null || this.fettPM < 0) ||
      (this.eiweissPM == null || this.eiweissPM < 0) ||
      (this.kohlehydratePM == null || this.kohlehydratePM < 0)) {
      return true;
    }
  }

  portionEintragenNichtOK(): boolean {
    if (this.anzahlZutaten < 1 ||
      (this.anzahlPM < 1 || this.anzahlPM == null) ||
      (this.gegessenPM < 1 || this.gegessenPM == null) ||
      (this.gegessenPM > this.anzahlPM)) {
      return true;
    }
  }

  runden(zuRunden: number): string {
    return (Math.round(zuRunden * 100 ) / 100).toString();
  }


}


interface Zutat {
  fett: number;
  eiweiss: number;
  kohlehydrate: number;
  menge: number;
}

