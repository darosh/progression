import { sankey, sankeyRight, sankeyLinkHorizontal } from 'd3-sankey'
import link from '../utils/link'

export function draw ({ margin, graph, nodeSize, iterations, height, inversionPad, width, pads }) {
  const altRadius = Math.floor(nodeSize / 32) * 9
  const h = height - margin.bottom
  const nodePad = Math.floor(height / 240) * 6
  const w = width - margin.right - inversionPad * 1.5 - altRadius / 2

  const san = sankey()
    .nodeWidth(nodeSize)
    .nodePadding(nodePad)
    .iterations(iterations)
    .nodeAlign(sankeyRight)
    .extent([[margin.left + inversionPad, margin.top], [w, h]])

  san(graph)

  let path

  if (pads) {
    const { nodeWidth } = toPads(graph, w, h, margin, inversionPad, nodeSize)
    nodeSize = nodeWidth
    path = link()
  } else {
    path = sankeyLinkHorizontal()
  }

  adjustAlts({ altRadius, graph, nodeSize })

  return { altRadius, graph, path, nodeSize }
}

function adjustAlts ({ altRadius, graph, nodeSize }) {
  for (const node of graph.nodes) {
    const height = node.y1 - node.y0
    const vertical = (node.y1 - node.y0) > (node.alts.length * altRadius * 2 - altRadius)

    if (vertical) {
      node.altsTranslate = node.alts.map((alt, index) => [
        nodeSize,
        height - index * (((height) > (node.alts.length * altRadius * 2 - altRadius)) ? altRadius * 2 : (height + altRadius) / node.alts.length)
      ])
    } else {
      node.altsTranslate = node.alts.map((alt, index) => [
        index * altRadius * 2,
        height
      ])
    }
  }
}

function toPads ({ nodes, links }, width, height, { left, right, top, bottom }, inversionPad, nodeWidth) {
  const nw = nodeWidth = 2 * nodeWidth

  nodes = nodes.slice().sort((a, b) => (a.romanChord.step + a.romanChord.chordType).localeCompare(b.romanChord.step + b.romanChord.chordType))

  width -= inversionPad

  const cols = 6
  const rows = Math.ceil(nodes.length / cols)
  const w = (width - nw - left) / (cols - 1)
  const h = height / rows
  let i = 0

  links.forEach(l => (l.width = h / 2))

  for (const node of nodes) {
    const x = i % cols
    const y = Math.round((i - x) / cols)

    node.x0 = x * w + left + inversionPad
    node.x1 = node.x0 + nw

    node.y0 = y * h + top
    node.y1 = (y + 1) * h

    i++
  }

  return { nodeWidth }
}
