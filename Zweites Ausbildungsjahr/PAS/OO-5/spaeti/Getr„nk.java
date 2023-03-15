
public class Getr�nk extends Food {

	private double f�llmenge;
	private int altersfreigabe;
	
	public Getr�nk(int _artikelnr, String _bezeichnung) {
		super(_artikelnr, _bezeichnung);
	}
	
	public boolean pr�feAlter(int _alter)
	{
		return (_alter >= altersfreigabe);
	}

	public int getAltersfreigabe() {
		return altersfreigabe;
	}

	public void setAltersfreigabe(int altersfreigabe) {
		this.altersfreigabe = altersfreigabe;
	}

	public double getF�llmenge() {
		return f�llmenge;
	}

	public void setF�llmenge(double fuellmenge) {
		this.f�llmenge = fuellmenge;
	}
	


}
