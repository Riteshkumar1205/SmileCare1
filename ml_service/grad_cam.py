import numpy as np
import tensorflow as tf
import cv2
from tensorflow.keras import Model

def get_gradcam_heatmap(model, img_array, last_conv_layer_name=None):
    """
    Generate normalized heatmap (0..1) using Grad-CAM for a single image.
    img_array: (H,W,3) float32 scaled 0..1
    """
    x = np.expand_dims(img_array.astype(np.float32), axis=0)

    # find last conv layer if not provided
    if last_conv_layer_name is None:
        last_conv_layer_name = None
        for layer in reversed(model.layers):
            name = getattr(layer, "name", "")
            clsname = layer.__class__.__name__
            if "conv" in name.lower() or "Conv" in clsname:
                last_conv_layer_name = name
                break

    if last_conv_layer_name is None:
        raise ValueError("No convolutional layer found for Grad-CAM")

    last_conv_layer = model.get_layer(last_conv_layer_name)
    grad_model = Model([model.inputs], [last_conv_layer.output, model.output])

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(x)
        pred_index = tf.argmax(predictions[0])
        loss = predictions[:, pred_index]

    grads = tape.gradient(loss, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    conv_outputs = conv_outputs[0]

    heatmap = np.zeros(conv_outputs.shape[0:2], dtype=np.float32)
    # weighted sum
    for i in range(pooled_grads.shape[-1]):
        heatmap += pooled_grads[i].numpy() * conv_outputs[..., i].numpy()

    heatmap = np.maximum(heatmap, 0)
    max_val = np.max(heatmap) if np.max(heatmap) != 0 else 1e-7
    heatmap /= max_val

    heatmap = cv2.resize(heatmap, (img_array.shape[1], img_array.shape[0]))
    return heatmap
