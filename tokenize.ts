export interface Token {
  type: "number" | "operator" | "parenthesis";
  value: string;
}

export default function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];

  let currentToken = "";
  let expectNegative = true;

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
        expectNegative = false;
        break;

      case "+":
      case "*":
      case "/":
        expectNegative = true;
        if (currentToken) {
          tokens.push({
            type: "number",
            value: currentToken,
          });
        }
        tokens.push({
          type: "operator",
          value: char,
        });
        currentToken = "";
        break;

      case "-": {
        // this token has 2 meanings, it can be a subtraction operator or a negative number
        // if the previous token is a number, it's a subtraction operator
        if (expectNegative) {
          // it's a negative number
          currentToken = char;
          expectNegative = false;
        } else {
          // meaning there are digits before the -
          // it's a subtraction operator
          if (currentToken) {
            tokens.push({
              type: "number",
              value: currentToken,
            });
          }
          tokens.push({
            type: "operator",
            value: char,
          });
          currentToken = "";

          // subtracting a negative number is allowed
          expectNegative = true;
        }
        break;
      }

      case "(":
        expectNegative = true;
        tokens.push({
          type: "parenthesis",
          value: char,
        });
        currentToken = "";
        break;

      case ")": {
        expectNegative = false;
        if (currentToken) {
          tokens.push({
            type: "number",
            value: currentToken,
          });
          currentToken = "";
        }

        tokens.push({
          type: "parenthesis",
          value: char,
        });
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
  if (currentToken) {
    tokens.push({
      type: "number",
      value: currentToken,
    });
  }

  return tokens;
}
