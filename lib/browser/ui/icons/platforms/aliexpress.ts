import source from '../../assets/platforms/aliexpress.svg'
import { platformImage } from '../platform-image'
import type { IconProps } from '../../components/icons'

/** AliExpress 的静态按需入口，只打包本平台的优化 SVG。 */
export function aliexpressIcon(props: IconProps = {}) {
    return platformImage(source, 'AliExpress', props)
}
