export interface GNode<T> {
  id: string
  parents: GNode<T>[]
  children: GNode<T>[]
  depth?: number
  data: T
  extra?: any
}

export interface GDictionary<T> {
  [id: string]: GNode<T>
}

export type GList<T> = GNode<T>[]

export interface GLink<T> {
  source: GNode<T>
  target: GNode<T>
}

export interface GLinkId<T> {
  source: string
  target: string
}

export function toList<T> (dic: GDictionary<T>): GList<T> {
  return Object.values(dic)
}

export function setNode<T> (dic: GDictionary<T>, id: string, node: GNode<T>) {
  dic[id] = node
}

export function getNode<T> (dic: GDictionary<T>, id: string) {
  return dic[id]
}

export function delNode<T> (dic: GDictionary<T>, id: string) {
  delete dic[id]
}

export function countNodes<T> (dic: GDictionary<T>) {
  return toList(dic).length
}

export function add<T> (dic: GDictionary<T>, id: string, data: any) {
  setNode(dic, id, { id, parents: [], children: [], data })
}

export function insert<T> (dic: GDictionary<T>, node: GNode<T>) {
  setNode(dic, node.id, node)
}

export function link<T> (from: GNode<T>, to: GNode<T>) {
  from.parents.push(to)
  to.children.push(from)
}

export function linkUnique<T> (from: GNode<T>, to: GNode<T>) {
  if (!from.parents.includes(to)) {
    from.parents.push(to)
  }

  if (!to.children.includes(from)) {
    to.children.push(from)
  }
}

export function unlink<T> (from: GNode<T>, to: GNode<T>) {
  from.parents.splice(from.parents.indexOf(to), 1)
  to.children.splice(to.children.indexOf(from), 1)
}

export function linkById<T> (dic: GDictionary<T>, from: GNode<T>, to: string) {
  link(from, getNode(dic, to))
}

export function getRoots<T> (dic: GDictionary<T>) {
  return toList(dic).filter(({ parents }) => parents.length === 0)
}

export function getLeafs<T> (dic: GDictionary<T>) {
  return toList(dic).filter(({ children }) => children.length === 0)
}

export function getParentLinks<T> (dic: GDictionary<T>) {
  return toList(dic).reduce<GLink<T>[]>((acc, child) => {
    for (const parent of child.parents) {
      acc.push({ source: child, target: parent })
    }

    return acc
  }, [])
}

export function getChildLinks<T> (dic: GDictionary<T>) {
  return toList(dic).reduce<GLink<T>[]>((acc, parent) => {
    for (const child of parent.children) {
      acc.push({ source: child, target: parent })
    }

    return acc
  }, [])
}

export function getSerializedLinks<T> (links: GLink<T>[]) {
  return links.map(({ source, target }) => ({ source: source.id, target: target.id }))
}

export function sortLinks<T> (links: GLinkId<T>[]) {
  return links.sort((a, b) => getLinkId(a).localeCompare(getLinkId(b)))
}

export function getLinkId<T> ({ source, target }: GLinkId<T>) {
  return `${source}_${target}`
}

export function floodDepth<T> (dic: GDictionary<T>) {
  resetDepths(dic)
  getRoots(dic).forEach(floodDepthNode)
}

export function floodDepthNode<T> (node: GNode<T>, depth: number = 1) {
  if (!node.depth) {
    node.depth = depth
    depth++
    node.children.forEach((n) => floodDepthNode(n, depth))
  }
}

export function resetDepths<T> (dic: GDictionary<T>) {
  toList(dic).forEach(v => { v.depth = 0 })
}

export function getMaxDepth<T> (dic: GDictionary<T>) {
  return Math.max(...toList(dic).map(({ depth }) => depth!))
}

export function removeNode<T> (dic: GDictionary<T>, node: GNode<T>, deep = true) {
  delNode(dic, node.id)

  for (const parent of node.parents.slice()) {
    unlink(node, parent)
  }

  for (const child of node.children.slice()) {
    unlink(child, node)

    if (deep && (child.parents.length === 0)) {
      removeNode(dic, child)
    }
  }
}

export function mergeNodes<T> (dic: GDictionary<T>, primary: GNode<T>, secondary: GNode<T>, remove = true) {
  const parents = secondary.parents.slice()
  const children = secondary.children.slice()

  if (remove) {
    removeNode(dic, secondary, false)
  }

  for (const parent of parents) {
    linkUnique(primary, parent)
  }

  for (const child of children) {
    linkUnique(child, primary)

    if (remove && !getNode(dic, child.id)) {
      insert(dic, child)
    }
  }
}

export function joinNodes<T> (dic: GDictionary<T>, primary: GNode<T>, secondary: GNode<T>) {
  mergeNodes(dic, primary, secondary, false)
}

export function getParents<T> (node: GNode<T>): GNode<T>[] {
  return node.parents.reduce<GNode<T>[]>((acc, parent) => {
    return [...acc, ...node.parents, ...getParents(parent)]
  }, [])
}

export function getChildren<T> (node: GNode<T>): GNode<T>[] {
  return node.children.reduce<GNode<T>[]>((acc, child) => {
    acc = [...acc, ...node.children.filter(c => !acc.includes(c))]

    return [...acc, ...getChildren(child).filter(c => !acc.includes(c))]
  }, [])
}

export function filter<T> (dic: GDictionary<T>, fn: (node: GNode<T>) => boolean) {
  return toList(dic).filter((node: GNode<T>) => !fn(node) ? (removeNode(dic, node), false) : true)
}
