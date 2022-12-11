import Parser from "./frontend/parser"

repl()

/**
 * @brief
 * REPL for the language
 * @returns void
 */
function repl() {
  const parser = new Parser()

  console.log("Welcome to the REPL!")

  while (true) {
    const input = prompt(">>> ")

    if (!input || input.includes("exit")) break

    //   Produces AST from source-code
    const program = parser.produceAST(input)
    console.log(program)
  }
}
