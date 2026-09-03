# NAUTRACE — ML Training Guide for Teammate (NVIDIA RTX 3050 / Windows)

Welcome! You are leading the **Satellite SAR Oil Spill Detection & Machine Learning** component of NAUTRACE (SIH 26143).
This guide contains everything you need to train and evaluate the deep learning model on your Windows machine with an NVIDIA RTX 3050 GPU.

---

## 1. Quick Environment Setup

1. **Clone and Checkout Branch:**
   ```bash
   git clone https://github.com/Sarthak702-droid/Nautrace.git
   cd Nautrace
   git checkout dev
   ```

2. **Create Python Environment (Python 3.10 or 3.11 recommended):**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. **Install PyTorch with CUDA Support:**
   Check your CUDA version (`nvidia-smi` in terminal). For CUDA 12.1:
   ```bash
   pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
   ```
   Install required libraries:
   ```bash
   pip install -r ml/requirements_ml.txt
   ```

---

## 2. Dataset Preparation

We use the open **Zenodo Sentinel-1 SAR Oil Spill Dataset** (dual-polarization VV/VH imagery + pixel masks):
* **Part I (Training):** [https://zenodo.org/records/8346860](https://zenodo.org/records/8346860)
* **Part III (Test Benchmark):** [https://zenodo.org/records/13761290](https://zenodo.org/records/13761290)

To automatically download or create sample training chips for testing your pipeline, run:
```bash
python ml/download_dataset.py --target-dir ml/data
```

---

## 3. Training the Model on RTX 3050

Your RTX 3050 has 4GB or 6GB VRAM. We configured the training script to be **100% memory-safe**:
* `batch_size = 8`
* `fp16 = True` (NVIDIA Mixed Precision via `torch.cuda.amp.autocast`)
* Gradient accumulation steps = 2 (effective batch size = 16)
* Loss: `BCEWithLogitsLoss + DiceLoss` (handles severe class imbalance)

Run training:
```bash
python ml/train_sar_segmentation.py --epochs 25 --data-dir ml/data --output-dir ml/weights
```

During training, it will log IoU, Dice Score, and Loss for each epoch.
The best checkpoint will be saved to:
`ml/weights/oil_spill_model.pth`

---

## 4. Evaluation & Handover to Mac M1

Run test set evaluation to generate the IoU/Precision/Recall numbers for the jury:
```bash
python ml/evaluate_model.py --weights ml/weights/oil_spill_model.pth --test-dir ml/data/test
```

Once training finishes, commit your weights and evaluation report:
```bash
git add ml/weights/oil_spill_model.pth
git commit -m "feat(ml): trained SAR oil spill segmentation model on RTX 3050 (IoU: XX.X%)"
git push origin dev
```

The Mac M1 backend will immediately pick up this `.pth` file to perform real-time inference on new satellite images!
