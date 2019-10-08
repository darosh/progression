import { sankey, sankeyRight, sankeyLinkHorizontal } from 'd3-sankey'
import link from '../utils/link'

export function draw ({ margin, sanGraph: graph, nodeSize, iterations, height, inversionPad, width, pads }) {
  graph = { ...graph }
  const altRadius = Math.floor(nodeSize / 32) * 9
  const h = height - margin.bottom
  const nodePad = Math.floor(height / 240) * 6
  const w = width - margin.right - inversionPad * 1.5 - altRadius / 2

  let path

  if (pads) {
    const { nodeWidth } = toPads(graph, w, h, margin, inversionPad, nodeSize)
    nodeSize = nodeWidth
    path = link()
  } else {
    const san = sankey()
      .nodeWidth(nodeSize)
      .nodePadding(nodePad)
      .iterations(iterations)
      .nodeAlign(sankeyRight)
      .extent([[margin.left + inversionPad, margin.top], [w, h]])

    san(graph)
    path = sankeyLinkHorizontal()
  }

  adjustAlts({ altRadius, graph, nodeSize })

  return { altRadius, graph, path, nodeSize }
}

function adjustAlts ({ altRadius, graph, nodeSize }) {
  for (const node of graph.nodes) {
    const height = node.y1 - node.y0
    const vertical = (node.y1 - node.y0) > (node.extra.alts.length * altRadius * 2 - altRadius)

    if (vertical) {
      node.extra.altsTranslate = node.extra.alts.map((alt, index) => [
        nodeSize,
        height - index * (((height) > (node.extra.alts.length * altRadius * 2 - altRadius)) ? altRadius * 2 : (height + altRadius) / node.extra.alts.length)
      ])
    } else {
      node.extra.altsTranslate = node.extra.alts.map((alt, index) => [
        index * altRadius * 2,
        height
      ])
    }
  }
}

function toPads ({ nodes, links }, width, height, { left, right, top, bottom }, inversionPad, nodeWidth) {
  const nw = nodeWidth = 2 * nodeWidth

  nodes = nodes.slice().sort((a, b) => (a.extra.romanChord.step + a.extra.romanChord.chordType)
    .localeCompare(b.extra.romanChord.step + b.extra.romanChord.chordType))

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

    node.sourceLinks = []
    node.targetLinks = []
  }

  for (const link of links) {
    link.source.sourceLinks.push(link)
    link.target.targetLinks.push(link)
  }

  return { nodeWidth }
}
