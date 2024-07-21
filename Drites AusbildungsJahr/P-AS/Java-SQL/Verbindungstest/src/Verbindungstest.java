import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
public class Verbindungstest {

	public static void main(String[] args) {
		try { // Parameter für Verbindungsaufbau definieren
			String url = "jdbc:mysql://localhost:30606/learnit"; String user = "root"; String password = "root";
			// Schritt 1: Verbindung aufbauen
			Connection con; con = DriverManager.getConnection(url, user, password);
			// Schritt 2: SQL-Anweisungen ausführen
			Statement stmt = con.createStatement(); ResultSet rs = stmt.executeQuery("SELECT * FROM T_Ansprechpartner ORDER BY Telefon");
			// Schritt 3: Ergebnis Abfrage und anzeigen:
			System.out.println("Telefonliste:"); System.out.println("-------------"); while (rs.next()) { System.out.println( rs.getString("telefon") + " | " + rs.getString("nachname") + ", " + rs.getString("vorname")); }
			// Schritt 4: Verbindung schließen
			con.close(); } catch (Exception ex) {
				// Mögliche Fehler abfangen…
				ex.printStackTrace();
				// … und zum Beispiel eine Fehlermeldung ausgeben
		}
	}
}