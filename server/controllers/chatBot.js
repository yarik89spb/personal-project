class PorkoBot {
  constructor(roomId) {
    this.roomId = roomId;
    this.#isSpawned = false;
    this.#isStarted = false;
  }

  #isSpawned;
  #isStarted;

  get isSpawned() {
    return this.#isSpawned;
  }

  set isSpawned(x) {
    this.#isSpawned = x;
  }

  get isStarted() {
    return this.#isStarted;
  }

  set isStarted(x) {
    this.#isStarted = x;
  }

  spawn(){
    if(!this.#isSpawned){
      const botMessage = '₍ᐢ･⚇･ᐢ₎ Porko bot 報道了';
      this.#isSpawned = true;
      return botMessage;
    }
  }

  start(){
    const botMessage = !this.#isStarted ? '開始了! 請仔細看上面的螢幕' : '繼續我們的會議，請看螢幕';
    this.#isStarted = true;
    return botMessage;
  }

  stop(){
    const botMessage = '會議暫停了。請稍後 ヾ(；ﾟ(OO)ﾟ)ﾉ'
    return botMessage;
  }

  readNote(text){
    if(text){
      const botMessage = `主持人的備註：“${text}”`
      return botMessage;
    }
  }
}

let bots= {};

export function useBot(roomId){
  if (!bots[roomId]) {
    bots[roomId] = new PorkoBot(roomId);
  }
  // Return distinct bot for the given project
  return bots[roomId];
}

export default useBot;