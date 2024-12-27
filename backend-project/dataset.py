import numpy as np
from nnfs.datasets import spiral_data

def select_dataset(dataset):
    samples = 1000
    
    if dataset == 'spiral':
        X, y = spiral_data(samples, classes=3)
        
    elif dataset == 'sine':
        X = np.arange(samples).reshape(-1, 1) / samples
        # Generate base sine wave
        y = np.sin(2 * np.pi * X).reshape(-1, 1)
        # Add random noise from normal distribution
        noise = np.random.normal(0, 0.11, (samples, 1))
        y += noise
        
    return X, y


