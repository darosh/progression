import { linkHorizontal } from 'd3-shape'

function horizontalSource (d) {
  let x
  let y
  let left
  let right


  if(d.source.x0 > d.target.x0) {
    left = d.target
    right = d.source
  } else {
    left = d.source
    right = d.target
  }

  if(left.x0 === right.x0) {
    y = left.y0 > right.y0 ? left.y0 : left.y1
    x = (left.x0 + left.x1) / 2
  } else {
    y = (left.y0 + left.y1) / 2
    x = left.x0 > right.x0 ? left.x0 : left.x1
  }

  return [x, y]
}

function horizontalTarget (d) {
  let x
  let y
  let left
  let right


  if(d.source.x0 > d.target.x0) {
    left = d.target
    right = d.source
  } else {
    left = d.source
    right = d.target
  }

  if(left.x0 === right.x0) {
    y = left.y0 < right.y0 ? right.y0 : right.y1
    x = (right.x0 + right.x1) / 2
  } else {
    y = (right.y0 + right.y1) / 2
    x = left.x0 < right.x0 ? right.x0 : right.x1
  }

  return [x, y]
}

export default function () {
  return linkHorizontal()
    .source(horizontalSource)
    .target(horizontalTarget)
}
