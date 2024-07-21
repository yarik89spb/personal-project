import { describe, expect, it } from 'vitest';
import { useBot } from '../controllers/chatBot.js'

const chatBot = useBot('123');

describe('PorkoBot', () => {
  it('Awake sleeping bot', () => {
    expect(chatBot.spawn()).toBe('₍ᐢ･⚇･ᐢ₎ Porko bot 報道了')
  })

  it('Try to awake already active bot', () => {
    expect(chatBot.spawn()).toBe('')
  })

  it('First time start showing questions', () => {
    expect(chatBot.start()).toBe('開始了! 請仔細看上面的螢幕')
  })

  it('Stop showing questions', () => {
    expect(chatBot.stop()).toBe('會議暫停了。請稍後 ヾ(；ﾟ(OO)ﾟ)ﾉ')
  })

  it('Start showing questions again', () => {
    expect(chatBot.start()).toBe('繼續我們的會議，請看螢幕')
  })

  it('Read question note', () => {
    const note = 'test'
    expect(chatBot.readNote(note)).toBe(`主持人的備註：“${note}”`)
  })

  it('Read missing note', () => {
    let missingNote;
    expect(chatBot.readNote(missingNote)).toBe(undefined)
  })


  it('Deactivate bot'), () => {
    expect(chatbot.stop().toBe('會議暫停了。請稍後 ヾ(；ﾟ(OO)ﾟ)ﾉ'))
  }
})