# K8s Visualizer

This project helps visualize kubernetes loadbalancing and scaling capabilities, everything is run locally.

## Prerequisites

Before you begin, ensure you meet the following requirements:
- Docker
- Kubernetes


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installation

1. **Clone the repo:**
   ```bash
   git clone https://github.com/johan-codertrove/K8s-Visualizer.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd K8s-Visualizer
   ```

### Building

1. **Build the project images:**
   ```bash
   docker build -t cluster-be:kubernetes-0.0.1 ./cluster-be
   docker build -t cluster-fe:kubernetes-0.0.1 ./cluster-fe
   ```

### Running

1. **Run the project:**
   ```bash
   kubectl apply -f dev/deployments/
   kubectl apply -f dev/services/
   ```

2. **Access the project:**
    open a browser and navigate to `http://localhost:30000`

3. **Make changes to the cluster and observe new changes example:**
   ```bash
   kubectl scale deployment node-app-deployment --replicas=6 
   ```
   Click the "Connect to Cluster" button multiple times and observe loadbalancing and the new nodes created

   > **_NOTE:_**  Kubernetes load balancing uses a pseudo-random algorithm, not true round-robin. For observing load distribution, consider delaying and increasing your button clicks.        


## License

```plaintext
This project is licensed under the MIT License - see the LICENSE file for details
```