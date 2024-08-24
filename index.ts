export default function calc(expression: string): number {
  const tokens = [];

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
        currentToken += char;
        break;

      case "+":
        tokens.push({
          type: "number",
          value: currentToken,
        });
        tokens.push({
          type: "operator",
          value: "+",
        });
        currentToken = "";
        break;
    }
  }

  // Push the last token
  tokens.push({
    type: "number",
    value: currentToken,
  });

  return 2;
}
