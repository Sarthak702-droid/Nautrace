import os
import argparse
import glob
import numpy as np
from PIL import Image
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

# --- ARCHITECTURE: U-Net with ResNet-style Blocks ---
class DoubleConv(nn.Module):
    def __init__(self, in_ch, out_ch):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(in_ch, out_ch, 3, padding=1, bias=False),
            nn.BatchNorm2d(out_ch),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_ch, out_ch, 3, padding=1, bias=False),
            nn.BatchNorm2d(out_ch),
            nn.ReLU(inplace=True),
        )
    def forward(self, x):
        return self.net(x)

class SarUNet(nn.Module):
    def __init__(self, in_channels=3, out_channels=1):
        super().__init__()
        self.inc = DoubleConv(in_channels, 32)
        self.down1 = nn.Sequential(nn.MaxPool2d(2), DoubleConv(32, 64))
        self.down2 = nn.Sequential(nn.MaxPool2d(2), DoubleConv(64, 128))
        self.down3 = nn.Sequential(nn.MaxPool2d(2), DoubleConv(128, 256))
        
        self.up1 = nn.ConvTranspose2d(256, 128, 2, stride=2)
        self.conv1 = DoubleConv(256, 128)
        self.up2 = nn.ConvTranspose2d(128, 64, 2, stride=2)
        self.conv2 = DoubleConv(128, 64)
        self.up3 = nn.ConvTranspose2d(64, 32, 2, stride=2)
        self.conv3 = DoubleConv(64, 32)
        self.outc = nn.Conv2d(32, out_channels, 1)

    def forward(self, x):
        x1 = self.inc(x)
        x2 = self.down1(x1)
        x3 = self.down2(x2)
        x4 = self.down3(x3)

        x = self.up1(x4)
        x = torch.cat([x, x3], dim=1)
        x = self.conv1(x)

        x = self.up2(x)
        x = torch.cat([x, x2], dim=1)
        x = self.conv2(x)

        x = self.up3(x)
        x = torch.cat([x, x1], dim=1)
        x = self.conv3(x)
        return self.outc(x)

# --- LOSS: Combined BCE + Dice Loss ---
class DiceBCELoss(nn.Module):
    def __init__(self, smooth=1.0):
        super().__init__()
        self.smooth = smooth
        self.bce = nn.BCEWithLogitsLoss()

    def forward(self, pred_logits, targets):
        bce_loss = self.bce(pred_logits, targets)
        probs = torch.sigmoid(pred_logits)
        intersection = (probs * targets).sum(dim=(2, 3))
        union = probs.sum(dim=(2, 3)) + targets.sum(dim=(2, 3))
        dice_loss = 1.0 - (2.0 * intersection + self.smooth) / (union + self.smooth)
        return bce_loss + dice_loss.mean()

# --- DATASET ---
class SarDataset(Dataset):
    def __init__(self, root_dir):
        self.img_files = sorted(glob.glob(os.path.join(root_dir, "images", "*.png")))
        self.mask_files = sorted(glob.glob(os.path.join(root_dir, "masks", "*.png")))

    def __len__(self):
        return len(self.img_files)

    def __getitem__(self, idx):
        img = Image.open(self.img_files[idx]).convert("RGB")
        mask = Image.open(self.mask_files[idx]).convert("L")

        img_arr = np.array(img, dtype=np.float32) / 255.0
        mask_arr = (np.array(mask, dtype=np.float32) > 127).astype(np.float32)

        # HWC -> CHW
        img_t = torch.from_numpy(img_arr).permute(2, 0, 1)
        mask_t = torch.from_numpy(mask_arr).unsqueeze(0)
        return img_t, mask_t

def train(args):
    # Device setup: CUDA for RTX 3050, MPS for Mac M1, CPU fallback
    if torch.cuda.is_available():
        device = torch.device("cuda")
        print(f"CUDA Active: Running on {torch.cuda.get_device_name(0)} (RTX 3050 Optimized)")
    elif torch.backends.mps.is_available():
        device = torch.device("mps")
        print("Apple Metal (MPS) Active: Running on Mac M1")
    else:
        device = torch.device("cpu")
        print("Running on CPU")

    train_dir = os.path.join(args.data_dir, "train")
    if not os.path.exists(train_dir):
        print("Train data not found! Generating sample chips first...")
        from download_dataset import generate_synthetic_sar_chips
        generate_synthetic_sar_chips(args.data_dir)

    dataset = SarDataset(train_dir)
    loader = DataLoader(dataset, batch_size=args.batch_size, shuffle=True, num_workers=2)

    model = SarUNet(in_channels=3, out_channels=1).to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    criterion = DiceBCELoss()
    scaler = torch.cuda.amp.GradScaler(enabled=(device.type == "cuda"))

    os.makedirs(args.output_dir, exist_ok=True)
    best_loss = float("inf")

    print(f"Starting training for {args.epochs} epochs with batch size {args.batch_size}...")

    for epoch in range(1, args.epochs + 1):
        model.train()
        running_loss = 0.0
        for imgs, masks in loader:
            imgs, masks = imgs.to(device), masks.to(device)
            optimizer.zero_grad()

            with torch.cuda.amp.autocast(enabled=(device.type == "cuda")):
                preds = model(imgs)
                loss = criterion(preds, masks)

            if device.type == "cuda":
                scaler.scale(loss).backward()
                scaler.step(optimizer)
                scaler.update()
            else:
                loss.backward()
                optimizer.step()

            running_loss += loss.item() * imgs.size(0)

        epoch_loss = running_loss / len(dataset)
        print(f"Epoch [{epoch}/{args.epochs}] — Loss: {epoch_loss:.4f}")

        if epoch_loss < best_loss:
            best_loss = epoch_loss
            save_path = os.path.join(args.output_dir, "oil_spill_model.pth")
            torch.save(model.state_dict(), save_path)
            print(f"  --> Saved new best checkpoint to {save_path}")

    print("Training complete! Deliverable ready for handover.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--epochs", type=int, default=15)
    parser.add_argument("--batch-size", type=int, default=8)
    parser.add_argument("--lr", type=float, default=1e-3)
    parser.add_argument("--data-dir", default="ml/data")
    parser.add_argument("--output-dir", default="ml/weights")
    args = parser.parse_args()
    train(args)
