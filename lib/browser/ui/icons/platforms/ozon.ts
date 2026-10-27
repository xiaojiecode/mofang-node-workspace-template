import source from '../../assets/platforms/ozon.svg'
import { platformImage } from '../platform-image'
import type { IconProps } from '../../components/icons'

/** Ozon 的静态按需入口，只打包本平台的优化 SVG。 */
export function ozonIcon(props: IconProps = {}) {
    return platformImage(source, 'Ozon', props)
}
