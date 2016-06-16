import { either } from './either-functor'

const unSafeShape = either((x) => typeof x === 'string')

export {
  unSafeShape
}
