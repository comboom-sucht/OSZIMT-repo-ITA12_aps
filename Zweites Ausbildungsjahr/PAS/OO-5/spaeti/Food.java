
public class Food extends Artikel {

	// Attribute
	private boolean k�hlung;
	private String haltbarkeit;
	
	// Konstruktor
	public Food(int _artikelnr, String _bezeichnung) {
		// Konstruktor der Oberklasse aufrufen
		super(_artikelnr, _bezeichnung);		
	}

	// Methoden
	
	public boolean �berpr�feHaltbarkeit()
	{
		// TODO: Methode implementieren
		return true;
	}
	
	public boolean isK�hlung() {
		return k�hlung;
	}

	public void setK�hlung(boolean kuehlung) {
		this.k�hlung = kuehlung;
	}

	public String getHaltbarkeit() {
		return haltbarkeit;
	}

	public void setHaltbarkeit(String haltbarkeit) {
		this.haltbarkeit = haltbarkeit;
	}
	

}
