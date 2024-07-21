import { describe, expect, it } from 'vitest';
import { addViewer, renameViewer, removeViewer } from '../controllers/viewerController';

const firstViewer = {id: '1', userName: 'Terry', isBot: false};
const secondViewer = {id: '2', userName: 'Cindy', isBot: false};
const projectId = '123';

describe('Add viewer', () => {
  it('Add first viewer', () => {
    expect(addViewer(projectId, firstViewer)).toStrictEqual([firstViewer])
  })

  it('Add another viewer', () => {
    expect(addViewer(projectId, secondViewer)).toStrictEqual([firstViewer, secondViewer])
  })

  it('Change Terry nickname to Andy', () => {
    expect(renameViewer(projectId, {id: '1', newUsername: 'Andy', isBot: false}))
    .toStrictEqual({id: '1', userName: 'Andy', isBot: false})
  })

  it('Remove second viewer', () => {
    expect(removeViewer(secondViewer.id))
    .toStrictEqual([{id: '1', userName: 'Andy', isBot: false}])
  })
})
