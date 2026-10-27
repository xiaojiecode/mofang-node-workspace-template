import source from '../../assets/platforms/americanas.svg'
import { platformImage } from '../platform-image'
import type { IconProps } from '../../components/icons'

/** Americanas 的静态按需入口，只打包本平台的优化 SVG。 */
export function americanasIcon(props: IconProps = {}) {
    return platformImage(source, 'Americanas', props)
}
