import source from '../../assets/platforms/ebay.svg'
import { platformImage } from '../platform-image'
import type { IconProps } from '../../components/icons'

/** eBay 的静态按需入口，只打包本平台的优化 SVG。 */
export function ebayIcon(props: IconProps = {}) {
    return platformImage(source, 'eBay', props)
}
