import os
import argparse
import numpy as np
from PIL import Image

def generate_synthetic_sar_chips(output_dir: str, num_samples: int = 40):
    """
    Generates synthetic dual-polarization (VV/VH) Sentinel-1 SAR chips
    with simulated capillary wave dampening (oil slicks) and look-alikes.
    Allows immediate dry-run training before downloading the 4 GB Zenodo archive.
    """
    train_img_dir = os.path.join(output_dir, "train", "images")
    train_mask_dir = os.path.join(output_dir, "train", "masks")
    test_img_dir = os.path.join(output_dir, "test", "images")
    test_mask_dir = os.path.join(output_dir, "test", "masks")

    for d in [train_img_dir, train_mask_dir, test_img_dir, test_mask_dir]:
        os.makedirs(d, exist_ok=True)

    print(f"Generating {num_samples} simulated Sentinel-1 dual-polarization SAR chips in {output_dir}...")

    for i in range(num_samples):
        is_test = (i % 5 == 0)
        img_dir = test_img_dir if is_test else train_img_dir
        mask_dir = test_mask_dir if is_test else train_mask_dir

        size = 256
        # Background rough ocean backscatter (Rayleigh-distributed speckle)
        vv = np.random.rayleigh(scale=45.0, size=(size, size)).astype(np.float32)
        vh = np.random.rayleigh(scale=20.0, size=(size, size)).astype(np.float32)
        mask = np.zeros((size, size), dtype=np.uint8)

        has_oil = (np.random.rand() > 0.3)
        if has_oil:
            # Elliptical / curvilinear slick dampening radar backscatter
            cx, cy = np.random.randint(60, 196, 2)
            rx, ry = np.random.randint(20, 60), np.random.randint(8, 25)
            angle = np.random.rand() * np.pi

            y, x = np.ogrid[:size, :size]
            cos_a, sin_a = np.cos(angle), np.sin(angle)
            xr = (x - cx) * cos_a + (y - cy) * sin_a
            yr = -(x - cx) * sin_a + (y - cy) * cos_a

            slick_region = ((xr / rx)**2 + (yr / ry)**2) <= 1.0
            # Dampen radar backscatter by 8-12 dB inside oil slick
            vv[slick_region] *= np.random.uniform(0.18, 0.35)
            vh[slick_region] *= np.random.uniform(0.15, 0.30)
            mask[slick_region] = 255

        # Save 2-channel VV+VH as RG (B=0) PNG
        vv_norm = np.clip(vv, 0, 255).astype(np.uint8)
        vh_norm = np.clip(vh, 0, 255).astype(np.uint8)
        b_channel = np.zeros_like(vv_norm)
        rgb = np.stack([vv_norm, vh_norm, b_channel], axis=-1)

        Image.fromarray(rgb).save(os.path.join(img_dir, f"sar_chip_{i:04d}.png"))
        Image.fromarray(mask).save(os.path.join(mask_dir, f"sar_chip_{i:04d}.png"))

    print("Sample dataset ready! Teammate can run training immediately.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--target-dir", default="ml/data", help="Output directory")
    args = parser.parse_args()
    generate_synthetic_sar_chips(args.target_dir)
