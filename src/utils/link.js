import { linkHorizontal } from 'd3-shape'

function horizontalSource (d) {
  const o = d.source.x0 > d.target.x0 ? d.source : d.target

  return [(o.x0 + o.x1) / 2, (o.y0 + o.y1) / 2]
}

function horizontalTarget (d) {
  const o = d.source.x0 > d.target.x0 ? d.target : d.source

  return [(o.x0 + o.x1) / 2, (o.y1 + o.y0) / 2]
}

export default function () {
  return linkHorizontal()
    .source(horizontalSource)
    .target(horizontalTarget)
}
