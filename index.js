import Foldmaker, { tokenize, visitor } from "foldmaker";

export default string => {
  let tokens = tokenize(
    string,
    [
      ["s", /(")(\\\1|[\s\S])*?\1/], // String
      ["n", /[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?/], // Number
      ["j", /[\{\}\[\],:]/], // { } [ ] , : remains unchanged
      [" ", /[ \t\n\r]+/] // Whitespace
    ],
    ({ type, value }) => {
      if (type === "j") type = value; // Let them remain unchanged
      else if (type === " ") return null; // Ignore Whitespace
      else if(type === '0') throw 'Unexpected token ' + value // ERROR
      return { type, value };
    }
  );

  return Foldmaker(tokens)
    .replace(/\{\}/, () => ['o', {}]) // Empty object
    .replace(/\[\]/, () => ['a', []]) // Empty array
    .parse([
      visitor(/s:[snao]/, result => { // Key-value pair
        let key = result[0][0]
        let value = result[0][2]
        key = key.substring(1, key.length-1)
        if(typeof value === 'string') value = value.substring(1, value.length-1)
        return ['k', [key, value]]
      }),
      visitor(/\{k(,k)*\}/, result => { // Object
        let obj = {}
        result[0]
          .filter(prop => typeof prop === 'object')
          .forEach(([key, value])=> {
            obj[key] = value
          })
        return ['o', obj]
      }),
      visitor(/\[[snao](,[snao])*\]/, result => { // Array
        let map = result.map[0]
        let array = result[0].filter((val, i) => map[i] !== ',')
        array = array.slice(1, array.length-1)
        return ['a', array]
      })
    ])
    .array[0];
};
