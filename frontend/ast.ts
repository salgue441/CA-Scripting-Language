//
export type NodeType =
  | "Program"
  | "NumberLiteral"
  | "Identifier"
  | "BinaryExpression"

/**
 * @brief
 * Statements do not result in a value at runtime.
 * They contain one or more expressions internally.
 */
export interface Stmt {
  type: NodeType
}

/**
 * @brief
 * Defines a block which contains many statements.
 * This is the root node of the AST.
 */
export interface Program extends Stmt {
  type: "Program"
  kind: "Program"
  body: Stmt[]
}

/**
 * @brief
 * Expressions result in a value at runtime.
 * unlike statements, expressions can be used as values.
 */
export interface Expression extends Stmt {}

/**
 * @brief
 * An operation with two sides separated by an operator.
 * Both sides can be any complex expression.
 * - Supported operators: +, -, *, /, %
 */
export interface BinaryExpression extends Expression {
  kind: "BinaryExpression"
  left: Expression
  right: Expression
  operator: string
}

/**
 * @brief
 * Represents a user-defined variable or symbol in source
 */
export interface Identifier extends Expression {
  kind: "Identifier"
  value: string
}

/**
 * @brief
 * Represents a numeric constant in source
 */
export interface NumberLiteral extends Expression {
  kind: "NumberLiteral"
  value: number
}
