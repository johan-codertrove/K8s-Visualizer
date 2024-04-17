import { GetServerSideProps } from 'next';

interface NodeInfo {
  nodeInstance: string;
  ip: string;
  localVisits: number;
  isActive: boolean; // Flag to indicate if this is the node that handled the last request
}

interface HomeProps {
  nodes: NodeInfo[];
  totalVisits: number;
}

export default function Home(props: HomeProps) {
  return (
    <main className="p-5 space-y-6">
      <h1 className="text-blue-500 text-lg font-bold">Cluster Information</h1>
      <div className="grid grid-cols-3 gap-6">
        {props.nodes.map((node, index) => (
          <div key={index} className={`p-4 rounded-lg shadow ${node.isActive ? 'animate-bounce bg-blue-400' : 'bg-gray-200'} space-y-2`}>
            <p>Node instance: <strong>{node.nodeInstance.replace('node-app-deployment-', '')}</strong></p>
            <p>IP Address: <strong>{node.ip}</strong></p>
            <p>Local visits: <strong>{node.localVisits}</strong></p>
          </div>
        ))}
      </div>
      <div className="mb-0">
        <p className="font-medium mb-1">Total cluster visits: <strong>{props.totalVisits}</strong></p>
        <button onClick={() => window.location.reload()} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">
          Connect to Cluster
        </button>
      </div>
    </main>
  );
}


export const getServerSideProps: GetServerSideProps = async () => {
  const backendHost = process.env.BACKEND_HOST || 'http://localhost'; // Use the environment variable
  const backendPort = process.env.BACKEND_PORT || '30001'; // Use the environment variable
  try {
    const response = await fetch(`${backendHost}:${backendPort}`);
    const data = await response.json();
    return {
      props: data
    };
  } catch (error) {
    console.error('Failed to fetch server data:', error);
    return {
      props: {
        message: 'Failed to fetch data',
        nodeInstance: 'Error',
        ip: 'Error',
        localVisits: 0,
        totalVisits: 0
      }
    };
  }
};
