import {
  add,
  GDictionary, // eslint-disable-line no-unused-vars
  linkById
} from '@/utils/structure'

export interface GNodeSource {
  name: string
  alt?: string
  links: number[]
  group: number
}

export interface GNodeSourceDictionary {
  [id: string]: GNodeSource
}

export function addAll (dic: GDictionary<GNodeSource>, sources: GNodeSourceDictionary) {
  for (const [id, data] of Object.entries(sources)) {
    add(dic, id.toString(), data)
  }
}

export function linkAll (dic: GDictionary<GNodeSource>) {
  for (const node of Object.values(dic)) {
    for (const linkId of node.data.links) {
      linkById(dic, node, linkId.toString())
    }
  }
}

export function initialize (sources: GNodeSourceDictionary): GDictionary<GNodeSource> {
  const dic = {}

  addAll(dic, sources)
  linkAll(dic)

  return dic
}
