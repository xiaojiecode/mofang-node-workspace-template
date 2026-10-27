import source from '../../assets/platforms/1688.svg'
import { platformImage } from '../platform-image'
import type { IconProps } from '../../components/icons'

/** 1688 的静态按需入口，只打包本平台的优化 SVG。 */
export function alibaba1688Icon(props: IconProps = {}) {
    return platformImage(source, '1688', props)
}
