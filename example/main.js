import { default as render } from '../src/renders/dom/circle.js'
import { createWithProto, moveTo, resize } from '../src/circle/index.js'

const main = function () {
  const root = document.querySelector('#field')

  const proto = {
    attrs: {
      stroke: 'red',
      fill: 'azure'
    }
  }

  const getCircle = createWithProto(proto, {})
  const getBig = getCircle(100)
  const getSmall = getCircle(50)

  const big = getBig(0, 0)
  const small = getSmall(0, 0)

  root.appendChild(render(big))
  root.appendChild(render(small))
  root.appendChild(render(moveTo(big, 200, 200)))
  root.appendChild(render(moveTo(resize(small, 70), 300, 300)))
}

main()
