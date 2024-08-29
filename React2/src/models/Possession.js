class Possession {
  constructor({ libelle, valeur, dateDebut, dateFin, taux }) {
    this.libelle = libelle;
    this.valeur = valeur;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.taux = taux;
  }

  getValeurActuelle() {
    const today = new Date();
    const dateDebut = new Date(this.dateDebut);
    const dateFin = this.dateFin ? new Date(this.dateFin) : today;
    const ageInYears = (dateFin - dateDebut) / (1000 * 60 * 60 * 24 * 365);
    const depreciation = 1 - (this.taux / 100) * ageInYears;
    return this.valeur * depreciation;
  }
}

export default Possession;