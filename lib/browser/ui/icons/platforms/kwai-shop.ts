import source from '../../assets/platforms/kwai-shop.svg'
import { platformImage } from '../platform-image'
import type { IconProps } from '../../components/icons'

/** Kwai Shop 的静态按需入口，只打包本平台的优化 SVG。 */
export function kwaiShopIcon(props: IconProps = {}) {
    return platformImage(source, 'Kwai Shop', props)
}
