import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

@customElement('color-picker-hsla')
export class ColorPickerHSLA extends LitElement {
    @property({ type: String, reflect: true })
    color = '#ffffffff' // Default color in hex RGBA format

    // RGBA as the primary internal representation
    @state() red = 255
    @state() green = 0
    @state() blue = 0
    @state() alpha = 1

    // HSLA sliders
    @state() hue = 0
    @state() saturation = 100
    @state() lightness = 50

    private disableSnapping = false
    private enableWideSnapping = false
    private firstHueChange = true

    constructor() {
        super()
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
    }

    connectedCallback() {
        super.connectedCallback()
        window.addEventListener('keydown', this.handleKeyDown)
        window.addEventListener('keyup', this.handleKeyUp)
    }

    disconnectedCallback() {
        window.removeEventListener('keydown', this.handleKeyDown)
        window.removeEventListener('keyup', this.handleKeyUp)
        super.disconnectedCallback()
    }

    handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Meta' || e.key === 'Control') {
            this.disableSnapping = true
        } else if (e.key === 'Shift') {
            this.enableWideSnapping = true
        }
    }

    handleKeyUp(e: KeyboardEvent) {
        if (e.key === 'Meta' || e.key === 'Control') {
            this.disableSnapping = false
        }
        if (e.key === 'Shift') {
            this.enableWideSnapping = false
        }
    }

    updateColor(e: Event, color: 'hue' | 'saturation' | 'lightness' | 'alpha') {
        const target = e.target as HTMLInputElement
        let value = color === 'alpha' ? parseFloat(target.value) : parseInt(target.value, 10)

        if (!this.disableSnapping) {
            let stepSize = color === 'hue' ? 100 / 7 : color === 'alpha' ? 0.1 : 10
            stepSize *= this.enableWideSnapping ? 2 : 1
            const middle = new Number(target.max).valueOf() / 2
            let nearestSnapPoint = Math.round(value / stepSize) * stepSize
            if (Math.abs(middle - nearestSnapPoint) < stepSize / 1.66) {
                nearestSnapPoint = middle
            }
            if (Math.abs(value - nearestSnapPoint) < stepSize / 2) {
                value = nearestSnapPoint
                target.value = value.toString() // Visually update the slider
            }
            // const snapPoint = 50
            // const snapThreshold = 5
            // if (Math.abs(value - snapPoint) < snapThreshold) {
            //     value = snapPoint
            //     target.value = value.toString() // Visually update the slider
            // }
        }

        if (color === 'hue' && this.firstHueChange) {
            this.saturation = 100
            this.lightness = 50
            this.firstHueChange = false
        }

        this[color] = value
        this.convertHSLAToRGBA()
        this.updateCSSVariables()
    }

    updated(changedProperties: Map<string, any>) {
        if (changedProperties.has('color')) {
            this.updateColorFromHex(this.color)
        }
        this.updateCSSVariables()
    }

    // Display the color as a hex RGBA string
    get hexColor() {
        const r = this.red.toString(16).padStart(2, '0')
        const g = this.green.toString(16).padStart(2, '0')
        const b = this.blue.toString(16).padStart(2, '0')
        const a = Math.round(this.alpha * 255)
            .toString(16)
            .padStart(2, '0')
        return `#${r}${g}${b}${a}`
    }

    set hexColor(value: string) {
        this.color = value
        this.updateColorFromHex(value)
    }

    get adjustedLuminance() {
        return (0.299 * this.red + 0.587 * this.green + 0.114 * this.blue) * this.alpha
    }

    get contrastColor() {
        return this.adjustedLuminance > 128 ? 'black' : 'white'
    }

    get contrastColorRGBA() {
        return this.adjustedLuminance > 128 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'
    }

    updateCSSVariables() {
        this.style.setProperty('--current-color', `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`)
        this.style.setProperty('--contrast-color', this.contrastColor)
        this.style.setProperty('--contrast-color-rgba', this.contrastColorRGBA)
    }

    handleHexInput(e: Event) {
        this.hexColor = (e.target as HTMLInputElement).value
    }

    updateColorFromHex(hex: string) {
        const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i)
        if (match) {
            this.red = parseInt(match[1], 16)
            this.green = parseInt(match[2], 16)
            this.blue = parseInt(match[3], 16)
            this.alpha = match[4] ? parseInt(match[4], 16) / 255 : 1
            this.convertRGBAToHSLA()
        }
    }

    convertHSLAToRGBA() {
        const s = this.saturation / 100
        const l = this.lightness / 100
        const chroma = (1 - Math.abs(2 * l - 1)) * s
        const x = chroma * (1 - Math.abs(((this.hue / 60) % 2) - 1))
        const m = l - chroma / 2

        let [r, g, b] = [0, 0, 0]
        if (this.hue < 60) [r, g, b] = [chroma, x, 0]
        else if (this.hue < 120) [r, g, b] = [x, chroma, 0]
        else if (this.hue < 180) [r, g, b] = [0, chroma, x]
        else if (this.hue < 240) [r, g, b] = [0, x, chroma]
        else if (this.hue < 300) [r, g, b] = [x, 0, chroma]
        else [r, g, b] = [chroma, 0, x]

        this.red = Math.round((r + m) * 255)
        this.green = Math.round((g + m) * 255)
        this.blue = Math.round((b + m) * 255)
    }

    convertRGBAToHSLA() {
        const r = this.red / 255
        const g = this.green / 255
        const b = this.blue / 255
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const delta = max - min

        this.lightness = ((max + min) / 2) * 100

        if (delta !== 0) {
            this.saturation = (delta / (1 - Math.abs((2 * this.lightness) / 100 - 1))) * 100

            switch (max) {
                case r:
                    this.hue = (((g - b) / delta) % 6) * 60
                    break
                case g:
                    this.hue = ((b - r) / delta + 2) * 60
                    break
                case b:
                    this.hue = ((r - g) / delta + 4) * 60
                    break
            }
            if (this.hue < 0) this.hue += 360
        }
    }

    static styles = css`
        :host {
            width: 180px;
            height: 180px;
            background-color: black;
            border-radius: 4px;
            --slider-height: 10px;
        }
        :host(:hover) .sliders {
            opacity: 1;
        }
        .color-display {
            width: 100%;
            height: 100%;
            background-color: var(--current-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            border-radius: 4px;
            padding: 8px;
            box-sizing: border-box;
        }
        .sliders {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .hex-display {
            margin-top: auto;
            font-size: 16px;
            padding: 5px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .hex-display input {
            background-color: transparent;
            border: none;
            font-size: 20px;
            color: var(--contrast-color);
            width: 100%;
            text-align: center;
            outline: none;
        }
        input[type='range'] {
            -webkit-appearance: none;
            width: 100%;
            height: var(--slider-height);
            border-radius: 4px;
            outline: none;
            border: 1px solid var(--contrast-color-rgba);
        }
        input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 10px;
            height: 24px;
            border: 1px solid var(--contrast-color-rgba);
            cursor: pointer;
            border-radius: 4px;
        }
        .hue-slider input[type='range'] {
            background: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red);
        }
        .saturation-slider input[type='range'] {
            background: linear-gradient(to right, gray, var(--current-color));
        }
        .lightness-slider input[type='range'] {
            background: linear-gradient(to right, black, var(--current-color), white);
        }
        .alpha-slider input[type='range'] {
            background: linear-gradient(to right, transparent, var(--current-color));
        }
    `

    render() {
        return html`
            <div
                class="color-display"
                style="--current-color: rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})"
            >
                <div class="sliders">
                    <div class="slider-group hue-slider">
                        <input
                            type="range"
                            min="0"
                            max="360"
                            .value="${this.hue}"
                            step="1"
                            @input="${(e: Event) => this.updateColor(e, 'hue')}"
                        />
                    </div>
                    <div class="slider-group saturation-slider">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            .value="${this.saturation}"
                            @input="${(e: Event) => this.updateColor(e, 'saturation')}"
                        />
                    </div>
                    <div class="slider-group lightness-slider">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            .value="${this.lightness}"
                            @input="${(e: Event) => this.updateColor(e, 'lightness')}"
                        />
                    </div>
                    <div class="slider-group alpha-slider">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            .value="${this.alpha}"
                            @input="${(e: Event) => this.updateColor(e, 'alpha')}"
                        />
                    </div>
                </div>
                <div class="hex-display">
                    <input type="text" .value="${this.hexColor}" @input="${this.handleHexInput}" />
                </div>
            </div>
        `
    }
}
