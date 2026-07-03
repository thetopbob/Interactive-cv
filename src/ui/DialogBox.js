export default class DialogBox {
  constructor() {
    this.overlay = document.getElementById("dialog-overlay");
    this.npcEl = document.getElementById("dialog-npc");
    this.titleEl = document.getElementById("dialog-title");
    this.bodyEl = document.getElementById("dialog-body");
    this.closeBtn = document.getElementById("dialog-close");

    this._open = false;

    const SCROLL_STEP = 60;

    this.closeBtn.addEventListener("click", () => this.close());
    document.addEventListener("keydown", (e) => {
      if (!this._open) return;

      if (e.key === "Escape") {
        this.close();
        return;
      }

      if (["ArrowUp", "ArrowDown", "w", "s", "W", "S"].includes(e.key)) {
        e.preventDefault();
        const direction =
          e.key === "ArrowUp" || e.key === "w" || e.key === "W" ? -1 : 1;
        this.bodyEl.scrollTop += direction * SCROLL_STEP;
      }
    });
  }

  open(npcName, title, html) {
    this.npcEl.textContent = npcName;
    this.titleEl.textContent = title;
    this.bodyEl.innerHTML = html;
    this.overlay.classList.remove("hidden");
    this._open = true;
  }

  close() {
    this.overlay.classList.add("hidden");
    this._open = false;
  }

  isOpen() {
    return this._open;
  }
}
