// src/models/Possession.js

export default class Possession {
  constructor(libelle, valeurInitiale, dateDebut, dateFin, amortissement) {
    this.libelle = libelle;
    this.valeurInitiale = valeurInitiale;
    this.dateDebut = new Date(dateDebut);
    this.dateFin = new Date(dateFin);
    this.amortissement = amortissement;
  }

  getValeurActuelle(date) {
    const dateActuelle = new Date(date);
    if (dateActuelle < this.dateDebut) return this.valeurInitiale;

    const age = (dateActuelle - this.dateDebut) / (1000 * 60 * 60 * 24 * 365); // âge en années
    const valeurActuelle =
      this.valeurInitiale -
      ((age * this.amortissement) / 100) * this.valeurInitiale;

    return Math.max(valeurActuelle, 0); // La valeur ne peut pas être négative
  }
}
