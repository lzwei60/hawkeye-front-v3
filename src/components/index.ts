import VdSvgIcon from '@/components/svgIcon/index'

import type { App } from 'vue'

const components = [VdSvgIcon]

export default function install(app: App<Element>) {
  components.forEach((component, index) => {
    const componentName = component.name || `Component${index}`
    app.component(componentName, component)
  })
}
