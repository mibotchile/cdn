export class CustomScrollBar extends HTMLElement {
  container;
  constructor(containerElement) {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });

    this.targetElId = this.dataset.targetId;
    this.trackColor = this.dataset.trackColor || "#f2f2f2";
    this.trackWidth = this.dataset.trackWidth || "6px";
    this.thumbColor = this.dataset.thumbColor || "#c1c1c1";
    this.targetEl = document.querySelector(`#onbotgo-messageContainer`);

    const style = document.createElement("style");
    style.textContent = `
        .custom-scrollbar {
          width: ${this.trackWidth};
          height: 100%;
          position: absolute;
          top: 0;
          right: 0;
        }
  
        .custom-scrollbar__track {
          width: 100%;
          height: 100%;
          background-color: ${this.trackColor};
        }
  
        .custom-scrollbar__thumb {
          width: 100%;
          background-color: ${this.thumbColor};
          border-radius: ${this.trackWidth};
          position: absolute;
          top: 0;
          animation: top 0.25s ease-in;
  
        }
  
        .custom-scrollbar__thumb:hover {
          background-color: red;
        }
      `;
    this.shadowRoot.appendChild(style);

    if (!this.targetEl) {
      console.warn(
        `CustomScrollBar: target element with id "${this.targetElId}" not found`,
        this,
        this.dataset.targetId
      );
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.setTargetElCSS();
          this.setScrollThumbHeight();
        }
      });
    });

    observer.observe(this.targetEl);

    this.shadowRoot.innerHTML += `
        <div class="custom-scrollbar">
          <div class="custom-scrollbar__track">
            <div class="custom-scrollbar__thumb"></div>
          </div>
        </div>
      `;

    this.targetEl.addEventListener("scroll", () => {
      this.moveScrollThumb();
    });
  }

  moveScrollThumb() {
    const scrollBarThumb = this.shadowRoot.querySelector(
      ".custom-scrollbar__thumb"
    );
    const scrollBarTrackHeight = this.shadowRoot.querySelector(
      ".custom-scrollbar__track"
    ).offsetHeight;
    const scrollThumbTop =
      (this.targetEl.scrollTop / this.targetEl.scrollHeight) *
      scrollBarTrackHeight;
    scrollBarThumb.style.top = `${scrollThumbTop}px`;
  }

  setTargetElCSS() {
    this.targetEl.style.overflowY = "scroll";
    this.targetEl.style.position = "relative";
    this.targetEl.style["-ms-overflow-style"] = "none"; /* Firefox */
    this.targetEl.style.scrollbarWidth = "none"; /* Firefox */
  }

  setScrollThumbHeight() {
    // get the scroll bar element
    const scrollBarTrack = this.shadowRoot.querySelector(
      ".custom-scrollbar__track"
    );
    const scrollBarThumb = this.shadowRoot.querySelector(
      ".custom-scrollbar__thumb"
    );

    // get the scroll bar track height
    const scrollBarTrackHeight = scrollBarTrack.offsetHeight;

    // get the target element height
    const targetElHeight = this.targetEl.offsetHeight;

    // get the target element scroll height
    const targetElScrollHeight = this.targetEl.scrollHeight;

    // calculate the scroll thumb height
    const scrollThumbHeight =
      (targetElHeight / targetElScrollHeight) * scrollBarTrackHeight;

    // set the scroll thumb height
    scrollBarThumb.style.height = `${scrollThumbHeight}px`;

    let isDragging = false;
    let currentY;
    scrollBarThumb.addEventListener("mousedown", (e) => {
      isDragging = true;
      currentY = e.clientY;
      // prevent dragging hilights
      this.preventContentHighlight("remove");
    });
    document.addEventListener("mouseup", () => {
      isDragging = false;
      this.preventContentHighlight("add");
    });
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const deltaY = e.clientY - currentY;
      currentY = e.clientY;
      this.targetEl.scrollTop +=
        deltaY * (targetElScrollHeight / scrollBarTrackHeight);
    });
  }

  preventContentHighlight(action) {
    if (action) {
      this.targetEl.classList.add("prevent-scroll");
    } else {
      this.targetEl.classList.add("prevent-scroll");
    }
  }
}
CustomScrollBar.tag = "onbotgo-customscrollbar";
