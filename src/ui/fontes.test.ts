import { describe, expect, it } from 'vitest'
import { nomeDoSite } from './fontes'

describe('nomeDoSite', () => {
  it('devolve o domínio sem o www', () => {
    expect(nomeDoSite('https://www.uai.com.br/?p=142196')).toBe('uai.com.br')
  })

  it('mantém subdomínios que não são www', () => {
    expect(nomeDoSite('https://blog.blablacar.com.br/?p=4089')).toBe(
      'blog.blablacar.com.br',
    )
  })

  it('aceita http', () => {
    expect(nomeDoSite('http://exemplo.com.br/a')).toBe('exemplo.com.br')
  })

  it('devolve null para texto que não é endereço', () => {
    expect(nomeDoSite('Fonte')).toBeNull()
    expect(nomeDoSite('')).toBeNull()
  })

  it('devolve null para endereço que não é web', () => {
    expect(nomeDoSite('javascript:alert(1)')).toBeNull()
  })
})
