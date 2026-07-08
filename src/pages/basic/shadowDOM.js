//https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM

export default function ShadowDOM() {
  return (
    <>
      <p>创建 shadow DOM 结构</p>
      <popup-info
        img="https://mdn.github.io/web-components-examples/popup-info-box-external-stylesheet/img/alt.png"
        data-text="Your card validation code (CVC) is an extra security feature — it is the last 3 or 4 numbers on the back of your card."
      ></popup-info>
    </>
  );
}

(function () {
  class MyWebComponent extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" });

      // Create spans
      const wrapper = document.createElement("span");
      wrapper.setAttribute("class", "wrapper");
      const icon = document.createElement("span");
      icon.setAttribute("class", "icon");
      icon.setAttribute("tabindex", 0);
      const info = document.createElement("span");
      info.setAttribute("class", "info");

      setTimeout(() => {
        // Take attribute content and put it inside the info span
        const text = this.getAttribute("data-text");
        console.info("text:", text, "## 2:", this.getAttribute("data-text"));
        info.textContent = text;
      });

      // Insert icon
      const img = document.createElement("img");
      console.info(' this.hasAttribute("img"):', this.hasAttribute("img"));
      img.src = this.hasAttribute("img")
        ? this.getAttribute("img")
        : "https://mdn.github.io/web-components-examples/popup-info-box-external-stylesheet/img/alt.png";
      img.alt = this.hasAttribute("alt") ? this.getAttribute("alt") : "";
      icon.appendChild(img);

      let style = document.createElement("style");

      style.textContent = `
            .wrapper {
              position: relative;
              display:block
            }

            .info {
              font-size: 0.8rem;
              width: 200px;
              display: inline-block;
              border: 1px solid black;
              padding: 10px;
              background: white;
              border-radius: 10px;
              opacity: 0;
              transition: 0.6s all;
              position: absolute;
              bottom: 20px;
              left: 10px;
              z-index: 3;
            }

            img {
              width: 1.2rem;
            }

            .icon:hover + .info, .icon:focus + .info {
              opacity: 1;
            }`;
      // attach the created elements to the shadow DOM
      shadow.appendChild(style);
      shadow.appendChild(wrapper);
      wrapper.appendChild(icon);
      wrapper.appendChild(info);
    }
  }

  window.customElements.define("popup-info", MyWebComponent);
})();
