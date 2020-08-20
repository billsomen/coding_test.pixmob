import TranslatorObject from '~/static/js/translator'
const Translator = new TranslatorObject()

describe('translator', () => {
  /* test('is translating number', () => {
    expect(Translator.convert('i-4542e')).toEqual(-4542)
    expect(Translator.convert('i-043e')).toEqual(-43)
    expect(Translator.convert('i-0e')).toEqual(undefined)
    expect(Translator.convert('i-4542d')).toBe(undefined)
  })

  test('is translating string', () => {
    expect(Translator.convert('4:spam')).toBe('spam')
    expect(Translator.convert('4:spame')).not.toBe('spame')
  })

  test('is translating lists', () => {
    expect(Translator.convert('I4:spami-45eI4:bookee')).toEqual([
      'spam',
      -45,
      ['book'],
    ])
    expect(Translator.convert('I4:spami-45eI4:booke')).toEqual([
      'spam',
      -45,
      [],
    ])
  })

  test('is translating dictionary', () => {
    expect(Translator.convert('d3:bar4:spam3:fooi42ee')).toEqual({
      bar: 'spam',
      foo: 42,
    })

    expect(Translator.convert('d3:fooi42e3:bar4:spame')).toEqual({
      foo: 42,
    })
  }) */

  test('is translating complex dictionary', () => {
    const str = 'I123daI01dbceeee'
    const indices = (key, str) => {
      const indices = []
      for (let i = 0; i < str.length; i++) {
        if (str[i] === key) indices.push(i)
      }
      return indices
    }
    const endings = { '[': ']', '{': '}' }
    const containers = {}
    indices('I', str).forEach((item) => (containers[item] = '['))
    indices('d', str).forEach((item) => (containers[item] = '{'))
    const endValues = Object.values(containers).reverse()

    indices('e', str).forEach((item, key) => {
      containers[item] = endings[endValues[key]]
    })
    let exp = ''
    for (let i = 0; i < str.length; i++) {
      if (i in containers) {
        exp += containers[i]
      } else {
        exp += str[i]
      }
    }

    const updateSets = (str) => {
      const indices = (key, str) => {
        const indices = []
        for (let i = 0; i < str.length; i++) {
          if (str[i] === key) indices.push(i)
        }
        return indices
      }
      const endings = { '[': ']', '{': '}' }
      const containers = {}
      indices('I', str).forEach((item) => (containers[item] = '['))
      indices('d', str).forEach((item) => (containers[item] = '{'))
      const endValues = Object.values(containers).reverse()

      indices('e', str).forEach((item, key) => {
        containers[item] = endings[endValues[key]]
      })
      let exp = ''
      for (let i = 0; i < str.length; i++) {
        if (i in containers) {
          exp += containers[i]
        } else {
          exp += str[i]
        }
      }

      return exp
    }
    // console.log('str', exp)
    let list = 'I4:spami-45eI4:bookee'
    const strings = {}
    const strIds = [...list.matchAll(/[1-9]:/g)]
    const replaces = []
    // console.dir(list)
    strIds.forEach((item) => {
      const len = item[0].split(':')[0]
      // list.substr(item.index, item[0].split(':')[0])
      strings[item.index] = list.substr(item.index + item[0].length, +len)
      const key = list.substr(item.index, item[0].length + +len)
      const value = list.substr(item.index + item[0].length, +len)
      replaces.push({ key, value })
    })
    replaces.forEach((item, key) => {
      // replace with keys from replaces
      list = list.replace(item.key, `_${key}&`)
      // list = list.replace(item.key, `_${item.value}&`)
    })

    const numberIds = [...list.matchAll(/i-?[0-9]\d+e/g)]
    numberIds.forEach((item) => {
      console.dir(item[0].match(/-?[0-9]\d/g))
      // const len = item[0].split(':')[0]
      // // list.substr(item.index, item[0].split(':')[0])
      // strings[item.index] = list.substr(item.index + item[0].length, +len)
      // console.dir(strings)
      // const key = list.substr(item.index, item[0].length + +len)
      // const value = list.substr(item.index + item[0].length, +len)
      replaces.push({ key: item[0], value: item[0].match(/-?[0-9]\d/g)[0] })
    })
    replaces.forEach((item, key) => {
      list = list.replace(item.key, `_${key}&`)
    })
    const list2 = 'Ii-45eI4:bookee'
    const dict = 'd3:bar4:spame'
    const dictDict = `d3:bar${dict}e`
    const dictList = `d3:bar${list2}e`

    const updatePrimitives = (list) => {
      const strings = {}
      const strIds = [...list.matchAll(/[1-9]:/g)]
      const replaces = []
      strIds.forEach((item) => {
        const len = item[0].split(':')[0]
        strings[item.index] = list.substr(item.index + item[0].length, +len)
        const key = list.substr(item.index, item[0].length + +len)
        const value = list.substr(item.index + item[0].length, +len)
        replaces.push({ key, value })
      })
      replaces.forEach((item, key) => {
        list = list.replace(item.key, `_${key}&`)
      })

      const numberIds = [...list.matchAll(/i-?[0-9]\d+e/g)]
      numberIds.forEach((item) => {
        replaces.push({ key: item[0], value: item[0].match(/-?[0-9]\d/g)[0] })
      })
      replaces.forEach((item, key) => {
        list = list.replace(item.key, `_${key}&`)
      })
      return list
    }

    // console.dir('strings')
    // console.dir(list)
    // console.dir(updateSets(list))
    console.dir(dictList)
    console.dir(updateSets(updatePrimitives(dictList)))
    console.dir(dictDict)
    console.dir(updateSets(updatePrimitives(dictDict)))

    // console.log('e:', indices('e', str))
    // console.log('I:', indices('I', str))
    // console.log('d:', indices('d', str))

    return
    const liste = 'I4:spami-45eI4:bookee'
    // const list2 = 'Ii-45eI4:bookee'
    // const dict = 'd3:bar4:spame'
    // const dictDict = `d3:bar${dict}e`
    // const dictList = `d3:bar${list2}e`
    // console.dir(Translator.convert(list))
    console.dir(Translator.convert(dictList))
    // console.dir(Translator.convert(dictDict))
    // console.dir(Translator.convert(`I${dictE}${dictE}e`))
    // console.dir(Translator.convert(`d3:bar4:spam3:foo${listE}e`))
    /* expect(Translator.convert('d3:bar4:spamI4:spami-45eI4:bookeee')).toEqual({
      bar: 'spam',
      foo: 42,
    }) */
  })

  // test('is translating complex list', () => {
  //   expect(Translator.convert('d3:bar4:spam3:fooi42ee')).toEqual({
  //     bar: 'spam',
  //     foo: 42,
  //   })
  // })
})
