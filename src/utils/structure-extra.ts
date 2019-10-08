import {
  GDictionary, // eslint-disable-line no-unused-vars
  GNode, // eslint-disable-line no-unused-vars
  toList
} from '@/utils/structure'

import {
  GNodeSource // eslint-disable-line no-unused-vars
} from '@/utils/structure-chord'

interface GraphLink {
  source: any
  target: any
  value: number
}

interface GraphExtra {
  color: string
  radius: number
  alts: string[]
  altsTranslate?: number[][]
  active: boolean
}

export function extra ({ alt, group }: GNodeSource, shapes: any): GraphExtra {
  return {
    active: false,
    alts: !alt ? [] : alt.split(','),
    color: shapes[group][0],
    radius: shapes[group][4]
  }
}

export function mapExtra (dic: GDictionary<GNodeSource>, shapes: any) {
  return toList(dic).forEach((node) => { node.extra = extra(node.data, shapes) })
}

export function toSankeyLinks (array: GNode<GNodeSource>[]) {
  return array.reduce((acc: GraphLink[], source: GNode<GNodeSource>) => {
    acc.push(...(source.parents || []).map(target => ({
      source,
      target,
      value: Math.max(source.extra.alts.length, target.extra.alts.length, 5)
    })))
    return acc
  }, [])
}

export function toSankey (nodes: GNode<GNodeSource>[]) {
  return {
    nodes,
    links: toSankeyLinks(nodes)
  }
}

export function activate (node: GNode<GNodeSource>, value: boolean) {
  node.extra.active = value;
  (node.parents || []).forEach(n => { n.extra.active = value });
  (<any>node).sourceLinks.forEach((n: any) => { n.active = value })
}
