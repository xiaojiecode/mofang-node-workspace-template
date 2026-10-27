import source from '../../assets/platforms/magalu.svg'
import { platformImage } from '../platform-image'
import type { IconProps } from '../../components/icons'

/** Magalu 的静态按需入口，只打包本平台的优化 SVG。 */
export function magaluIcon(props: IconProps = {}) {
    return platformImage(source, 'Magalu', props)
}
