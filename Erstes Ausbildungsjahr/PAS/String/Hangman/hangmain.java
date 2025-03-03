import java.util.*;

public class hangmain {

  // Java program to implement
  // Hangman game
  static Scanner input;
  static int maxWrong;

  public static void hangman() {
    input = new Scanner(System.in);
    //optinos for the game
    System.out.println("Hangman options");
    System.out.print("type your guess word(not case sensitive): ");
    String word = input.nextLine();
    System.out.println("");
    System.out.print(
      "type your guess max guesses(can be lower than word length): "
    );
    maxWrong = input.nextInt();
    maxWrong = maxWrong + word.length();
    if (maxWrong < word.length()) {
      maxWrong = word.length();
    }
    System.out.println("");

    for (int i = 0; i < 30000; i++) {
      System.out.println("");
    }

    System.out.println(" Welcome to HANGMAN GAME ");

    // takes input of the word
    word = word.toUpperCase();

    // To show the word in underscores
    String word1 = word.replaceAll("[A-Z]", "_ ");

    // play the game
    System.out.println("let's play the game");
    startGame(word, word1);
  }

  public static void startGame(String word, String word1) {
    // total guesses

    // number of wrong guesses
    int wrong = 0;

    // for each guess

    // stores the guessed letter
    char letter;

    // stores if the letter was
    // already guessed
    boolean guessescontainsguess;
    String guesses = "";
    boolean guessinword;

    // while loop starts here
    while (wrong < maxWrong && word1.contains("_")) {
      System.out.println(word1 + "\n");
      int temp = maxWrong - wrong;
      if (wrong != 0) {
        // for picture 1
        System.out.println("You have " + temp + " guesses left.");
      }

      System.out.print("Your Guess:");

      // takes guess input

      // gets the first letter
      // as guessed letter
      letter = input.next().toUpperCase().charAt(0);

      guessescontainsguess = (guesses.indexOf(letter)) != -1;

      // stores every letter
      // guessed in guesses
      guesses += letter;

      // converts to uppercase for
      // comparison
      letter = Character.toUpperCase(letter);
      System.out.println();

      // if letter already guessed
      if (guessescontainsguess == true) {
        // already guessed letter
        System.out.println("You ALREADY guessed " + letter + ". \n");
      }

      // guessed letter is in the word
      guessinword = (word.indexOf(letter)) != -1;

      // if statement begins
      if (guessinword == true) {
        // print the letter
        System.out.println(letter + " is present in the word.");
        System.out.print("\n");

        // find the letter positions
        // replace dashes with those
        // letter at valid positions
        for (int position = 0; position < word.length(); position++) {
          // guessed letter is equal to
          // letter at position in word
          // and word1 has previously does not
          // have that letter
          if (
            word.charAt(position) == letter && word1.charAt(position) != letter
          ) {
            word1 = word1.replaceAll("_ ", "_");
            String word2;
            word2 =
              word1.substring(0, position) +
              letter +
              word1.substring(position + 1);
            word2 = word2.replaceAll("_", "_ ");
            word1 = word2;
          }
        }
      }
      // if statement ends, else if begins
      else {
        // prints
        // wrong = wrong + 1, after every
        // wrong answer
        System.out.println(letter + " is not present in the word.");
        wrong++;
      }
      // guess_ = guess_ + 1, after every
      // attempt

    } // while loop ends

    // if the lifelines finishes
    if (wrong == maxWrong) {
      System.out.println(
        "The word is: " +
        word +
        "\n YOU LOST!, maximum limit of incorrect guesses reached."
      );
    } else {
      // when solved
      System.out.println(
        "The word is: " + word1 + "\n Well Played, you did it!!"
      );
    }
  }

  public static void main(String[] args) {
    // play hangman game
    hangman();
  }
}
