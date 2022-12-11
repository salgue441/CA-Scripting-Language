import {
  Stmt,
  Program,
  Expression,
  BinaryExpression,
  NumberLiteral,
  Identifier,
} from "./ast"

import { tokenize, Token, TokenType } from "./lexer"

/**
 * @brief
 * Parses the tokens into an AST
 * @param tokens Tokens to parse
 * @returns AST
 */
export default class Parser {
  private tokens: Token[]

  /**
   * @brief
   * Checks if the next token is not EOF.
   * Determines if the parser should stop and the end of the file has
   * been reached.
   * @returns True if the next token is not EOF
   */
  private not_eof(): boolean {
    return this.tokens[0].type != TokenType.EOF
  }

  /**
   * @brief
   * Returns the currently available token
   * @returns Current token
   */
  private at() {
    return this.tokens[0] as Token
  }

  /**
   * @brief
   * Returns the previous token and then advances the
   * tokens array to the next value.
   * @returns Previous token
   */
  private prev() {
    const previous = this.tokens.shift() as Token

    return previous
  }

  /**
   * @brief
   * Returns the previous token and then advances the tokens array to
   * the next value. Also checks the type of expected token and throws
   * an error if the type does not match.
   * @param type Expected token type
   * @param err Error to throw if the type does not match
   * @returns Previous token
   */
  private expect(type: TokenType, err: any) {
    const prev = this.prev()

    if (!prev || prev.type != type) {
      throw new Error(err)
    }

    return prev
  }

  /**
   * @brief
   * Produces an AST from the tokens
   * @param tokens Tokens to parse
   * @returns AST
   */
  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode)

    const program: Program = {
      type: "Program",
      kind: "Program",
      body: [],
    }

    while (this.not_eof()) {
      program.body.push(this.parseStatement())
    }

    return program
  }

  /**
   * @brief
   * Handles the complex statement types
   * @returns Expression
   */
  private parseStatement(): Stmt {
    //   skip to parse_expression_statement
    return this.parse_expr()
  }

  /**
   * @brief
   * Handles expressions
   * @returns Expression
   */
  private parse_expr(): Expression {
    return this.parse_additive_expression()
  }

  /**
   * @brief
   * Handles addition and subtraction Operations
   * @returns Expression
   */
  private parse_additive_expression(): Expression {
    let left = this.parse_additive_expression()

    while (this.at().value == "+" || this.at().value == "-") {
      const operator = this.prev().value
      const right = this.parse_additive_expression()

      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator,
      } as BinaryExpression
    }

    return left
  }

  /**
   * @brief
   * Handles multiplication and division operations
   * @returns Expression
   */
  private parse_multiplicative_expression(): Expression {
    let left = this.parse_primary_expression()

    while (
      this.at().value == "/" ||
      this.at().value == "*" ||
      this.at().value == "%"
    ) {
      const operator = this.prev().value
      const right = this.parse_primary_expression()

      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator,
      } as BinaryExpression
    }

    return left
  }

  /**
   * @brief
   * Handles the lowest level of expressions
   * @returns Expression
   * @throws Error if the token is not a number or identifier
   */
  private parse_primary_expression(): Expression {
    const token = this.at().type

    // Determines which token type to parse
    switch (token) {
      case TokenType.Identifier:
        return {
          kind: "Identifier",
          value: this.prev().value,
        } as Identifier

      case TokenType.Number:
        return {
          kind: "NumberLiteral",
          value: parseFloat(this.prev().value),
        } as NumberLiteral

      case TokenType.OpenParent: {
        this.prev()

        const expr = this.parse_expr()
        this.expect(TokenType.CloseParent, "Expected closing parenthesis")

        return expr
      }

      // Undefined token type
      default:
        throw new Error(`Unexpected token ${token}`)
    }
  }
}
