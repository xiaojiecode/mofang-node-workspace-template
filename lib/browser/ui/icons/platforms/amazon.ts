import source from '../../assets/platforms/amazon.svg'
import { platformImage } from '../platform-image'
import type { IconProps } from '../../components/icons'

/** Amazon 的静态按需入口，只打包本平台的优化 SVG。 */
export function amazonIcon(props: IconProps = {}) {
    return platformImage(source, 'Amazon', props)
}
