from flask import Flask, request, jsonify
from flask_cors import CORS 
from training import build_and_train_model
from waitress import serve

app = Flask(__name__)
CORS(app)

@app.route('/train', methods=['POST'])
def train():
    # Get the JSON data from the request
    data = request.get_json()
    print(data)

    # Extract dataset information
    dataset = data.get('dataset', {})
    dataset_name = dataset.get('name')
    input_layer = dataset.get('inputLayer')
    output_layer = dataset.get('outputLayer')

    epochsLr = data.get('epochsLr')
    epochs = int(epochsLr.get('epochs'))
    learning_rate = float(epochsLr.get('lr'))

    # Extract layers information
    layers = data.get('layers', [])
    num_layers = len(layers)
    neurons_per_layer = [layer.get('neurons', 0) for layer in layers]

    # Print or use the extracted information
    print(f"Dataset Name: {dataset_name}")
    print(f"Input Layer Neurons: {input_layer}")
    print(f"Output Layer Neurons: {output_layer}")
    print(f"Number of Layers: {num_layers}")
    print(f"Neurons per Layer: {neurons_per_layer}")
    print(f"Epochs: {epochs}")
    print(f"Learning Rate: {learning_rate}")


    metric_name , loss = build_and_train_model(dataset_name , neurons_per_layer , epochs , learning_rate)

    # Send a response back to the frontend
    response = {
        "dataset_name": dataset_name,
        "num_layers": num_layers,
        "neurons_per_layer": neurons_per_layer,
        "metric_name" : metric_name,
        "loss" : loss
    }
    return jsonify(response)



if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=4000)
