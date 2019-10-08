import { groupBy } from 'rambdax'
import {
  GNodeSource // eslint-disable-line no-unused-vars
} from '@/utils/structure-chord'

import {
  filter,
  GDictionary, getChildren, getNode, GNode, joinNodes, mergeNodes // eslint-disable-line no-unused-vars
} from '@/utils/structure'

export function removeBass (dic: GDictionary<GNodeSource>) {
  return filter(dic, (node) => !node.data.name.includes('/'))
}

export function groupByNameAlt (nodes: GNode<GNodeSource>[]) {
  return Object.values(groupBy((node: GNode<GNodeSource>) => [node.data.name, node.data.alt].filter(x => x).join(','), nodes)).filter(x => x.length > 1)
}

export function toBeGrouped (groups: GNode<GNodeSource>[][]) {
  return groups.filter(g => canMergeGroup(g))
}

export function canMergeGroup (group: GNode<GNodeSource>[]): boolean {
  if (group.length === 2) {
    return !(getChildren(group[0]).includes(group[1]) || getChildren(group[1]).includes(group[0]))
  } else if (group.reduce((acc, node) => acc + node.children.length, 0) === 0) {
    return true
  }

  return false
}

export function mergeGroups (dic: GDictionary<GNodeSource>, groups: GNode<GNodeSource>[][]) {
  groups.forEach(group => mergeGroup(dic, group))
}

export function mergeGroup (dic: GDictionary<GNodeSource>, group: GNode<GNodeSource>[]) {
  const maxDepth = Math.max(...group.map(({ depth }) => depth!))
  const primary = group.find(({ depth }) => depth === maxDepth)!

  for (const secondary of group) {
    if (secondary !== primary) {
      mergeNodes(dic, primary, secondary)
    }
  }
}

export function joinAllNodes (dic: GDictionary<GNodeSource>, joints: number[][]) {
  for (const [a, b] of joints) {
    joinNodes(dic, getNode(dic, a.toString()), getNode(dic, b.toString()))
    joinNodes(dic, getNode(dic, b.toString()), getNode(dic, a.toString()))
  }
}
