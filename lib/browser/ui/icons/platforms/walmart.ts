import source from '../../assets/platforms/walmart.svg'
import { platformImage } from '../platform-image'
import type { IconProps } from '../../components/icons'

/** Walmart 的静态按需入口，只打包本平台的优化 SVG。 */
export function walmartIcon(props: IconProps = {}) {
    return platformImage(source, 'Walmart', props)
}
