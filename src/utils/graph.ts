import { groupBy } from 'rambdax'

interface GraphData extends Array<any> {
  0: number
  1: string
  2: string
  3: number[]
  4: number
}

interface GraphNode {
  id: number
  name: string
  alt: string
  links: number[],
  group: number
  parents?: GraphNode[]
  children?: GraphNode[]
  color?: string
  removed?: boolean
  alts?: string[]
  active?: boolean
}

interface GraphLink {
  source: any
  target: any
  value: string
}

interface Dictionary<T> {[index: number]: T}

export function mapToDic<T> (map: GraphData[], value: (x: any) => T = x => x): Dictionary<T> {
  return map.reduce((acc, i: GraphData) => {
    acc[i[0]] = value(i)

    return acc
  }, <Dictionary<T>>{})
}

export function expandMap (map: GraphData[], shapes: any) {
  const dic = mapToDic(map, mapToObject)
  const values = Object.values(dic)

  values.forEach((obj: GraphNode) => {
    obj.active = false
    obj.alts = !obj.alt ? [] : obj.alt.split(',')
    obj.color = shapes[obj.group - 1][0]
    obj.parents = obj.parents || []
    obj.parents.push(...obj.links.map(id => {
      const parent = dic[id]
      parent.children = parent.children || []
      parent.children.push(obj)

      return parent
    }))
  })

  return { values, dic }
}

function mapToObject (data: GraphData): GraphNode {
  const [id, name, alt, links, group] = data

  return { removed: false, id, name, alt, links, group }
}

function removeObject (object: GraphNode, array: GraphNode[]) {
  const index = array.indexOf(object)

  if (index === -1) {
    return
  }

  object.removed = true
  array.splice(index, 1)

  if (object.children) {
    object.children.forEach(child => {
      if (child.parents) {
        removeObject(object, child.parents)
      }
    })
  }
  if (object.parents) {
    object.parents.forEach(parent => {
      if (parent.children) {
        removeObject(object, parent.children)
      }
    })
  }
}

export function removeSlashes (array: GraphNode[]) {
  for (let i = 0; i < array.length;) {
    const obj = array[i]

    if (obj.name.includes('/')) {
      removeObject(obj, array)
    } else {
      i++
    }
  }

  removeOrphans(array)

  return array
}

export function removeOrphans (array: GraphNode[]) {
  for (let i = 0; i < array.length;) {
    const obj = array[i]

    if (isOrphan(obj)) {
      removeObject(obj, array)
    } else {
      i++
    }
  }

  return array
}

function isOrphan (obj: GraphNode) {
  return !hasChildren(obj) && !hasParents(obj)
}

function hasChildren (obj: GraphNode) {
  return obj.children && obj.children.length > 0
}

function hasParents (obj: GraphNode) {
  return obj.parents && obj.parents.length > 0
}

export function toSankeyLinks (array: GraphNode[]) {
  return array.reduce((acc: GraphLink[], source: GraphNode) => {
    acc.push(...(source.parents || []).map(target => ({ source, target, value: '1' })))
    return acc
  }, [])
}

export function toSankey (nodes: GraphNode[]) {
  return {
    nodes,
    links: toSankeyLinks(nodes).filter((link) => !link.source.removed && !link.target.removed)
  }
}

export function groupByNameAlt (nodes: GraphNode[]) {
  return groupBy((node: GraphNode) => [node.name, node.alt].filter(x => x).join(','), nodes)
}

export function toBeGrouped (x: { [x: string]: GraphNode[] }) {
  return Object.values(x).filter(x => x.length > 1).filter(canMergeGroup)
}

export function canMergeGroup (array: GraphNode[]): boolean {
  const parents = {}

  for (const obj of array) {
    if (getParents(obj, parents)) {
      return false
    }
  }

  return true
}

function getParents (obj: GraphNode, parents: any): boolean {
  for (const parent of (obj.children || [])) {
    const id = parent.id

    if (parents[id]) {
      return true
    } else {
      parents[id] = true

      return getParents(parent, parents)
    }
  }

  return false
}

export function mergeGroups (groups: GraphNode[][], array: GraphNode[]) {
  groups.forEach(group => mergeGroup(group, array))
}

function mergeGroup (group: GraphNode[], array: GraphNode[]) {
  const root = group[0]

  for (let i = 1; i < group.length; i++) {
    const obj = group[i]
    removeObject(obj, array)

    root.children = root.children || []
    insertMissing(root.children, obj.children || [], root)
    root.parents = root.parents || []
    insertMissing(root.parents, obj.parents || [], root)
  }

  removeOrphans(array)
}

function insertMissing (to: GraphNode[], from: GraphNode[], root: GraphNode) {
  for (const obj of from) {
    if (!to.includes(obj) && (obj !== root)) {
      to.push(obj)
    }
  }
}

export function normalize (data: any, shapes: any) {
  if (data.joints) {
    const { dic, values } = expandMap(data.map, shapes)

    for (const joint of data.joints) {
      const primary = dic[joint[0]]

      for (let i = 1; i < joint.length; i++) {
        const joined = dic[joint[i]]
        values.splice(values.indexOf(joined), 1)

        for (const child of (joined.children || [])) {
          child.parents = child.parents || []
          redirect(joined, primary, child.parents)
        }

        for (const parent of (joined.parents || [])) {
          parent.children = parent.children || []
          redirect(joined, primary, parent.children)
        }
      }
    }

    return values
  } else {
    return expandMap(data, shapes).values
  }
}

function redirect (from: any, to: any, array: any[]) {
  array.splice(array.indexOf(from), 1, to)
}

export function activate (node: GraphNode, value: boolean) {
  node.active = value;
  (node.parents || []).forEach(n => { n.active = value });
  (<any>node).sourceLinks.forEach((n: any) => { n.active = value })
}
