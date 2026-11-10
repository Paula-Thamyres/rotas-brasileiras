import { describe, expect, it } from 'vitest'
import { motivoDeNomesInvalidos, TAMANHO_MAXIMO_DO_NOME } from './nomes'

describe('validação dos nomes da tela inicial', () => {
  it('aceita de 2 a 5 nomes diferentes', () => {
    expect(motivoDeNomesInvalidos(['Ana', 'Bia'])).toBeNull()
    expect(
      motivoDeNomesInvalidos(['Ana', 'Bia', 'Caio', 'Duda', 'Eli']),
    ).toBeNull()
  })

  it('recusa menos de 2 e mais de 5 jogadores', () => {
    expect(motivoDeNomesInvalidos(['Ana'])).not.toBeNull()
    expect(
      motivoDeNomesInvalidos(['A', 'B', 'C', 'D', 'E', 'F']),
    ).not.toBeNull()
  })

  it('recusa nome vazio ou só com espaços', () => {
    expect(motivoDeNomesInvalidos(['Ana', ''])).not.toBeNull()
    expect(motivoDeNomesInvalidos(['Ana', '   '])).not.toBeNull()
  })

  it('recusa nomes repetidos, ignorando maiúsculas e espaços', () => {
    expect(motivoDeNomesInvalidos(['Ana', ' ana '])).not.toBeNull()
  })

  it('recusa nome acima do tamanho máximo', () => {
    const longo = 'a'.repeat(TAMANHO_MAXIMO_DO_NOME + 1)

    expect(motivoDeNomesInvalidos(['Ana', longo])).not.toBeNull()
    expect(
      motivoDeNomesInvalidos(['Ana', 'a'.repeat(TAMANHO_MAXIMO_DO_NOME)]),
    ).toBeNull()
  })
})
