var getScriptPromisify = (src) => {
  return new Promise((resolve) => {
    $.getScript(src, resolve);
  });
};

var parseMetadata = metadata => {
  const { mainStructureMembers: measuresMap } = metadata;
  const measures = [];
  const measures2 = [];
  for (const key in measuresMap) {
    const measure = measuresMap[key];
    
    
    if (measure.feed === 'measures') {
      measures.push({ key, ...measure });
    } else if (measure.feed === 'measures2') {
      measures2.push({ key, ...measure });
    }
  }
  return { measures, measures2, measuresMap };
};

(function () {
  
  const template = document.createElement('template');
  template.innerHTML = `
   <style>
    @import url('https://fonts.googleapis.com/css2?family=Asap:ital,wght@0,100..900;1,100..900&display=swap');

    .container {
        width: 100%;
        height: 100%;
        padding: 0px;
        display: flex;
        justify-content: space-between;
        border-radius: 8px;
        font-family: "Asap", sans-serif;
        font-optical-sizing: auto;
        box-shadow: 2px 2px 4px 0px gray;
        background-color: white;
    }

    .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 10px;
        /* Añade espacio alrededor del contenedor */
        box-sizing: border-box;
    }

    .resultado{
        font-size: 156.25%; /* 25px convertido a porcentaje */
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .kpi-icon {
        width: 80px;
        height: 80px;
        color: #fff;
        align-items: center;
    }

    .details {
        padding-left: 10px;
        padding-top: 10px;
        padding-right: 10px;
        width: 100%;
    }

    .informacion {
        color: #9AB1E3;
        font-size: 56.25%; /* 9px convertido a porcentaje */
        font-weight: bold;
        display:none;
    }

    span {
        color: #8CB222;
        font-weight: lighter;
        font-size: 43.75%; /* 7px convertido a porcentaje */
    }

    .title {
        font-size: 68.75%; /* 11px convertido a porcentaje */
        color: #000;
        font-weight: bold;
        margin-top: 15px;
    }

    .subttitulo {
        font-size: 56.25%; /* 9px convertido a porcentaje */
        color: #a79c9c;
        font-weight: bold;
        margin: 0;
    }

    .value {
        color: #333;
        margin-top: 5px;
        font-size: 125%; /* 20px convertido a porcentaje */
    }

    .icono{
        width: 100%;
        height: 100%;
    }  
    .seccionReal{
        color: #a79c9c;
        font-size: 87.5%; /* 14px convertido a porcentaje */
        font-weight: bold;
        margin-top: 0px;
        margin-bottom: 5px;
    }
    .real{
        display: none;
        margin-top: 0px;
        font-size: 156.25%; /* 25px convertido a porcentaje */
        margin-bottom: 15px;
    }
    #valor{
        margin-top: 0px;
        font-size: 125%; /* 20px convertido a porcentaje */
        margin-bottom: 15px;
    }
    .subtitle{
        font-size: 87.5%; /* 14px convertido a porcentaje */
    }

    .cont-icono {
        background-color: #0064A9;
        width: 15%;
        align-content: center;
        align-items: center;
        padding: 20px;
        display: flex;
        flex-direction: center;
        -ms-flex-align: center;
        border-radius: 8px 0 0 8px;
    }
</style>



<div class="wrapper">

    <div class="container">
        <div class="cont-icono">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chart-infographic" width="64"
                height="64" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M7 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                <path d="M7 3v4h4" />
                <path d="M9 17l0 4" />
                <path d="M17 14l0 7" />
                <path d="M13 13l0 8" />
                <path d="M21 12l0 9" />
            </svg>
        </div>
        <div class="details">
            <h1 class="title"></h1>
            <p class="resultado" id="resultado"></p>
            <p class="subtitle"></p>
            <p class="real"></p>
            <div id="valor">75.45</div>
            <p class="seccionReal">Real</p>
            <div class="value">75.45</div>
            <p class="informacion"></p>
        </div>
    </div>
</div>
  `;

  class Main extends HTMLElement {
    constructor() {
      super();

      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      
      this._root = this._shadowRoot.querySelector('.container');
      this._titleElement = this._shadowRoot.querySelector('.title');
      this._subtitleElement = this._shadowRoot.querySelector('.subtitle');
      this._informationElement = this._shadowRoot.querySelector('.informacion');
      this._realElement = this._shadowRoot.querySelector('.real');
      this._valueElement = this._shadowRoot.querySelector('.value');
      this._resultadoElement = this._shadowRoot.getElementById('resultado');
      this._props = {};
      this._setupObserver();
    }

    static get observedAttributes() {
      return ['title', 'subtitle', 'information', 'real','color'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      console.log("esta cambiando ", name, " por ", newValue);
      if (name === 'title' && newValue !== oldValue) {
        this._titleElement.textContent = newValue;
      } else if (name === 'subtitle' && newValue !== oldValue) {
        this._subtitleElement.textContent = newValue;
      } else if (name === 'information' && newValue !== oldValue) {
        this._informationElement.innerHTML = newValue;
      } else if (name === 'real' && newValue !== oldValue){
        this._realElement.textContent = newValue;
        this.cuenta();
      } else if (name === 'color' && newValue !== oldValue){
        this._resultadoElement.style.color = newValue
      }
    }

    connectedCallback() {
      if (this.hasAttribute('title')) {
        this._titleElement.textContent = this.getAttribute('title');
      }
      if (this.hasAttribute('subtitle')) {
        this._subtitleElement.textContent= this.getAttribute('subtitle');
      }
      if (this.hasAttribute('informacion')) {
        this._informationElement.innerHTML = this.getAttribute('informacion');
      }
      if (this.hasAttribute('real')) {
        this._realElement.textContent = this.getAttribute('real');
      }
      if (this.hasAttribute('color')) {
        this._resultadoElement.style.color = this.getAttribute('color');
      }
    }

    onCustomWidgetAfterUpdate(changedProps) {
      if (changedProps['title']) {
        this._titleElement.textContent = changedProps['title'];
      }
      if (changedProps['subtitle']) {
        this._subtitleElement.textContent = changedProps['subtitle'];
      }
      if (changedProps['information']) {
        this._informationElement.innerHTML = changedProps['information'];
      }
      if (changedProps['real']) {
        this._realElement.textContent = changedProps['real'];
        this.cuenta();
      }
      if (changedProps['color']) {
        console.log("llega el changedprops ",changedProps['color']);
        this._resultadoElement.style.color = changedProps['color'];
      }
      this.render();
    }

    setTitle(newTitle) {
      this.setAttribute('title', newTitle);
    }

    setSubtitle(newSubtitle) {
      this.setAttribute('subtitle', newSubtitle);
    }

    setInformation(newInformation) {
      this.setAttribute('information', newInformation);
    }
    setReal(newReal) {
      this.setAttribute('real', newReal);
    }
    setResultadoColor(newColor) {
      console.log("llega el newcolor ",newColor);
      this.setAttribute('color', newColor);
    }

    onCustomWidgetResize(width, height) {
      this.render();
    }

    cuenta() {
      const valueNumber = parseFloat(this._valueElement.textContent);
      const realNumber = parseFloat(this._realElement.textContent);
      const sum = (valueNumber * 100) / realNumber;
      const redondearSum = sum.toFixed(1);
      const resultadoElement = this._shadowRoot.querySelector('.resultado');
      resultadoElement.textContent = `${redondearSum}%`;
    }

    _setupObserver() {
      const observer = new MutationObserver((mutationsList) => {
        for(const mutation of mutationsList) {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            console.log('El contenido ha cambiado:', this._valueElement.textContent);
            
            this.cuenta(); 
          }
        }
      });

      
      observer.observe(this._valueElement, { childList: true, characterData: true, subtree: true });
    }

    

    async render() {
      const dataBinding = this.dataBinding;
      if (!dataBinding || dataBinding.state !== 'success') { return; }
    
      await getScriptPromisify('https://cdn.staticfile.org/echarts/5.0.0/echarts.min.js');
    
      const { data, metadata } = dataBinding;
      const { measures, measures2 } = parseMetadata(metadata);
    
      
      if (measures.length === 0) return;
    
      const measureKey = measures[0].key;
      let value = data.length > 0 ? data[0][measureKey].raw : 0;
    
      value = parseFloat(value).toFixed(2);  
      this._shadowRoot.querySelector('.value').textContent = `${value} `;
    
      const measureKey2 = measures[1].key;  
      let realValue = data.length > 0 ? data[0][measureKey2].raw : 0;
      
      realValue = parseFloat(realValue).toFixed(2);  
      this._shadowRoot.getElementById('valor').textContent = `${realValue} `;
      console.log("valor ", realValue);

    
      this.cuenta();  
    }
  }

  customElements.define('ejemplo-kpi', Main);
})();
