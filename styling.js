(function () {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      #root label {
        height: 24px;
        display: block;
        font-size: .875rem;
        color: #999;
      }
      #root label:not(:first-child) {
        margin-top: 16px;
      }
      #root input {
        font-size: 14px;
        width: 100%;
        box-sizing: border-box;
      }
    </style>
    <div id="root">
      <label for="title-input">Título del KPI</label>
      <input type="text" id="title-input" placeholder="Título del KPI"/>
      <label for="subtitle-input">Subtítulo del KPI</label>
      <input type="text" id="subtitle-input" placeholder="Subtítulo del KPI"/>
      <label for="information-input">Información del KPI</label>
      <input type="text" id="information-input" placeholder="Información del KPI"/>
      <label for="real-input">Real</label>
      <input type="text" id="real-input" placeholder="0"/>
      <label for="color-input">Color del cumplimiento</label>
      <input type="color" id="color-input">
    </div>
  `;

  class Styling extends HTMLElement {
    constructor () {
      super();

      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback(){
      this.shadowRoot.getElementById('title-input').addEventListener('input', this.updateTitle.bind(this));
      this.shadowRoot.getElementById('subtitle-input').addEventListener('input', this.updateSubtitle.bind(this));
      this.shadowRoot.getElementById('information-input').addEventListener('input', this.updateInformation.bind(this));
      this.shadowRoot.getElementById('real-input').addEventListener('input', this.updateReal.bind(this));
      this.shadowRoot.getElementById('color-input').addEventListener('input', this.updateColor.bind(this));
    }

    updateTitle(event){
      const title = event.target.value;
      this.dispatchEvent(new CustomEvent('propertiesChanged',{
        detail:{
          properties:{
            title: title
          }
        }
      }))
    }

    updateSubtitle(event){
      const subtitle = event.target.value;
      this.dispatchEvent(new CustomEvent('propertiesChanged',{
        detail:{
          properties:{
            subtitle: subtitle
          }
        }
      }))
    }

    updateInformation(event){
      const information = event.target.value;
      this.dispatchEvent(new CustomEvent('propertiesChanged',{
        detail:{
          properties:{
            information: information
          }
        }
      }))
    }

    updateReal(event){
      const real = event.target.value;
      this.dispatchEvent(new CustomEvent('propertiesChanged',{
        detail:{
          properties:{
            real: real
          }
        }
      }))
    }
    updateColor(event){
      const color = event.target.value;
      this.dispatchEvent(new CustomEvent('propertiesChanged',{
        detail:{
          properties:{
            color: color
          }
        }
      }))
    }

    /*onCustomWidgetAfterUpdate (changedProps) {
      if (changedProps.title) {
        this._titleInput.value = changedProps.title;
      }
      if (changedProps.subtitle) {
        this._subtitleInput.value = changedProps.subtitle;
      }
      if (changedProps.information) {
        this._informationInput.value = changedProps.information;
      }
      if (changedProps.real) {
        this._realInput.value = changedProps.real;
      }
    }*/
  }

  customElements.define('com-sap-sac-exercise-username-styling', Styling);
})();
