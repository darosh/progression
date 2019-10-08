import {
  getRoots,
  getLeafs,
  getParentLinks,
  getChildLinks,
  getSerializedLinks,
  sortLinks,
  floodDepth,
  getMaxDepth,
  removeNode,
  countNodes,
  mergeNodes,
  getParents,
  getChildren,
  toList
} from '../../src/utils/structure'

import {
  GNodeSourceDictionary, // eslint-disable-line no-unused-vars
  initialize
} from '../../src/utils/structure-chord'

import {
  removeBass,
  groupByNameAlt,
  toBeGrouped,
  mergeGroups,
  joinAllNodes
} from '@/utils/structure-chord-ops'

import data from '../../src/data/major'
import minor from '../../src/data/minor'

const simpleChain = {
  1: { name: 1, links: [] },
  2: { name: 2, links: [1] },
  3: { name: 3, links: [2] }
}

const simpleTree = {
  1: { name: 1, links: [] },
  2: { name: 2, links: [1] },
  3: { name: 3, links: [1] }
}

const simpleMerge = {
  1: { name: 1, links: [] },
  2: { name: 2, links: [1] },
  3: { name: 3, links: [1] },
  4: { name: 4, links: [2, 3] },
  5: { name: 5, links: [3] }
}

const simpleBass = {
  1: { name: 'I', links: [] },
  2: { name: 'I/5', links: [1] }
}

describe('structure', () => {
  it('initialize', () => {
    const dic = initialize(<GNodeSourceDictionary><unknown>data.map)
    expect(Object.keys(dic)).toEqual(Object.keys(data.map))
  })
  it('getRoots', () => {
    const dic = initialize(<GNodeSourceDictionary><unknown>data.map)
    const roots = getRoots(dic)
    expect(roots.length).toBe(1)
  })
  it('getLeafs', () => {
    const dic = initialize(<GNodeSourceDictionary><unknown>data.map)
    const leafs = getLeafs(dic)
    expect(leafs.length).toBeGreaterThan(1)
  })
  it('floodDepth', () => {
    const dic = initialize(<GNodeSourceDictionary><unknown>data.map)
    floodDepth(dic)
    const max = getMaxDepth(dic)
    expect(max).toBe(6)
  })
  it('getParentLinks', () => {
    const dic = initialize(<GNodeSourceDictionary><unknown>data.map)
    const parentLinks = getSerializedLinks(getParentLinks(dic))
    const childLinks = getSerializedLinks(getChildLinks(dic))

    sortLinks(parentLinks)
    sortLinks(childLinks)

    expect(parentLinks.length).toBe(childLinks.length)
    expect(parentLinks).toEqual(childLinks)
  })
  it('removeNode chain', () => {
    const dic = initialize(<GNodeSourceDictionary><unknown>simpleChain)

    removeNode(dic, dic[2])

    expect(countNodes(dic)).toBe(1)
  })
  it('removeNode tree', () => {
    const dic = initialize(<GNodeSourceDictionary><unknown>simpleTree)

    removeNode(dic, dic[2])

    expect(countNodes(dic)).toBe(2)
  })
  it('removeNode multi tree', () => {
    const dic = initialize(<GNodeSourceDictionary><unknown>simpleMerge)

    removeNode(dic, dic[3])

    expect(countNodes(dic)).toBe(3)
  })
  it('mergeNodes', () => {
    const dic = initialize(<GNodeSourceDictionary><unknown>simpleMerge)

    mergeNodes(dic, dic[2], dic[3])
    const links = getSerializedLinks(getParentLinks(dic))

    expect(countNodes(dic)).toBe(4)
    expect(links.length).toBe(3)
    expect(links).toEqual([
      { source: '2', target: '1' },
      { source: '4', target: '2' },
      { source: '5', target: '2' }
    ])
  })
  it('getParents', () => {
    const dic = initialize(<GNodeSourceDictionary><unknown>simpleMerge)
    const parents = getParents(dic[5])

    expect(parents.length).toBe(2)
  })
  it('getChildren', () => {
    const dic = initialize(<GNodeSourceDictionary><unknown>simpleMerge)
    const children = getChildren(dic[3])

    expect(children.length).toBe(2)
  })
  it('getChildren root', () => {
    const dic = initialize(<GNodeSourceDictionary><unknown>data.map)
    const children = getChildren(dic[1])

    expect(children.length).toBe(countNodes(dic) - 1)
  })
  it('removeBass', () => {
    const dic = initialize(<GNodeSourceDictionary><unknown>simpleBass)
    const nodes = removeBass(dic)

    expect(nodes.length).toBe(1)
  })
  it('groupByNameAlt', () => {
    const dic = initialize(<GNodeSourceDictionary><unknown>data.map)
    const mergingCandidates = groupByNameAlt(toList(dic))
    const mergingGroups = toBeGrouped(mergingCandidates)

    floodDepth(dic)
    mergeGroups(dic, mergingGroups)

    expect(countNodes(dic)).toBe(34)
  })
  it('joinAllNodes', () => {
    const dic = initialize(<GNodeSourceDictionary><unknown>minor.map)

    joinAllNodes(dic, minor.joints)
  })
})
