import source from '../../assets/platforms/shein.svg'
import { platformImage } from '../platform-image'
import type { IconProps } from '../../components/icons'

/** SHEIN 的静态按需入口，只打包本平台的优化 SVG。 */
export function sheinIcon(props: IconProps = {}) {
    return platformImage(source, 'SHEIN', props)
}
