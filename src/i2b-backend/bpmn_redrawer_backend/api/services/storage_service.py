import numpy as np
import cv2 as cv2

def get_ocr_image(image: np.ndarray):
    """Service that reads and returns an image suitable for an OCR task, given its ndarray

    Parameters
    ----------
    image_path: str
        The path where to read the image

    Returns
    -------
    ndarray
        The image for the Object/KeyPoints detection
    """

    if image is not None and image.shape[2] == 4:
        trans_mask = image[:, :, 3] == 0
        image[trans_mask] = [255, 255, 255, 255]
        image = (
            image.astype(np.uint16)
            + 255
            - np.repeat(np.expand_dims(image[:, :, 3], 2), 4, axis=2)
        )
        image = np.ndarray.clip(image, 0, 255)
        image = image[:, :, [0, 1, 2]]
        image = np.ascontiguousarray(image, dtype=np.uint8)
    return image

def get_ocr_and_predict_images(image_bytes: bytes):
    """Service that returns the images for the OCR and Object/KeyPoints detection tasks.

    Parameters
    ----------
    image_bytes: bytes
        user uploaded image bytes

    Returns
    -------
    tuple
        The two images for OCR and predictions

    """
    # Convert bytes to numpy array
    image_array = np.asarray(bytearray(image_bytes), dtype=np.uint8)
    
    # Decode the array to an image
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    ocr_img = get_ocr_image(image)
    predict_img = image

    return ocr_img, predict_img
