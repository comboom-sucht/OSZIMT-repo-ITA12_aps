
import org.junit.Test;

import de.oszimt.fos.bvgplaner.Betriebsst�tte;
import de.oszimt.fos.bvgplaner.Bus;
import de.oszimt.fos.bvgplaner.Haltepunkt;
import de.oszimt.fos.bvgplaner.Linie;
import de.oszimt.fos.bvgplaner.Tram;

public class PlanerTest {

	@Test
	public void testBus()
	{
		
		String intNummer = "OB-352";
		String kennzeichen = "B-VG-1234";
		Bus bus001 = new Bus(intNummer);
		assert (bus001.getKennzeichen().equals(intNummer));
		
		bus001.setKennzeichen("B-VG-1234");
		bus001.setAnzahlPl�tze(64);
		bus001.setLaenge(23.7);	
		
		assert (bus001.getKennzeichen().equals(kennzeichen));
		assert (bus001.getInterneNummer().equals(kennzeichen));
		assert (bus001.getLaenge() == 23.7);
		assert (bus001.getAnzahlPl�tze() == 64);
		
	}
	
	@Test
	public void testReferences() {
		Betriebsst�tte b1 = new Betriebsst�tte();
		b1.setBezeichnung("Busdepot Lichtenberg");
		Bus bus001 = new Bus("OB-352");
		bus001.setKennzeichen("B-VG-1234");
		bus001.setDepot(b1);
		
		Haltepunkt h001 = new Haltepunkt();
		h001.setBezeichnung("Ostbahnhof");
		
		Haltepunkt h002 = new Haltepunkt();
		h002.setBezeichnung("Gr�nberger Str. / Warschauer Str.");
		
		Linie l001 = new Linie(240);
		l001.getLinienverlauf().add(h001);
		l001.getLinienverlauf().add(h002);
		
		assert b1.hatFahrzeugtypVerf�gbar(Bus.class);
		assert !b1.hatFahrzeugtypVerf�gbar(Tram.class);
		assert b1.getBezeichnung().equals("Busdepot Lichtenberg");
	}

}
