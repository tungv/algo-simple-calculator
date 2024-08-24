export interface Token {
  type: "number" | "operator";
  value: string;
}

export default function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];

  let currentToken = "";

  for (let i = 0; i < expression.length; ++i) {
    const char = expression[i];

    switch (char) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "0":
      case ".":
        currentToken += char;
        break;

      case "+":
      case "*":
      case "/":
        tokens.push({
          type: "number",
          value: currentToken,
        });
        tokens.push({
          type: "operator",
          value: char,
        });
        currentToken = "";
        break;

      case "-": {
        // this token has 2 meanings, it can be a subtraction operator or a negative number
        // if the previous token is a number, it's a subtraction operator
        if (currentToken) {
          // meaning there are digits before the -
          // it's a subtraction operator
          tokens.push({
            type: "number",
            value: currentToken,
          });
          tokens.push({
            type: "operator",
            value: char,
          });
          currentToken = "";
        } else {
          // it's a negative number
          currentToken = char;
        }
        break;
      }

      case " ":
        // break switch
        break;

      default:
        throw new Error("Invalid character");
    }
  }

  // Push the last token
  tokens.push({
    type: "number",
    value: currentToken,
  });

  return tokens;
}
