
import numpy as np
from nnfs.datasets import spiral_data
from dataset import select_dataset
import math

np.random.seed(0)

# Activation functions classes

class Activation_ReLU:
    def forward(self, inputs):
        self.inputs = inputs
        self.output = np.maximum(0, inputs)

    def backward(self, dvalues):
        self.dinputs = dvalues.copy()
        self.dinputs[self.inputs <= 0] = 0

class Activation_Tanh:
    def forward(self, inputs):
        """
        Forward pass for the Tanh activation function.
        Applies the Tanh function element-wise to the inputs.

        Formula: output = tanh(inputs) = (e^x - e^(-x)) / (e^x + e^(-x))
        """
        self.inputs = inputs
        self.output = np.tanh(inputs)  # Use NumPy's built-in Tanh

    def backward(self, dvalues):
        """
        Backward pass for the Tanh activation function.
        Derivative: 1 - output^2 (where output is Tanh's forward output)
        """
        self.dinputs = dvalues * (1 - self.output ** 2)


class Activation_Sigmoid:
    def forward(self, inputs):
        self.inputs = inputs
        self.output = 1 / (1 + np.exp(-inputs))
    
    def backward(self, dvalues):
        # Derivative of sigmoid: output * (1 - output)
        self.dinputs = dvalues * (self.output * (1 - self.output))

    

class Activation_Softmax:
    def forward(self, inputs):
        exp_values = np.exp(inputs - np.max(inputs, axis=1, keepdims=True))
        probabilities = exp_values / np.sum(exp_values, axis=1, keepdims=True)
        self.output = probabilities

    def backward(self, dvalues):
        # Create uninitialized array
        self.dinputs = np.empty_like(dvalues)
        # Iterate outputs and gradients
        for index, (single_output, single_dvalues) in enumerate(zip(self.output, dvalues)):
            # Flatten output array
            single_output = single_output.reshape(-1, 1)
            # Calculate Jacobian matrix of the output and store it
            jacobian_matrix = np.diagflat(single_output) - np.dot(single_output, single_output.T)
            # Calculate sample-wise gradient and store it
            self.dinputs[index] = np.dot(jacobian_matrix, single_dvalues)




class Layer_Dense:
    def __init__(self, n_inputs, n_neurons):
        self.weights = 0.10 * np.random.randn(n_inputs, n_neurons)  # Randomly assigned weights
        self.biases = np.zeros((1, n_neurons))  # 0 Bias

    def forward(self, inputs):
        self.inputs = inputs  # Save inputs for backpropagation
        self.output = np.dot(inputs, self.weights) + self.biases

    def backward(self, dvalues):
        # Gradients on parameters
        self.dweights = np.dot(self.inputs.T, dvalues)
        self.dbiases = np.sum(dvalues, axis=0, keepdims=True)
        # Gradient on values
        self.dinputs = np.dot(dvalues, self.weights.T)

# Loss 

class Loss:
    def calculate(self, output, y):
        sample_losses = self.forward(output, y)
        data_loss = np.mean(sample_losses)
        return data_loss

class Loss_MSE(Loss):
    def forward(self, y_pred, y_true):
        sample_losses = np.mean((y_true - y_pred)**2, axis=-1)
        return sample_losses

    def backward(self, dvalues, y_true):
        samples = len(dvalues)
        outputs = len(dvalues[0])
        
        self.dinputs = -2 * (y_true - dvalues) / outputs
        self.dinputs = self.dinputs / samples


class Loss_CategoricalCrossEntropy(Loss):
    def forward(self, y_pred, y_true):
        samples = len(y_pred)
        y_pred_clipped = np.clip(y_pred, 1e-7, 1 - 1e-7)  # Clip to avoid log(0)

        if len(y_true.shape) == 1:
            correct_confidences = y_pred_clipped[range(samples), y_true]
        elif len(y_true.shape) == 2:
            correct_confidences = np.sum(y_pred_clipped * y_true, axis=1)

        negative_log_likelihoods = -np.log(correct_confidences)
        return negative_log_likelihoods

    def backward(self, dvalues, y_true):
        samples = len(dvalues)
        labels = len(dvalues[0])

        if len(y_true.shape) == 1:
            y_true = np.eye(labels)[y_true]

        self.dinputs = -y_true / dvalues
        self.dinputs = self.dinputs / samples



# Optimizer

class Optimizer_SGD:
    def __init__(self, learning_rate=1.0, decay=0.0):
        self.learning_rate = learning_rate
        self.current_learning_rate = learning_rate
        self.decay = decay
        self.iterations = 0

    def pre_update_params(self):
        if self.decay:
            self.current_learning_rate = self.learning_rate * (1.0 / (1.0 + self.decay * self.iterations))

    def update_params(self, layer):
        # Simple weight and bias update without momentum
        weight_updates = -self.current_learning_rate * layer.dweights
        bias_updates = -self.current_learning_rate * layer.dbiases

        layer.weights += weight_updates
        layer.biases += bias_updates

    def post_update_params(self):
        self.iterations += 1



def get_model_structure(num_neurons_of_layers):
    layers_info = []
    
    # Create connections between consecutive layers
    for i in range(len(num_neurons_of_layers) - 1):
        current_neurons = num_neurons_of_layers[i]
        next_neurons = num_neurons_of_layers[i + 1]
        layers_info.append((current_neurons, next_neurons))

    print("Layer connections:", layers_info)
    
    # Fixed hyperparameters
    epochs = 100
    learning_rate = 0.001
    batch_size = 12

    return layers_info, batch_size



# Build and train model based on user input
def build_and_train_model(dataset , num_layers , epochs , learning_rate):



    # Dataset
    X , y = select_dataset(dataset)
    # Get model structure from user
    layers_info, batch_size = get_model_structure(num_layers)

    # Initialize layers and activations
    layers = []
    activations = []


    for i, (n_inputs, n_neurons) in enumerate(layers_info):
        layers.append(Layer_Dense(n_inputs, n_neurons))
        if i < len(layers_info) - 1:
            activations.append(Activation_ReLU())  # Use ReLU for hidden layers
        else:
            if dataset in ["spiral"]:
                activations.append(Activation_Softmax())  # Softmax for the output layer
            else:
                activations.append(Activation_Tanh())

    # Loss and optimizer
    if dataset in ["spiral"]:
        loss_function = Loss_CategoricalCrossEntropy()
    else:
        loss_function = Loss_MSE()
    optimizer = Optimizer_SGD(learning_rate=learning_rate, decay=1e-3)

    # Training loop
    for epoch in range(epochs + 1):
        for batch_start in range(0, len(X), batch_size):
            # Get a batch of data
            X_batch = X[batch_start:batch_start + batch_size]
            y_batch = y[batch_start:batch_start + batch_size]

            # Forward pass
            input_data = X_batch
            for layer, activation in zip(layers, activations):
                layer.forward(input_data)
                activation.forward(layer.output)
                input_data = activation.output

            # Calculate loss
            loss = loss_function.calculate(activations[-1].output, y_batch)
        # Print loss every 10 epochs
        if epoch % 10 == 0:
            print(f"Epoch {epoch}, loss: {loss} ")

            # Backward pass
            loss_function.backward(activations[-1].output, y_batch)
            dinputs = loss_function.dinputs

            for layer, activation in reversed(list(zip(layers, activations))):
                activation.backward(dinputs)
                layer.backward(activation.dinputs)
                dinputs = layer.dinputs

            # Update weights and biases
            optimizer.pre_update_params()
            for layer in layers:
                optimizer.update_params(layer)
            optimizer.post_update_params()
        
    metric_name = 'CategoricalCrossEntropy' if dataset in ["spiral"] else 'RMSE'
    
    print(f"\nTraining completed!")
    # print(f"Final loss: {epoch_loss:.4f}")
    print(f"Final {metric_name}: {loss}")
<<<<<<< HEAD
    loss = round(loss , 3)
=======
    loss = math.sqrt(loss)
    loss = round(loss,  3)
    print(loss)

>>>>>>> deeksBranch
        



    return metric_name ,loss



