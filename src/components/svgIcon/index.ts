import './index.scss'

export default defineComponent({
  name: 'VdSvgIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '20px'
    },
    height: {
      type: String,
      default: '20px'
    }
  },
  setup(props) {
    return () =>
      h(
        'svg',
        {
          style: `width: ${props.width};height: ${props.height}`,
          class: `svg-icon svg-external-icon ${props.className}`,
          'aria-hidden': 'true'
        },
        [h('use', { 'xlink:href': `#icon-${props.name}` })]
      )
  }
})
