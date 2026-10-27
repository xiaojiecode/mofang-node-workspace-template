import source from '../../assets/platforms/mercado.svg'
import { platformImage } from '../platform-image'
import type { IconProps } from '../../components/icons'

/** Mercado Libre 的静态按需入口，只打包本平台的优化 SVG。 */
export function mercadoLibreIcon(props: IconProps = {}) {
    return platformImage(source, 'Mercado Libre', props)
}
