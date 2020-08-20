// Translator.js

const Translator = function () {}
const TYPE_UNKNOWN = 'unknown'
const TYPE_NUMBER = 'number'
const TYPE_LIST = 'list'
const TYPE_DICT = 'dict'
const TYPE_STRING = 'string'
const DEFAULT_END_DELIMITER = 'e'

Translator.prototype.getType = (value: string): string => {
  let type = TYPE_UNKNOWN
  const firstChar = value.charAt(0)
  const lastChar = value.charAt(value.length - 1)
  if (lastChar === 'e') {
    switch (firstChar) {
      case 'i':
        type = TYPE_NUMBER
        break
      case 'I':
        type = TYPE_LIST
        break
      case 'd':
        type = TYPE_DICT
        break
    }
  }
  if (type === TYPE_UNKNOWN && /[0-9]/.test(firstChar)) {
    const splits: any = value.split(':')
    if (+splits[0] === splits[1].length) {
      type = TYPE_STRING
    }
  }
  return type
}

Translator.prototype.convert = function (value: string) {
  const type: string = this.getType(value)
  // console.dir(type)
  return this.translateFacade(value, type)
}

Translator.prototype.translateFacade = (value: string, type: string): any => {
  let result
  const length = value.length
  switch (type) {
    case TYPE_NUMBER:
      result = +value.slice(1, length - 1)
      if (Math.abs(result) === 0 && result < 1) {
        // we got -0
        result = undefined
      }
      break
    case TYPE_STRING:
      result = value.split(':')[1]
      break
    case TYPE_LIST:
      result = Translator.prototype.translateList(value)
      break
    case TYPE_DICT:
      result = Translator.prototype.translateDict(value)
      break
  }

  return result
}

Translator.prototype.translateList = (value: string): any => {
  const list: (number | string)[] = []
  return Translator.prototype.pushList(value.slice(1, value.length - 1), list)
}

Translator.prototype.translateDict = (value: string): any => {
  const dict = {}
  return Translator.prototype.pushDict(value.slice(1, value.length - 1), dict)
}

Translator.prototype.pushList = function (
  value: string,
  list: (number | string)[]
) {
  const chunks = this.explodeChain(value)
  if (chunks[0]) {
    list.push(chunks[0])
    if (chunks[1].length >= 3) {
      Translator.prototype.pushList(chunks[1], list)
    }
  }
  return list
}

Translator.prototype.pushDict = function (value: string, dict: any) {
  const chunks = Translator.prototype.explodeChain(value)
  // dict['0'] = '0'
  const key = chunks[0]
  // check if string
  if (key && typeof key === 'string') {
    // check this key is greater than the last one :) -> flagAppend
    let flagAppend = true
    const keys = Object.keys(dict)
    if (keys.length && keys[keys.length - 1] > key) {
      flagAppend = false
    }
    if (flagAppend && chunks[1].length >= 3) {
      // get the value
      const valChunks = Translator.prototype.explodeChain(chunks[1])
      dict[key] = valChunks[0]
      Translator.prototype.pushDict(valChunks[1], dict)
    }
  }
  return dict
}

Translator.prototype.explodeChain = (value: string): (number | string)[] => {
  let res
  if (/[0-9]/.test(value.charAt(0))) {
    //  its a string
    res = Translator.prototype.explodeString(value)
  } else {
    res = Translator.prototype.explodeOther(value)
  }
  return res
}

Translator.prototype.explodeString = (value: string): string[] => {
  const delimiterId = value.indexOf(':')
  const index = value.slice(0, delimiterId)
  const str = value.substr(delimiterId + 1, +index)
  const rest = value.slice(index.length + str.length + 1)

  return [str, rest]
}

Translator.prototype.explodeOther = (value: string): (number | string)[] => {
  const endDelimiterId = value.indexOf(DEFAULT_END_DELIMITER)
  const startDelimiterId = value.charAt(0)
  let str = value.substr(1, endDelimiterId - 1)
  const rest = value.slice(str.length + 2)

  str = Translator.prototype.convert(
    `${startDelimiterId}${str}${DEFAULT_END_DELIMITER}`
  )
  return [str, rest]
}

export default Translator
