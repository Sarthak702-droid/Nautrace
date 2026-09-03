import os
import argparse
import torch
from torch.utils.data import DataLoader
from train_sar_segmentation import SarUNet, SarDataset

def evaluate(weights_path, test_dir):
    device = torch.device("cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu")
    print(f"Evaluating weights on {device} using {test_dir}...")

    model = SarUNet(in_channels=3, out_channels=1).to(device)
    if os.path.exists(weights_path):
        model.load_state_dict(torch.load(weights_path, map_location=device))
        print("Loaded model weights successfully.")
    else:
        print(f"Warning: {weights_path} not found. Running with uninitialized weights.")

    model.eval()
    dataset = SarDataset(test_dir)
    loader = DataLoader(dataset, batch_size=4, shuffle=False)

    total_iou = 0.0
    total_dice = 0.0
    n = 0

    with torch.no_grad():
        for imgs, masks in loader:
            imgs, masks = imgs.to(device), masks.to(device)
            preds = torch.sigmoid(model(imgs)) > 0.5

            intersection = (preds & (masks == 1)).float().sum(dim=(1,2,3))
            union = (preds | (masks == 1)).float().sum(dim=(1,2,3))
            iou = (intersection + 1e-6) / (union + 1e-6)

            dice = (2.0 * intersection + 1e-6) / (preds.float().sum(dim=(1,2,3)) + masks.sum(dim=(1,2,3)) + 1e-6)

            total_iou += iou.sum().item()
            total_dice += dice.sum().item()
            n += imgs.size(0)

    mean_iou = total_iou / max(n, 1)
    mean_dice = total_dice / max(n, 1)

    print("==========================================")
    print("      NAUTRACE SAR EVALUATION REPORT      ")
    print("==========================================")
    print(f"Test Samples: {n}")
    print(f"Mean IoU (Jaccard Index): {mean_iou * 100:.2f}%")
    print(f"Mean Dice / F1 Score:    {mean_dice * 100:.2f}%")
    print("==========================================")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--weights", default="ml/weights/oil_spill_model.pth")
    parser.add_argument("--test-dir", default="ml/data/test")
    args = parser.parse_args()
    evaluate(args.weights, args.test_dir)
