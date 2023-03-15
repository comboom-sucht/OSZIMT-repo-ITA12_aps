
public class Fahrzeug {

	private Betriebsst�tte depot;
	private String interneNummer;
	private int anzahlPl�tze;
	
	public Fahrzeug(String _interneNummer) {
		this.interneNummer = _interneNummer;
	}

	public Betriebsst�tte getDepot() {
		return depot;
	}

	public void setDepot(Betriebsst�tte depot) {
		this.depot = depot;
		if (depot == null)
			return;
		if (!depot.istFahrzeugVorhanden(this))
		{
			depot.f�geFahrzeugHinzu(this);
		}
	}

	public String getInterneNummer() {
		return interneNummer;
	}

	public void setInterneNummer(String interneNummer) {
		this.interneNummer = interneNummer;
	}

	public int getAnzahlPl�tze() {
		return anzahlPl�tze;
	}

	public void setAnzahlPl�tze(int anzahlPl�tze) {
		this.anzahlPl�tze = anzahlPl�tze;
	}

}
