# json-parse
Implementation of JSON.parse in JavaScript, only in ~45 lines of code. Does the parsing with [foldmaker.js](https://github.com/foldmaker/foldmaker). Does not use `.eval` or anything like that. Only tested in few instances. I tried to keep it simple and compact as possible, so it does not report all the syntax errors, so it can also produce output from invalid JSON. However, I think it gives correct output for valid JSON.
