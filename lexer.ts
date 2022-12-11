// Supported Tokens in the language
export enum TokenType {
  Number,
  Identifier,
  Equals,
  OpenParent,
  CloseParent,
  BinaryOperator,
  Let,
}

// Reserved keywords
const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
}

// Token interface
export interface Token {
  value: string
  type: TokenType
}

/**
 * @brief
 * Creates a token
 * @param value Value of the token (default: "")
 * @param type Type of the token
 * @returns Token
 */
function createToken(value = "", type: TokenType): Token {
  return { value, type }
}

/**
 * @brief
 * Checks if the given string is an alpha numeric string
 * @param src String to check
 * @returns True if the string is alpha numeric, false otherwise
 */
function isAlphaNumeric(src: string) {
  return src.toUpperCase() != src.toLowerCase()
}

/**
 * @brief
 * Checks if the given string is an integer
 * @param src String to check
 * @returns True if the string is an integer, false otherwise
 */
function isInteger(src: string) {
  return !isNaN(parseInt(src))
}

/**
 * @brief
 * Checks if the given string is a skippable character
 * @param src String to check
 * @returns True if the string is a skippable character, false otherwise
 */
function isSkippable(src: string) {
  return src == " " || src == "\t" || src == "\r" || src == "\n"
}

/**
 * @brief
 * Tokenizes the source code into tokens
 * @param sourceCode Source code to tokenize
 * @returns Array of tokens
 */
export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>()

  // splitting on every character
  const src = sourceCode.split("")

  // building each token
  while (src.length > 0) {
    if (src[0] == "(")
      tokens.push(createToken(src.shift()!, TokenType.OpenParent))
    else if (src[0] == ")")
      tokens.push(createToken(src.shift()!, TokenType.CloseParent))
    else if (
      src[0] == "+" ||
      src[0] == "-" ||
      src[0] == "*" ||
      src[0] == "/" ||
      src[0] == "%" ||
      src[0] == "^"
    )
      tokens.push(createToken(src.shift()!, TokenType.BinaryOperator))
    else if (src[0] == "=")
      tokens.push(createToken(src.shift()!, TokenType.Equals))
    // Handling multi-character tokens
    else {
      // Building number tokens
      if (isInteger(src[0])) {
        let num = ""

        while (src.length > 0 && isInteger(src[0])) {
          num += src.shift()
        }

        tokens.push(createToken(num, TokenType.Number))
      }

      // Building alphanumeric tokens
      else if (isAlphaNumeric(src[0])) {
        let ident = ""

        while (src.length > 0 && isAlphaNumeric(src[0])) {
          ident += src.shift()
        }

        // checking for reserved keywords
        const reserved = KEYWORDS[ident]

        if (reserved == undefined)
          tokens.push(createToken(ident, TokenType.Identifier))
        else tokens.push(createToken(ident, reserved))
      }

      // checking for skippable characters
      else if (isSkippable(src[0])) {
        src.shift()
      }

      // Unexpected character
      else {
        throw new Error(`Unexpected character: ${src[0]}`)
      }
    } // end of multi-character token
  } // while

  return tokens
}

const sourceCode = Deno.readTextFileSync("./test.txt")
for (const token of tokenize(sourceCode)) {
  console.log(token)
}
