import source from '../../assets/platforms/lazada.svg'
import { platformImage } from '../platform-image'
import type { IconProps } from '../../components/icons'

/** Lazada 的静态按需入口，只打包本平台的优化 SVG。 */
export function lazadaIcon(props: IconProps = {}) {
    return platformImage(source, 'Lazada', props)
}
