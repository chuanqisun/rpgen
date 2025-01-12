export function defineWebTtsNode(tagName = "web-tts-node") {
  customElements.define(tagName, WebTtsNode);
}

export class WebTtsNode extends HTMLElement {
  private synth = window.speechSynthesis;
  private unspokenQueue: SpeechSynthesisUtterance[] = [];

  async queue(text: string, options?: { onStart?: () => void; onEnd?: () => void }) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2;
    const preferredVoicesURIs = [
      "Microsoft AvaMultilingual Online (Natural) - English (United States)",
      "Microsoft Sonia Online (Natural) - English (United Kingdom)",
      "Arthur",
    ];

    const availableVoices = this.synth.getVoices().filter((v) => preferredVoicesURIs.includes(v.voiceURI));
    const bestVoice = availableVoices.sort((a, b) => preferredVoicesURIs.indexOf(a.voiceURI) - preferredVoicesURIs.indexOf(b.voiceURI)).at(0);
    if (bestVoice) utterance.voice = bestVoice;

    if (this.synth.speaking) {
      this.unspokenQueue.push(utterance);
      utterance.onstart = () => options?.onStart?.();
      utterance.onend = () => options?.onEnd?.();
    } else {
      this.synth.speak(utterance);
      utterance.onstart = () => options?.onStart?.();
      utterance.onend = () => {
        options?.onEnd?.();
        this.speakUntilEmpty();
      };
    }
  }

  speakUntilEmpty() {
    if (this.unspokenQueue.length) {
      const utterance = this.unspokenQueue.shift()!;
      this.synth.speak(utterance);
      utterance.onend = () => this.speakUntilEmpty();
    }
  }

  clear() {
    this.unspokenQueue = [];
    this.synth.cancel();
  }
}
