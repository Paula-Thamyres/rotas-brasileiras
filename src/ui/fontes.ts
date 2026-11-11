const PREFIXO_WWW = /^www\./

export function nomeDoSite(endereco: string): string | null {
  try {
    const { protocol, hostname } = new URL(endereco)

    if (protocol !== 'https:' && protocol !== 'http:') return null

    return hostname.replace(PREFIXO_WWW, '') || null
  } catch {
    return null
  }
}
