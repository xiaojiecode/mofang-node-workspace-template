import source from '../../assets/platforms/temu.svg'
import { platformImage } from '../platform-image'
import type { IconProps } from '../../components/icons'

/** Temu 的静态按需入口，只打包本平台的优化 SVG。 */
export function temuIcon(props: IconProps = {}) {
    return platformImage(source, 'Temu', props)
}
