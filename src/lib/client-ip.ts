/**
 * The visitor's address, as far as our own edge can vouch for it.
 *
 * 29.10.2026 (family security audit): the rate limits took the FIRST hop of
 * X-Forwarded-For. Cloudflare appends the visitor's address to whatever
 * X-Forwarded-For the visitor sent, and Traefik appends Cloudflare's, so the
 * first hop is whatever the caller wrote. A loop that sent a fresh value
 * each time (and a fresh `user`) got a fresh budget each time: unlimited
 * model calls on our key, from one machine.
 *
 * The chain is read from the right instead. Traefik trusts X-Forwarded-For
 * only from Cloudflare (traefik-global: forwardedHeaders.trustedIPs); from
 * anyone else it writes the connecting address itself. So walking left from
 * the end and skipping Cloudflare's own addresses lands on the address that
 * connected to Cloudflare (or to us directly) - a hop the caller cannot
 * forge. CF-Connecting-IP is not used: a caller who reaches the origin past
 * Cloudflare can set it to anything.
 */

import { BlockList, isIP } from 'node:net'

// https://www.cloudflare.com/ips/ (the same list traefik-global trusts).
const CLOUDFLARE = [
  '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22', '141.101.64.0/18', '108.162.192.0/18',
  '190.93.240.0/20', '188.114.96.0/20', '197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13',
  '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
  '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32', '2405:8100::/32', '2a06:98c0::/29', '2c0f:f248::/32',
]
// Docker's bridge networks: Traefik itself, when the app sees it as a hop.
const LOCAL = ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '127.0.0.0/8', '::1/128', 'fc00::/7']

function list(cidrs: string[]): BlockList {
  const b = new BlockList()
  for (const c of cidrs) {
    const [net, bits] = c.split('/')
    b.addSubnet(net!, Number(bits), net!.includes(':') ? 'ipv6' : 'ipv4')
  }
  return b
}
const EDGE = list([...CLOUDFLARE, ...LOCAL])

function inEdge(ip: string): boolean {
  const v = isIP(ip)
  return v ? EDGE.check(ip, v === 6 ? 'ipv6' : 'ipv4') : false
}

export function clientIpFrom(headers: Headers): string | null {
  const hops = (headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map((h) => h.trim())
    .filter((h) => isIP(h))
  for (let i = hops.length - 1; i >= 0; i--) {
    if (!inEdge(hops[i]!)) return hops[i]!
  }
  // Every hop is ours or Cloudflare's: the real-ip Traefik set, if it is not ours either.
  const real = headers.get('x-real-ip')?.trim()
  if (real && isIP(real) && !inEdge(real)) return real
  return hops[0] ?? null
}
