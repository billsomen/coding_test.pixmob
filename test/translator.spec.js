import TranslatorObject from '~/static/js/translator'
const Translator = new TranslatorObject()

describe('translator', () => {
  test('is translating number', () => {
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
    expect(Translator.convert('d3:bar4:spam3:fooi42ee')).toEqual([
      'spam',
      -45,
      ['book'],
    ])
  })
})
