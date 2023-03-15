
import java.util.ArrayList;

public class Betriebsst�tte extends Haltepunkt {
	
	// Attribute
	private ArrayList<Fahrzeug> zugeordneteFahrzeuge;
	
	// Konstruktor
	public Betriebsst�tte()
	{
		// Initialisiere Liste
		this.zugeordneteFahrzeuge = new ArrayList<Fahrzeug>();
	}
	
	// Methoden
	public void f�geFahrzeugHinzu(Fahrzeug _neuesFahrzeug)
	{
		this.zugeordneteFahrzeuge.add(_neuesFahrzeug);
	}
	
	public boolean istFahrzeugVorhanden(Fahrzeug _gesuchtesFahrzeug)
	{
		return this.zugeordneteFahrzeuge.contains(_gesuchtesFahrzeug);
	}
	
	public boolean hatFahrzeugtypVerf�gbar(Class<?> _gesuchterTyp)
	{
		for (Fahrzeug fahrzeug : this.zugeordneteFahrzeuge)
	    {
	        if (fahrzeug.getClass().equals(_gesuchterTyp))
	        {
	            return true;
	        }
	    }
	    return false;
	}
	
	
	public ArrayList<Fahrzeug> getZugeordneteFahrzeuge() {
		return zugeordneteFahrzeuge;
	}

	public void setZugeordneteFahrzeuge(ArrayList<Fahrzeug> zugeordneteFahrzeuge) {
		this.zugeordneteFahrzeuge = zugeordneteFahrzeuge;
	}
	
	
}
