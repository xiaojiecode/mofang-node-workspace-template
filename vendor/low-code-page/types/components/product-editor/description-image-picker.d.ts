import { type ImagePickerResult } from '../image-picker-dialog';
export type DescriptionImagePickerTarget = {
    kind: 'description-add';
} | {
    kind: 'description-replace';
    imageId: string;
};
export declare function DescriptionImagePicker({ open, target, description, onOpenChange, onConfirm }: {
    open: boolean;
    target: DescriptionImagePickerTarget | null;
    description: string;
    onOpenChange: (open: boolean) => void;
    onConfirm: (result: ImagePickerResult) => void | Promise<void>;
}): import("react/jsx-runtime").JSX.Element;
