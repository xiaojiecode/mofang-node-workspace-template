import type { ImagePickerRemoteItem } from '../../api/image-picker';
export declare function ImagePickerRemoteCard({ source, item, selected, onToggle }: {
    source: ImagePickerRemoteItem['source'];
    item: ImagePickerRemoteItem;
    selected: boolean;
    onToggle: (item: ImagePickerRemoteItem) => void;
}): import("react/jsx-runtime").JSX.Element;
