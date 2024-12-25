import numpy as np
import matplotlib.pyplot as plt
from nnfs.datasets import spiral_data




# plt.figure(figsize=(10, 6))
# plt.scatter(x, y)
# plt.title("Sine Function with Random Noise")
# plt.xlabel("x")
# plt.ylabel("y")
# plt.grid(True)
# plt.show()

def select_dataset(dataset):
    samples = 1000
    if dataset == 'spiral':
        X, y = spiral_data(samples, classes=3)
    elif dataset == 'sine':
        X = np.arange(samples).reshape(-1, 1) / samples
        y = np.sin(2 * np.pi * X).reshape(-1, 1)
    return X , y


