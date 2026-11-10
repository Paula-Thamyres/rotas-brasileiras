import { describe, expect, it } from 'vitest'
import { MENSAGENS_DE_RECUSA } from './mensagens'

describe('mensagens de recusa', () => {
  it('tem texto para todos os motivos', () => {
    for (const mensagem of Object.values(MENSAGENS_DE_RECUSA)) {
      expect(mensagem.trim()).not.toBe('')
    }
  })

  it('não repete a mesma mensagem para motivos diferentes', () => {
    const mensagens = Object.values(MENSAGENS_DE_RECUSA)

    expect(new Set(mensagens).size).toBe(mensagens.length)
  })
})
