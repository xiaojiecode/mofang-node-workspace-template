import source from '../../assets/platforms/shopee.svg'
import { platformImage } from '../platform-image'
import type { IconProps } from '../../components/icons'

/** Shopee 的静态按需入口，只打包本平台的优化 SVG。 */
export function shopeeIcon(props: IconProps = {}) {
    return platformImage(source, 'Shopee', props)
}
